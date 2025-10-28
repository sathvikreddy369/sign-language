import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { predictSign, videoFrameToBase64, checkHealth } from "@/lib/aslApi";
import { toast } from "@/components/ui/use-toast";
import { Camera, CameraOff, Play, Square, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";

interface WebcamPanelProps {
  onFrame?: (ts: number) => void;
  onPrediction?: (prediction: string, confidence: number) => void;
}

export const WebcamPanel = ({ onFrame, onPrediction }: WebcamPanelProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [topPreds, setTopPreds] = useState<Array<[string, number]>>([]);
  const [mirrorInput, setMirrorInput] = useState<boolean>(true);
  const [apiStatus, setApiStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const lastPredictionTime = useRef<number>(0);
  const inFlight = useRef<boolean>(false);

  // Smoothing buffer for temporal stability
  const bufferRef = useRef<{ label: string; conf: number }[]>([]);
  const MAX_BUFFER = 7; // ~3.5s at 500ms cadence
  const CONF_THRESHOLD = 0.6; // More accessible threshold
  const HIGH_CONF_THRESHOLD = 0.85; // fast-path: emit immediately when very confident

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        setApiStatus('checking');
        await checkHealth();
        setApiStatus('healthy');
        setErrorMessage('');
      } catch (error) {
        setApiStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'API connection failed');
        toast({
          title: "Connection Error",
          description: "Unable to connect to the recognition service. Please check if the server is running.",
          variant: "destructive"
        });
      }
    };
    
    checkApiHealth();
  }, []);

  useEffect(() => {
    if (!active) return;
    let stream: MediaStream;
    const enable = async () => {
      try {
        setIsLoading(true);
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          toast({
            title: "Camera Ready",
            description: "Position your hand in the highlighted area to start recognition"
          });
        }
      } catch (e) {
        console.error('Webcam error', e);
        toast({
          title: "Camera Error",
          description: "Unable to access camera. Please check permissions and try again.",
          variant: "destructive"
        });
        setActive(false);
      } finally {
        setIsLoading(false);
      }
    };
    enable();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [active]);

  useEffect(() => {
    let raf = 0;
    const draw = async (time: number) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) { 
        raf = requestAnimationFrame(draw); 
        return; 
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) { 
        raf = requestAnimationFrame(draw); 
        return; 
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw ROI rectangle (region of interest for sign detection)
      const roiSize = Math.min(224, Math.min(canvas.width, canvas.height) * 0.6);
      const x = (canvas.width - roiSize) / 2;
      const y = (canvas.height - roiSize) / 2;
      
      // Enhanced ROI visualization
      ctx.strokeStyle = isRecognizing ? '#22c55e' : '#eab308';
      ctx.lineWidth = 4;
      ctx.setLineDash(isRecognizing ? [] : [10, 5]);
      ctx.strokeRect(x, y, roiSize, roiSize);
      
      // Corner markers for better visibility
      const cornerSize = 20;
      ctx.setLineDash([]);
      ctx.lineWidth = 3;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(x, y + cornerSize);
      ctx.lineTo(x, y);
      ctx.lineTo(x + cornerSize, y);
      ctx.stroke();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(x + roiSize - cornerSize, y);
      ctx.lineTo(x + roiSize, y);
      ctx.lineTo(x + roiSize, y + cornerSize);
      ctx.stroke();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(x, y + roiSize - cornerSize);
      ctx.lineTo(x, y + roiSize);
      ctx.lineTo(x + cornerSize, y + roiSize);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(x + roiSize - cornerSize, y + roiSize);
      ctx.lineTo(x + roiSize, y + roiSize);
      ctx.lineTo(x + roiSize, y + roiSize - cornerSize);
      ctx.stroke();
      
      // Display current prediction with better styling
      if ((currentPrediction && currentPrediction !== 'nothing') || topPreds.length) {
        const panelWidth = Math.min(300, canvas.width - 20);
        const panelHeight = 100;
        
        // Background with rounded corners effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(10, 10, panelWidth, panelHeight);
        
        // Main prediction
        ctx.fillStyle = confidence >= 0.8 ? '#22c55e' : confidence >= 0.6 ? '#eab308' : '#ef4444';
        ctx.font = 'bold 28px Arial';
        ctx.fillText(`${currentPrediction || '—'}`, 20, 45);
        
        // Confidence
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.fillText(`${(confidence * 100).toFixed(1)}% confidence`, 20, 65);
        
        // Top predictions
        if (topPreds.length) {
          ctx.fillStyle = '#d1d5db';
          ctx.font = '12px Arial';
          const friendly = topPreds.slice(0, 3).map(([k, v]) => `${k}: ${(v * 100).toFixed(0)}%`).join(' | ');
          ctx.fillText(friendly, 20, 85);
        }
      }
      
      // Perform prediction every 500ms when recognizing; avoid overlapping requests
      if (isRecognizing && !inFlight.current && time - lastPredictionTime.current > 500) {
        lastPredictionTime.current = time;
        try {
          inFlight.current = true;
          const base64Image = videoFrameToBase64(video, x, y, roiSize, roiSize, {
            mirror: mirrorInput,
            format: 'jpeg',
            quality: 0.95,
          });
          const result = await predictSign(base64Image);
          
          if (result.success && result.prediction && typeof result.confidence === 'number') {
            if (result.top_predictions) {
              const entries = Object.entries(result.top_predictions)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);
              setTopPreds(entries);
            } else {
              setTopPreds([]);
            }

            // Fast-path: if confidence is very high, emit immediately (and seed buffer)
            if (result.confidence >= HIGH_CONF_THRESHOLD) {
              bufferRef.current = [{ label: result.prediction, conf: result.confidence }];
              setCurrentPrediction(result.prediction);
              setConfidence(result.confidence);
              onPrediction?.(result.prediction, result.confidence);
            } else {
              // Push into buffer with confidence filtering
              const incomingLabel = result.confidence >= CONF_THRESHOLD ? result.prediction : 'nothing';
              const incomingConf = result.confidence >= CONF_THRESHOLD ? result.confidence : 0;

              bufferRef.current.push({ label: incomingLabel, conf: incomingConf });
              if (bufferRef.current.length > MAX_BUFFER) bufferRef.current.shift();

              // Compute majority label in buffer (excluding 'nothing' unless it's dominant)
              const counts = new Map<string, { n: number; avg: number }>();
              for (const { label, conf } of bufferRef.current) {
                const prev = counts.get(label) || { n: 0, avg: 0 };
                const n = prev.n + 1;
                const avg = (prev.avg * prev.n + conf) / n;
                counts.set(label, { n, avg });
              }

              // Identify stable label
              let stableLabel = 'nothing';
              let stableCount = 0;
              let stableAvg = 0;
              counts.forEach((val, key) => {
                if (val.n > stableCount) {
                  stableCount = val.n;
                  stableLabel = key;
                  stableAvg = val.avg;
                }
              });

              // Require at least 3 occurrences in buffer to switch label
              const isStable = stableCount >= Math.min(3, MAX_BUFFER);
              const finalLabel = isStable ? stableLabel : 'nothing';
              const finalConf = isStable ? stableAvg : 0;

              setCurrentPrediction(finalLabel);
              setConfidence(finalConf);
              onPrediction?.(finalLabel, finalConf);
            }
          }
        } catch (error) {
          console.error('Prediction error:', error);
          setApiStatus('error');
          setErrorMessage(error instanceof Error ? error.message : 'Prediction failed');
          toast({
            title: "Recognition Error",
            description: "Failed to process sign. Please check your connection.",
            variant: "destructive"
          });
        } finally {
          inFlight.current = false;
        }
      }
      
      onFrame?.(time);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [onFrame, isRecognizing, onPrediction]);

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'healthy': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'healthy': return <CheckCircle2 className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg">Camera Recognition</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              {getStatusIcon()}
              <span className="hidden sm:inline">
                {apiStatus === 'checking' && 'Connecting...'}
                {apiStatus === 'healthy' && 'Connected'}
                {apiStatus === 'error' && 'Connection Error'}
              </span>
              <span className="sm:hidden">
                {apiStatus === 'checking' && 'Connecting'}
                {apiStatus === 'healthy' && 'Ready'}
                {apiStatus === 'error' && 'Error'}
              </span>
            </span>
          </div>
        </div>
        {errorMessage && (
          <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 p-3 rounded-lg mt-2">
            {errorMessage}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative aspect-video w-full bg-muted" aria-label="Webcam preview">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p>Starting camera...</p>
              </div>
            </div>
          )}
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover" 
            playsInline 
            muted 
            style={{ transform: mirrorInput ? 'scaleX(-1)' : 'none' }}
          />
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
          
          {!active && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-white text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Camera Off</p>
                <p className="text-sm opacity-75">Click "Start Camera" to begin</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Status and Controls */}
        <div className="p-4 space-y-4">
          {/* Current Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {isRecognizing ? (
                <Badge variant="default" className="bg-green-500">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse mr-1" />
                  <span className="hidden sm:inline">Recognizing</span>
                  <span className="sm:hidden">Active</span>
                </Badge>
              ) : active ? (
                <Badge variant="secondary">
                  <span className="hidden sm:inline">Camera Active</span>
                  <span className="sm:hidden">Ready</span>
                </Badge>
              ) : (
                <Badge variant="outline">
                  <span className="hidden sm:inline">Camera Off</span>
                  <span className="sm:hidden">Off</span>
                </Badge>
              )}
            </div>
            
            {confidence > 0 && (
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm text-muted-foreground hidden sm:inline">Confidence:</span>
                <Progress value={confidence * 100} className="flex-1 sm:w-20 h-2" />
                <span className="text-sm font-medium whitespace-nowrap">{(confidence * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant={active ? 'destructive' : 'default'} 
              onClick={() => {
                setActive(v => !v);
                if (active) {
                  setIsRecognizing(false);
                  setCurrentPrediction('');
                  setConfidence(0);
                  setTopPreds([]);
                }
              }}
              disabled={isLoading || apiStatus === 'error'}
              className="flex items-center gap-2 touch-target"
            >
              {active ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
              <span className="hidden sm:inline">
                {active ? 'Stop Camera' : 'Start Camera'}
              </span>
              <span className="sm:hidden">
                {active ? 'Stop' : 'Start'}
              </span>
            </Button>
            
            {active && (
              <div className="flex gap-2">
                <Button 
                  variant={isRecognizing ? 'outline' : 'default'}
                  onClick={() => {
                    setIsRecognizing(v => !v);
                    if (!isRecognizing) {
                      toast({ 
                        title: "Recognition Started", 
                        description: "Position your hand in the highlighted area" 
                      });
                      bufferRef.current = [];
                    } else {
                      setCurrentPrediction('');
                      setConfidence(0);
                      bufferRef.current = [];
                    }
                  }}
                  disabled={apiStatus === 'error'}
                  className="flex items-center gap-2 touch-target flex-1 sm:flex-initial"
                >
                  {isRecognizing ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span className="hidden sm:inline">
                    {isRecognizing ? 'Stop Recognition' : 'Start Recognition'}
                  </span>
                  <span className="sm:hidden">
                    {isRecognizing ? 'Stop' : 'Recognize'}
                  </span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMirrorInput(m => !m)}
                  title="Toggle horizontal mirroring"
                  className="flex items-center gap-2 touch-target"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Mirror: {mirrorInput ? 'On' : 'Off'}</span>
                  <span className="sm:hidden">{mirrorInput ? 'On' : 'Off'}</span>
                </Button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p className="font-medium mb-2">Quick Tips:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
              <div>• Clear hand positioning</div>
              <div>• Good lighting helps</div>
              <div>• Hold signs steady (1-2s)</div>
              <div>• Brief pauses between signs</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
