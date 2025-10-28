import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Camera, 
  BookOpen,
  Hand
} from "lucide-react";

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const quickLinks = [
    {
      title: "Start Translating",
      description: "Real-time ASL translation",
      href: "/translate",
      icon: Camera,
      color: "bg-blue-500"
    },
    {
      title: "Sign School",
      description: "Learn ASL interactively",
      href: "/sign-school",
      icon: BookOpen,
      color: "bg-green-500"
    },
    {
      title: "Pose Library",
      description: "Browse sign database",
      href: "/poses",
      icon: Search,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4">
      <SEO title="Page Not Found — Gesture Bridge" description="The page you're looking for doesn't exist." />
      
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
            <Hand className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/">
            <Button className="flex items-center gap-2 px-6 py-3">
              <Home className="h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Or explore these popular features:
          </h3>
          
          <div className="grid gap-4 md:grid-cols-3">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link key={index} to={link.href}>
                  <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${link.color} mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600">
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {link.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you believe this is an error, please{" "}
            <Link to="/contact" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
