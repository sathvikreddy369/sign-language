import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  Star,
  Hand,
  Eye,
  Lightbulb,
  AlertTriangle,
  Volume2,
  RotateCcw
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getLesson, type Lesson } from "@/lib/aslApi";

const LessonDetailPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedSigns, setCompletedSigns] = useState<Set<number>>(new Set());
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (lessonId) {
      loadLesson(lessonId);
    }
  }, [lessonId]);

  const loadLesson = async (slug: string) => {
    setLoading(true);
    try {
      const result = await getLesson(slug);
      if (result.success && result.lesson) {
        setLesson(result.lesson);
        setProgress(0);
        setCurrentSignIndex(0);
        setCompletedSigns(new Set());
      } else {
        toast({
          title: "Lesson not found",
          description: result.error || "The requested lesson could not be loaded",
          variant: "destructive"
        });
        navigate('/sign-school');
      }
    } catch (error) {
      console.error('Failed to load lesson:', error);
      toast({
        title: "Error loading lesson",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markSignComplete = (index: number) => {
    const newCompleted = new Set(completedSigns);
    newCompleted.add(index);
    setCompletedSigns(newCompleted);
    
    const newProgress = (newCompleted.size / (lesson?.signs?.length || 1)) * 100;
    setProgress(newProgress);
    
    toast({
      title: "Sign completed!",
      description: `Progress: ${Math.round(newProgress)}%`
    });

    if (newProgress === 100) {
      toast({
        title: "Lesson completed! 🎉",
        description: "Great job! You've mastered this lesson."
      });
    }
  };

  const nextSign = () => {
    if (lesson?.signs && currentSignIndex < lesson.signs.length - 1) {
      setCurrentSignIndex(currentSignIndex + 1);
    }
  };

  const prevSign = () => {
    if (currentSignIndex > 0) {
      setCurrentSignIndex(currentSignIndex - 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
        <p className="text-gray-600 mb-4">The requested lesson could not be found.</p>
        <Link to="/sign-school">
          <Button>Back to Sign School</Button>
        </Link>
      </div>
    );
  }

  const currentSign = lesson.signs?.[currentSignIndex];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <SEO 
        title={`${lesson.title} — ASL Sign School`} 
        description={lesson.description} 
      />
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/sign-school')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to School
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{lesson.description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Lesson Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{completedSigns.size} of {lesson.signs?.length || 0} signs completed</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lesson.duration_minutes} min lesson
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Sign Display */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Hand className="h-5 w-5" />
                  {currentSign ? currentSign.letter_or_word : 'Select a sign'}
                </CardTitle>
                {currentSign && (
                  <Badge className={getDifficultyColor(currentSign.difficulty)}>
                    {currentSign.difficulty}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {currentSign ? (
                <>
                  {/* Sign Visualization */}
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    {currentSign.image_url ? (
                      <img 
                        src={currentSign.image_url} 
                        alt={`Sign for ${currentSign.letter_or_word}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <Hand className="h-16 w-16 mx-auto mb-4" />
                        <p>Sign visualization for "{currentSign.letter_or_word}"</p>
                        <p className="text-sm mt-2">Image coming soon</p>
                      </div>
                    )}
                  </div>

                  {/* Sign Description */}
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentSign.description}
                    </p>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={prevSign}
                      disabled={currentSignIndex === 0}
                    >
                      <SkipBack className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {currentSignIndex + 1} of {lesson.signs?.length || 0}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      onClick={nextSign}
                      disabled={!lesson.signs || currentSignIndex === lesson.signs.length - 1}
                    >
                      Next
                      <SkipForward className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant={completedSigns.has(currentSignIndex) ? "outline" : "default"}
                      onClick={() => markSignComplete(currentSignIndex)}
                      className="flex-1"
                    >
                      {completedSigns.has(currentSignIndex) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Mark Complete
                        </>
                      )}
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Instructions
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>How to Sign "{currentSign.letter_or_word}"</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              Step-by-step Instructions
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {currentSign.description}
                            </p>
                          </div>
                          
                          {currentSign.tips && currentSign.tips.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" />
                                Tips
                              </h4>
                              <ul className="space-y-1">
                                {currentSign.tips.map((tip, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {currentSign.common_mistakes && currentSign.common_mistakes.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Common Mistakes
                              </h4>
                              <ul className="space-y-1">
                                {currentSign.common_mistakes.map((mistake, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                    <span className="text-red-500 mt-1">•</span>
                                    {mistake}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a sign from the lesson overview to begin
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lesson Overview Sidebar */}
        <div className="space-y-6">
          {/* Lesson Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lesson Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="px-3 py-1">
                  {lesson.level}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {lesson.duration_minutes} min
                </div>
              </div>

              {lesson.learning_objectives && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Learning Goals
                  </h4>
                  <ul className="space-y-1">
                    {lesson.learning_objectives.map((objective, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Signs List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Signs in this Lesson</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {lesson.signs?.map((sign, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      index === currentSignIndex 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setCurrentSignIndex(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        completedSigns.has(index) 
                          ? 'bg-green-500 text-white' 
                          : index === currentSignIndex
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {completedSigns.has(index) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{sign.letter_or_word}</p>
                        <p className="text-xs text-gray-500 truncate max-w-32">
                          {sign.description}
                        </p>
                      </div>
                    </div>
                    
                    <Badge className={getDifficultyColor(sign.difficulty)} variant="outline">
                      {sign.difficulty}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Practice Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Practice Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast({ title: "Practice mode", description: "Practice exercises coming soon!" })}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Practice Quiz
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast({ title: "Review mode", description: "Review completed signs" })}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Review Completed
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;