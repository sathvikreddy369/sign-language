import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WebcamPanel } from "@/components/translate/WebcamPanel";
import { VideoUploader } from "@/components/translate/VideoUploader";
import { RecognitionPanel } from "@/components/translate/RecognitionPanel";
import { HistoryPanel } from "@/components/translate/HistoryPanel";
import { Camera, Upload, Info } from "lucide-react";

const TranslatePage = () => {
  const [tab, setTab] = useState<'webcam' | 'upload'>('webcam');
  const [currentSign, setCurrentSign] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);

  const handlePrediction = (prediction: string, conf: number) => {
    setCurrentSign(prediction);
    setConfidence(conf);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <SEO title="ASL Translation — Gesture Bridge" description="Real-time American Sign Language recognition and translation with advanced AI." />
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ASL Translation
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Real-time American Sign Language recognition powered by advanced AI. 
          Translate your signs into text instantly with high accuracy.
        </p>
      </div>

      {/* Mode Selection */}
      <Card className="max-w-md mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-center text-lg">Choose Input Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={tab === 'webcam' ? 'default' : 'outline'} 
              onClick={() => setTab('webcam')}
              className="flex items-center gap-2 h-12"
            >
              <Camera className="h-4 w-4" />
              Live Camera
            </Button>
            <Button 
              variant={tab === 'upload' ? 'default' : 'outline'} 
              onClick={() => setTab('upload')}
              className="flex items-center gap-2 h-12"
            >
              <Upload className="h-4 w-4" />
              Upload Video
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {/* Input Panel */}
        <div className="lg:col-span-2 xl:col-span-3">
          {tab === 'webcam' ? (
            <WebcamPanel onPrediction={handlePrediction} />
          ) : (
            <VideoUploader />
          )}
        </div>

        {/* Recognition Panel */}
        <div className="lg:col-span-1 xl:col-span-1">
          <RecognitionPanel currentSign={currentSign} confidence={confidence} />
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900">About ASL Recognition</h3>
              <p className="text-sm text-blue-800">
                Our AI model recognizes American Sign Language letters (A-Z) plus special commands like 'space' and 'del'. 
                The system works best with clear hand positioning, good lighting, and steady movements.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">Real-time Processing</Badge>
                <Badge variant="secondary" className="text-xs">High Accuracy</Badge>
                <Badge variant="secondary" className="text-xs">Accessibility Focused</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Panel */}
      <div>
        <HistoryPanel />
      </div>
    </div>
  );
};

export default TranslatePage;
