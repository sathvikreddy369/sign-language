import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PoseViewer3D } from "./PoseViewer3D";
import { SignImagePlaceholder } from "./SignImagePlaceholder";
import { 
  Eye, 
  Play, 
  Star, 
  Hand, 
  Target, 
  BookOpen, 
  Lightbulb, 
  AlertTriangle,
  Volume2,
  RotateCcw
} from "lucide-react";
import { Sign } from "@/lib/aslApi";

interface SignCardProps {
  sign: Sign;
  onViewDetails?: (sign: Sign) => void;
  onPractice?: (sign: Sign) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Alphabet': return '🔤';
    case 'Numbers': return '🔢';
    case 'Greetings': return '👋';
    case 'Family': return '👨‍👩‍👧‍👦';
    case 'Colors': return '🎨';
    case 'Animals': return '🐾';
    case 'Actions': return '🏃';
    case 'Emotions': return '😊';
    case 'Time': return '⏰';
    case 'Common Phrases': return '💬';
    default: return '📚';
  }
};

export const SignCard = ({ sign, onViewDetails, onPractice }: SignCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="text-2xl">{getCategoryIcon(sign.category)}</div>
          <div className="flex gap-2">
            <Badge className={getDifficultyColor(sign.difficulty)}>
              {sign.difficulty}
            </Badge>
            {sign.frequency_score > 80 && (
              <Badge variant="outline" className="text-yellow-600">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
        </div>
        
        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
          {sign.word}
          {sign.letter && <span className="text-sm text-gray-500 ml-2">({sign.letter})</span>}
        </CardTitle>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {sign.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Sign Image/Visualization */}
        <div className="relative aspect-video rounded-lg overflow-hidden group/image">
          {sign.image_url && !imageError ? (
            <img 
              src={sign.image_url}
              alt={`ASL sign for ${sign.word}`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <SignImagePlaceholder
              word={sign.word}
              letter={sign.letter}
              category={sign.category}
              className="w-full h-full"
            />
          )}
          
          {/* Overlay button for 3D view */}
          <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/image:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowViewer(true)}
              className="bg-white/90 hover:bg-white text-gray-900"
            >
              <Eye className="h-3 w-3 mr-1" />
              View 3D
            </Button>
          </div>
        </div>

        {/* Sign Details */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Hand className="h-4 w-4" />
            {sign.two_handed ? 'Two-handed' : 'One-handed'}
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            {sign.location}
          </div>
        </div>

        {/* Tags */}
        {sign.tags && sign.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {sign.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {sign.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{sign.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onViewDetails?.(sign)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getCategoryIcon(sign.category)} {sign.word}
                  {sign.letter && <span className="text-sm text-gray-500">({sign.letter})</span>}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* 3D Viewer */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    3D Visualization
                  </h4>
                  <PoseViewer3D selectedSign={sign.word} showControls={false} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Instructions */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      How to Sign
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {sign.instructions}
                    </p>
                    
                    {/* Sign Image */}
                    <div className="aspect-video rounded-lg overflow-hidden">
                      {sign.image_url && !imageError ? (
                        <img 
                          src={sign.image_url}
                          alt={`ASL sign for ${sign.word}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <SignImagePlaceholder
                          word={sign.word}
                          letter={sign.letter}
                          category={sign.category}
                          className="w-full h-full"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div>
                    <h4 className="font-semibold mb-3">Sign Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Category:</span>
                        <Badge variant="outline">{sign.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Difficulty:</span>
                        <Badge className={getDifficultyColor(sign.difficulty)}>
                          {sign.difficulty}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Hand Shape:</span>
                        <span>{sign.hand_shape}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Movement:</span>
                        <span>{sign.movement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Location:</span>
                        <span>{sign.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Hands Used:</span>
                        <span>{sign.two_handed ? 'Both hands' : 'One hand'}</span>
                      </div>
                      {sign.dominant_hand && (
                        <div className="flex justify-between">
                          <span className="font-medium">Dominant Hand:</span>
                          <span>{sign.dominant_hand}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tips */}
                {sign.tips && sign.tips.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Helpful Tips
                    </h4>
                    <ul className="space-y-2">
                      {sign.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-blue-500 mt-1 flex-shrink-0">💡</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Common Mistakes */}
                {sign.common_mistakes && sign.common_mistakes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Common Mistakes to Avoid
                    </h4>
                    <ul className="space-y-2">
                      {sign.common_mistakes.map((mistake, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-red-500 mt-1 flex-shrink-0">⚠️</span>
                          {mistake}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Usage Examples */}
                {sign.usage_examples && sign.usage_examples.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Usage Examples</h4>
                    <ul className="space-y-1">
                      {sign.usage_examples.map((example, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 italic">
                          "{example}"
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Related Words */}
                {sign.synonyms && sign.synonyms.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Related Words</h4>
                    <div className="flex flex-wrap gap-2">
                      {sign.synonyms.map((synonym, idx) => (
                        <Badge key={idx} variant="secondary">
                          {synonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cultural Notes */}
                {sign.cultural_notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Cultural Notes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sign.cultural_notes}
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onPractice?.(sign)}
          >
            <Play className="h-4 w-4 mr-2" />
            Practice
          </Button>
        </div>
      </CardContent>

      {/* 3D Viewer Dialog */}
      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>3D View: {sign.word}</DialogTitle>
          </DialogHeader>
          <PoseViewer3D selectedSign={sign.word} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};