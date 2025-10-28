import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Copy, Trash2, Space, Delete, Volume2, VolumeX } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface RecognitionPanelProps {
  currentSign?: string;
  confidence?: number;
}

export const RecognitionPanel = ({ currentSign = '', confidence = 0 }: RecognitionPanelProps) => {
  const [text, setText] = useState("");
  const [lastSign, setLastSign] = useState("");
  const [holdTime, setHoldTime] = useState(0);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const HOLD_THRESHOLD = 1.2; // Reduced for better accessibility
  const CONF_THRESHOLD = 0.6; // More accessible threshold
  const HIGH_CONF_THRESHOLD = 0.85; // fast-path appending
  const appendedLockRef = useRef<string | null>(null); // prevent repeated appends without a break

  // Update counts when text changes
  useEffect(() => {
    setCharCount(text.length);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  }, [text]);

  // Text-to-speech function
  const speakText = (textToSpeak: string) => {
    if (speechEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Handle sign accumulation with stability and lock to avoid jitter
  const handleSignDetection = (sign: string, conf: number) => {
    const isValid = sign !== 'nothing' && conf >= CONF_THRESHOLD;

    // Unlock when hand removed or sign changes to nothing
    if (!isValid) {
      setHoldTime(0);
      setLastSign('');
      appendedLockRef.current = null;
      return;
    }

    // Fast-path: very high confidence => append immediately once per hold
    if (conf >= HIGH_CONF_THRESHOLD) {
      if (appendedLockRef.current !== sign) {
        if (sign === 'space') {
          setText(prevText => prevText + ' ');
          speakText('space');
          toast({ title: "Added Space", description: "Space character added" });
        } else if (sign === 'del') {
          setText(prevText => prevText.slice(0, -1));
          speakText('delete');
          toast({ title: "Deleted Character", description: "Last character removed" });
        } else {
          setText(prevText => prevText + sign);
          speakText(sign);
          toast({ title: `Added: ${sign}`, description: `Letter ${sign} added to text` });
        }
        appendedLockRef.current = sign;
      }
      // Keep lastSign to the current sign and clamp hold
      setLastSign(sign);
      setHoldTime(HOLD_THRESHOLD);
      return;
    }

    // If same sign is held
    if (sign === lastSign) {
      setHoldTime(prev => {
        const next = prev + 0.5; // called every ~500ms
        if (next >= HOLD_THRESHOLD) {
          // Only append once per continuous hold of the same sign
          if (appendedLockRef.current !== sign) {
            if (sign === 'space') {
              setText(prevText => prevText + ' ');
              speakText('space');
              toast({ title: "Added Space", description: "Space character added" });
            } else if (sign === 'del') {
              setText(prevText => {
                const newText = prevText.slice(0, -1);
                return newText;
              });
              speakText('delete');
              toast({ title: "Deleted Character", description: "Last character removed" });
            } else {
              setText(prevText => prevText + sign);
              speakText(sign);
              toast({ title: `Added: ${sign}`, description: `Letter ${sign} added to text` });
            }
            appendedLockRef.current = sign;
          }
          return HOLD_THRESHOLD; // clamp
        }
        return next;
      });
    } else {
      // New sign encountered; start counting stability
      setLastSign(sign);
      setHoldTime(0);
      // Do not clear lock here; will clear when 'nothing' seen to require a brief break
    }
  };

  // Wire incoming predictions to accumulation logic
  useEffect(() => {
    // Inference cadence is ~500ms from WebcamPanel; follow same ticking assumption
    handleSignDetection(currentSign, confidence);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSign, confidence]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const clearText = () => {
    setText("");
    setLastSign("");
    setHoldTime(0);
    toast({ title: "Text cleared" });
  };

  return (
    <div className="space-y-4">
      {/* Recognized Text Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recognized Text</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {charCount} chars, {wordCount} words
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSpeechEnabled(!speechEnabled)}
                title={speechEnabled ? "Disable speech" : "Enable speech"}
              >
                {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Text Display */}
          <div className="rounded-lg border p-4 min-h-24 bg-muted/30 relative">
            <p className="text-lg leading-relaxed font-mono break-words">
              {text || (
                <span className="text-muted-foreground italic">
                  Start recognition to see translated text appear here...
                </span>
              )}
            </p>
            {text && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => speakText(text)}
                className="absolute top-2 right-2"
                title="Read text aloud"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setText(prev => prev + ' ');
                speakText('space');
                toast({ title: "Added Space", description: "Space character added" });
              }}
              className="flex items-center gap-1"
            >
              <Space className="h-3 w-3" />
              Add Space
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setText(prev => prev.slice(0, -1));
                speakText('delete');
                toast({ title: "Deleted Character", description: "Last character removed" });
              }}
              disabled={!text}
              className="flex items-center gap-1"
            >
              <Delete className="h-3 w-3" />
              Backspace
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={copyToClipboard}
              disabled={!text}
              className="flex items-center gap-1"
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={clearText}
              disabled={!text}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Detection Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Current Detection</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-lg border p-4 min-h-16 bg-muted/30">
            {currentSign && currentSign !== 'nothing' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-primary">{currentSign}</span>
                  <Badge 
                    variant={confidence >= 0.8 ? "default" : confidence >= 0.6 ? "secondary" : "destructive"}
                    className="text-sm"
                  >
                    {(confidence * 100).toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={confidence * 100} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Hold steady for {HOLD_THRESHOLD}s to add</span>
                  <span>{holdTime.toFixed(1)}s / {HOLD_THRESHOLD}s</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-16">
                <p className="text-muted-foreground text-center">
                  No sign detected<br />
                  <span className="text-xs">Position your hand in the camera frame</span>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <h4 className="font-semibold text-blue-900">How to Use:</h4>
            <ul className="space-y-1 text-blue-800 text-xs">
              <li>• <strong>Position:</strong> Keep your hand clearly within the camera frame</li>
              <li>• <strong>Hold:</strong> Maintain each sign for {HOLD_THRESHOLD} seconds to add it</li>
              <li>• <strong>Pause:</strong> Remove your hand briefly between different signs</li>
              <li>• <strong>Special Signs:</strong> Use 'space' for spaces and 'del' for deletion</li>
              <li>• <strong>Lighting:</strong> Ensure good lighting for better recognition</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
