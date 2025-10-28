import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { 
  Camera, 
  BookOpen, 
  Search, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Globe
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Camera,
      title: "Real-time Translation",
      description: "Translate American Sign Language in real-time using your webcam with advanced AI recognition.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Learn ASL with our comprehensive Sign School featuring interactive lessons and practice sessions.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Search,
      title: "Pose Library",
      description: "Explore our extensive library of ASL signs with 3D visualizations and detailed instructions.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "High Accuracy",
      description: "Our AI model achieves high accuracy rates with continuous learning and improvement.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your video data is processed locally and never stored or transmitted to our servers.",
      color: "from-red-500 to-rose-500"
    },
    {
      icon: Users,
      title: "Accessibility Focused",
      description: "Designed with accessibility in mind to bridge communication gaps in the deaf community.",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const stats = [
    { label: "Recognition Accuracy", value: "95%", icon: CheckCircle },
    { label: "Supported Signs", value: "29+", icon: Star },
    { label: "Languages", value: "ASL", icon: Globe },
    { label: "Response Time", value: "<500ms", icon: Zap }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="container relative mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Zap className="mr-2 h-4 w-4" />
              Powered by Advanced AI
            </Badge>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              Bridge Communication with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered ASL
              </span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              Real-time American Sign Language translation, interactive learning, and comprehensive pose library. 
              Breaking down communication barriers with cutting-edge technology.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {isAuthenticated ? (
                <Link
                  to="/translate"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group px-8 py-3 text-lg"
                  )}
                >
                  Start Translating
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group px-8 py-3 text-lg"
                  )}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              
              <Link
                to="/translate"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "group px-8 py-3 text-lg"
                )}
              >
                <Play className="mr-2 h-5 w-5" />
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Powerful Features for Everyone
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Whether you're learning ASL, need real-time translation, or want to explore sign language, 
              we have the tools to help you communicate effectively.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to Start Translating?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
            Join thousands of users who are already using Gesture Bridge to communicate more effectively. 
            Start your journey today.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {!isAuthenticated && (
              <Link
                to="/signup"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "px-8 py-3 text-lg font-semibold"
                )}
              >
                Create Free Account
              </Link>
            )}
            <Link
              to="/translate"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
              )}
            >
              Try Translation Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}