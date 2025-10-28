import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PlayCircle, 
  BookOpen, 
  Hand, 
  Users, 
  Target, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const quickStartSteps = [
  {
    id: 1,
    title: "Start with the Alphabet",
    description: "Learn the 26 letters of ASL fingerspelling",
    icon: "🔤",
    duration: "30 min",
    difficulty: "Beginner",
    link: "/lesson/alphabet-basics",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: 2,
    title: "Basic Greetings",
    description: "Master essential polite expressions",
    icon: "👋",
    duration: "25 min", 
    difficulty: "Beginner",
    link: "/lesson/basic-greetings",
    color: "from-purple-400 to-purple-600"
  },
  {
    id: 3,
    title: "Numbers 1-10",
    description: "Learn to count and use numbers in ASL",
    icon: "🔢",
    duration: "20 min",
    difficulty: "Beginner", 
    link: "/lesson/numbers-1-10",
    color: "from-green-400 to-green-600"
  }
];

export const QuickStartGuide = () => {
  return (
    <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-xl">Quick Start Guide</CardTitle>
          <Badge variant="secondary" className="ml-auto">
            New to ASL?
          </Badge>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Never learned ASL before? Start here! These three lessons will give you a solid foundation.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {quickStartSteps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg border bg-white dark:bg-gray-800">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white text-xl font-bold`}>
                  {step.id}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{step.icon}</span>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {step.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {step.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <PlayCircle className="h-3 w-3" />
                    {step.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Hand className="h-3 w-3" />
                    Interactive
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Button asChild size="sm">
                  <Link to={step.link}>
                    Start
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold mb-1">Complete the Quick Start Path</h4>
              <p className="text-sm text-blue-100">
                Finish all three lessons to unlock intermediate content and earn your first badge!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <span className="text-sm font-medium">75 min total</span>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Already know the basics? Jump to any lesson that interests you.
          </p>
          <Button variant="outline" asChild>
            <Link to="#lessons">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse All Lessons
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};