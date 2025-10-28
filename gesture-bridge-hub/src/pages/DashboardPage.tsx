import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { 
  Camera, 
  BookOpen, 
  Search, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Activity,
  Calendar,
  ArrowRight,
  Upload,
  Settings,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const usageData = [
  { name: 'Mon', translations: 120, accuracy: 86, sessions: 45 },
  { name: 'Tue', translations: 180, accuracy: 88, sessions: 62 },
  { name: 'Wed', translations: 150, accuracy: 90, sessions: 58 },
  { name: 'Thu', translations: 220, accuracy: 89, sessions: 71 },
  { name: 'Fri', translations: 170, accuracy: 91, sessions: 55 },
  { name: 'Sat', translations: 95, accuracy: 87, sessions: 32 },
  { name: 'Sun', translations: 110, accuracy: 89, sessions: 38 },
];

const signDistribution = [
  { letter: 'A', count: 145 },
  { letter: 'B', count: 132 },
  { letter: 'C', count: 128 },
  { letter: 'D', count: 156 },
  { letter: 'E', count: 189 },
  { letter: 'F', count: 98 },
  { letter: 'G', count: 87 },
  { letter: 'H', count: 134 },
];

const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Translations",
      value: "1,247",
      change: "+12%",
      changeType: "positive" as const,
      icon: Camera,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Average Accuracy",
      value: "89.2%",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: Target,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Active Sessions",
      value: "361",
      change: "+8%",
      changeType: "positive" as const,
      icon: Users,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Avg Response Time",
      value: "420ms",
      change: "-15ms",
      changeType: "positive" as const,
      icon: Clock,
      color: "from-orange-500 to-red-500"
    }
  ];

  const quickActions = [
    {
      title: "Start Translation",
      description: "Begin real-time ASL translation",
      icon: Camera,
      href: "/translate",
      color: "bg-blue-500"
    },
    {
      title: "Sign School",
      description: "Learn new ASL signs",
      icon: BookOpen,
      href: "/sign-school",
      color: "bg-green-500"
    },
    {
      title: "Pose Library",
      description: "Browse sign database",
      icon: Search,
      href: "/poses",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <SEO title="Dashboard — Gesture Bridge" description="Your personal dashboard for ASL translation analytics and tools." />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your ASL translation activity overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Activity className="h-3 w-3 mr-1" />
            {user?.role || 'User'}
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last week</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} domain={[80, 95]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'accuracy' ? `${value}%` : value,
                      name === 'translations' ? 'Translations' : name === 'accuracy' ? 'Accuracy' : 'Sessions'
                    ]}
                  />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="translations" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sign Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Most Translated Signs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="letter" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className="group flex items-center p-4 rounded-lg border hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className={`p-2 rounded-lg ${action.color} mr-4`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Admin Tools (if admin) */}
      {user?.role === 'admin' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Dataset Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload and manage training datasets for model improvement.
              </p>
              <input 
                type="file" 
                multiple 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              />
              <Button className="w-full">
                Upload Dataset
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Accuracy</span>
                  <span className="font-medium">89.2%</span>
                </div>
                <Progress value={89.2} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Training Progress</span>
                  <span className="font-medium">Complete</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <Button variant="outline" className="w-full">
                Retrain Model
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Status</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Model Status</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
