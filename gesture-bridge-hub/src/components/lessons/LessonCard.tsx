import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  PlayCircle, 
  Clock, 
  CheckCircle, 
  Star,
  Users,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { Lesson } from "@/lib/aslApi";

interface LessonCardProps {
  lesson: Lesson;
  progress?: number;
  isCompleted?: boolean;
  isPopular?: boolean;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
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

const getCategoryGradient = (category: string) => {
  switch (category) {
    case 'Alphabet': return 'from-blue-400 to-blue-600';
    case 'Numbers': return 'from-green-400 to-green-600';
    case 'Greetings': return 'from-purple-400 to-purple-600';
    case 'Family': return 'from-pink-400 to-pink-600';
    case 'Colors': return 'from-red-400 to-red-600';
    case 'Animals': return 'from-yellow-400 to-yellow-600';
    case 'Actions': return 'from-indigo-400 to-indigo-600';
    case 'Emotions': return 'from-orange-400 to-orange-600';
    case 'Time': return 'from-teal-400 to-teal-600';
    case 'Common Phrases': return 'from-cyan-400 to-cyan-600';
    default: return 'from-gray-400 to-gray-600';
  }
};

export const LessonCard = ({ lesson, progress = 0, isCompleted = false, isPopular = false }: LessonCardProps) => {
  const gradientClass = getCategoryGradient(lesson.category);
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Header with gradient background */}
      <div className={`relative h-24 bg-gradient-to-br ${gradientClass} p-4`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between h-full text-white">
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {getCategoryIcon(lesson.category)}
            </div>
            <div>
              <div className="font-semibold text-sm opacity-90">
                {lesson.category}
              </div>
              <div className="text-xs opacity-75">
                {lesson.level} Level
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            {isPopular && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-500/20 text-white border-green-300/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge className={getLevelColor(lesson.level)}>
            {lesson.level}
          </Badge>
        </div>
        
        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
          {lesson.title}
        </CardTitle>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {lesson.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress bar (if progress > 0) */}
        {progress > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Progress
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Lesson stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {lesson.duration_minutes} min
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {lesson.signs_count || 0} signs
          </div>
        </div>

        {/* Learning objectives preview */}
        {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              You'll learn:
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              {lesson.learning_objectives.slice(0, 2).map((objective, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{objective}</span>
                </li>
              ))}
              {lesson.learning_objectives.length > 2 && (
                <li className="text-xs text-gray-500 italic">
                  +{lesson.learning_objectives.length - 2} more objectives
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Action button */}
        <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
          <Link to={`/lesson/${lesson.slug}`}>
            <PlayCircle className="h-4 w-4 mr-2" />
            {progress > 0 ? 'Continue Lesson' : 'Start Lesson'}
          </Link>
        </Button>

        {/* Additional info */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>Interactive</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            <span>Practice Included</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};