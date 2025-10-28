import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { PoseViewer3D } from "@/components/poses/PoseViewer3D";
import { SignCard } from "@/components/poses/SignCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { 
  Search, 
  Filter, 
  Eye, 
  Hand, 
  Sparkles,
  BookOpen,
  Target
} from "lucide-react";
import { searchSigns, type Sign } from "@/lib/aslApi";

const PoseSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [signs, setSigns] = useState<Sign[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedSignForViewer, setSelectedSignForViewer] = useState<string>('Hello');

  const categories = [
    "Alphabet", "Numbers", "Greetings", "Family", "Colors", 
    "Animals", "Actions", "Emotions", "Time", "Common Phrases"
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  useEffect(() => {
    // Load popular signs on initial load
    loadSigns();
  }, []);

  const loadSigns = async (query?: string) => {
    setLoading(true);
    try {
      const result = await searchSigns({
        q: query,
        category: selectedCategory && selectedCategory !== "all" ? selectedCategory : undefined,
        difficulty: selectedDifficulty && selectedDifficulty !== "all" ? selectedDifficulty : undefined,
        page_size: 20
      });
      
      if (result.success && result.signs) {
        setSigns(result.signs);
      } else {
        toast({
          title: "Error loading signs",
          description: result.error || "Failed to load signs",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to load signs:', error);
      toast({
        title: "Connection Error",
        description: "Unable to load signs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadSigns(searchTerm);
  };

  const handleViewSign = (sign: Sign) => {
    setSelectedSignForViewer(sign.word);
    toast({
      title: "Viewing sign",
      description: `Now showing 3D view for "${sign.word}"`
    });
  };

  const handlePracticeSign = (sign: Sign) => {
    toast({
      title: "Practice mode",
      description: `Starting practice session for "${sign.word}"`
    });
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      <SEO title="ASL Sign Explorer — Gesture Bridge" description="Explore ASL signs with interactive 3D viewer, semantic search, and detailed instructions." />
      
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
          <Hand className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ASL Sign Explorer
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover and learn ASL signs with our comprehensive database. Search by meaning, explore categories, 
          and view detailed instructions with 3D visualizations.
        </p>
      </section>

      {/* 3D Viewer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Interactive 3D Sign Viewer
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Live Demo
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PoseViewer3D selectedSign={selectedSignForViewer} />
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <Target className="h-4 w-4 inline mr-2" />
              Currently showing: <strong>{selectedSignForViewer}</strong>
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
              Select a sign below to view its 3D representation, or use the pose controls to explore different signs.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Signs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by word, meaning, or description (e.g., 'thank you', 'greeting', 'family')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {getCategoryIcon(category)} {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => loadSigns(searchTerm)}>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'Popular Signs'}
          </h2>
          <Badge variant="secondary">
            {signs.length} signs found
          </Badge>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : signs.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No signs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {signs.map((sign) => (
              <SignCard
                key={sign.id}
                sign={sign}
                onViewDetails={handleViewSign}
                onPractice={handlePracticeSign}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Categories */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Explore by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className="h-20 flex-col gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => {
                setSelectedCategory(category);
                setSearchTerm("");
                loadSigns();
              }}
            >
              <span className="text-2xl">{getCategoryIcon(category)}</span>
              <span className="text-xs">{category}</span>
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PoseSearchPage;
