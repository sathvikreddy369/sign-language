import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Video, 
  Play, 
  Pause, 
  RotateCcw, 
  FileVideo,
  AlertCircle,
  CheckCircle2,
  X
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface VideoUploaderProps {
  onLoaded?: (video: HTMLVideoElement) => void;
  onPrediction?: (prediction: string, confidence: number) => void;
}

export const VideoUploader = ({ onLoaded, onPrediction }: VideoUploaderProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onFile = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: "File too large",
        description: "Please select a video file smaller than 100MB.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    const url = URL.createObjectURL(file);
    const video = videoRef.current!;
    
    video.src = url;
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    video.onloadeddata = () => {
      setDuration(video.duration);
      onLoaded?.(video);
      toast({
        title: "Video loaded successfully",
        description: "You can now play and analyze the video."
      });
    };

    video.ontimeupdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.onplay = () => setIsPlaying(true);
    video.onpause = () => setIsPlaying(false);
    video.onended = () => setIsPlaying(false);
  }, [onLoaded]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFile(e.dataTransfer.files[0]);
    }
  }, [onFile]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const resetVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.pause();
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const clearVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.src = '';
    setFileName(null);
    setFileSize(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setUploadProgress(0);
    setIsProcessing(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video Upload & Analysis
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Video Display Area */}
        <div className="relative">
          <div 
            className={`aspect-video rounded-lg border-2 border-dashed transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                : fileName 
                  ? 'border-gray-300 bg-black' 
                  : 'border-gray-300 bg-gray-50 dark:bg-gray-800'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {fileName ? (
              <video 
                ref={videoRef} 
                controls 
                className="w-full h-full rounded-lg"
                controlsList="nodownload"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <FileVideo className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Upload a video file
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop your video here, or click to browse
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supports MP4, WebM, AVI • Max 100MB
                </p>
              </div>
            )}
          </div>

          {/* Clear button */}
          {fileName && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearVideo}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Upload Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing video...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* File Info */}
        {fileName && !isProcessing && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-48">
                  {fileName}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{fileSize}</span>
                  {duration > 0 && (
                    <>
                      <span>•</span>
                      <span>{formatTime(duration)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Ready
            </Badge>
          </div>
        )}

        {/* Video Controls */}
        {fileName && duration > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlayPause}
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetVideo}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              
              <div className="flex-1 text-center text-sm text-gray-600 dark:text-gray-400">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <Progress value={(currentTime / duration) * 100} className="h-2" />
          </div>
        )}

        {/* Upload Button */}
        <div className="flex justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => e.target.files && onFile(e.target.files[0])}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
            disabled={isProcessing}
          >
            <Upload className="h-4 w-4" />
            {fileName ? 'Upload Different Video' : 'Choose Video File'}
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Video Analysis Tips:
              </p>
              <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                <li>• Ensure clear visibility of hand gestures</li>
                <li>• Good lighting improves recognition accuracy</li>
                <li>• Keep signs within the frame boundaries</li>
                <li>• Avoid rapid movements between signs</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
