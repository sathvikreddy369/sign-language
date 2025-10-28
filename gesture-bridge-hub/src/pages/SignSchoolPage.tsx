import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { LessonCard } from "@/components/lessons/LessonCard";
import { QuickStartGuide } from "@/components/lessons/QuickStartGuide";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, PlayCircle, Sparkles, Clock, Users, Trophy, Search, Filter, Star, CheckCircle, Target, Zap } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { getLessons, type Lesson } from "@/lib/aslApi";
import { useAuth } from "@/contexts/AuthContext";

const SignSchoolPage = () => {
	const [lessons, setLessons] = useState<Lesson[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedLevel, setSelectedLevel] = useState<string>("all");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const { isAuthenticated } = useAuth();

	const categories = [
		"Alphabet", "Numbers", "Greetings", "Family", "Colors", 
		"Animals", "Actions", "Emotions", "Time", "Common Phrases"
	];

	const levels = ["Beginner", "Intermediate", "Advanced"];

	useEffect(() => {
		loadLessons();
	}, [selectedLevel, selectedCategory]);

	const loadLessons = async () => {
		setLoading(true);
		try {
			const result = await getLessons({
				level: selectedLevel && selectedLevel !== "all" ? selectedLevel : undefined,
				category: selectedCategory && selectedCategory !== "all" ? selectedCategory : undefined,
				page_size: 50
			});
			
			if (result.success && result.lessons) {
				setLessons(result.lessons);
			} else {
				toast({
					title: "Error loading lessons",
					description: result.error || "Failed to load lessons",
					variant: "destructive"
				});
			}
		} catch (error) {
			console.error('Failed to load lessons:', error);
			toast({
				title: "Connection Error",
				description: "Unable to load lessons. Please try again.",
				variant: "destructive"
			});
		} finally {
			setLoading(false);
		}
	};

	const filteredLessons = lessons.filter(lesson =>
		lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

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

	return (
		<div className="container mx-auto py-8 space-y-8">
			<SEO
				title="Sign School — Learn ASL"
				description="Comprehensive ASL lessons with interactive practice, progress tracking, and expert guidance."
			/>
			
			{/* Hero Section */}
			<section className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-8 md:p-12">
				<div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" aria-hidden />
				<div className="relative">
					<div className="max-w-4xl">
						<div className="flex items-center gap-2 mb-4">
							<Badge variant="secondary" className="px-3 py-1">
								<Sparkles className="h-3 w-3 mr-1" />
								Interactive Learning
							</Badge>
							<Badge variant="outline" className="px-3 py-1">
								{lessons.length} Lessons Available
							</Badge>
						</div>
						
						<h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							ASL Sign School
						</h1>
						
						<p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
							Master American Sign Language with our comprehensive curriculum. From alphabet basics to complex conversations, 
							learn at your own pace with interactive lessons, practice exercises, and progress tracking.
						</p>
						
						<div className="flex flex-col sm:flex-row gap-4 mb-8">
							<Button
								size="lg"
								className="flex items-center gap-2"
								onClick={() => {
									const firstLesson = lessons.find(l => l.category === 'Alphabet');
									if (firstLesson) {
										window.location.href = `/lesson/${firstLesson.slug}`;
									} else {
										toast({
											title: "Starting your ASL journey!",
											description: "Loading the first lesson..."
										});
									}
								}}
							>
								<PlayCircle className="h-5 w-5" />
								Start Learning
							</Button>
							<Button variant="outline" size="lg" className="flex items-center gap-2">
								<BookOpen className="h-5 w-5" />
								Browse Curriculum
							</Button>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="text-center">
								<div className="text-2xl font-bold text-blue-600">{lessons.length}</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Lessons</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-green-600">500+</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Signs</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-purple-600">10+</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-orange-600">24/7</div>
								<div className="text-sm text-gray-600 dark:text-gray-400">Access</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Quick Start Guide for new users */}
			{!isAuthenticated && (
				<QuickStartGuide />
			)}

			{/* Search and Filters */}
			<div className="flex flex-col md:flex-row gap-4" id="lessons">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search lessons..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
				
				<Select value={selectedLevel} onValueChange={setSelectedLevel}>
					<SelectTrigger className="w-full md:w-48">
						<SelectValue placeholder="All Levels" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Levels</SelectItem>
						{levels.map(level => (
							<SelectItem key={level} value={level}>{level}</SelectItem>
						))}
					</SelectContent>
				</Select>

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
			</div>

			{/* Lessons Grid */}
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
			) : filteredLessons.length === 0 ? (
				<div className="text-center py-12">
					<BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						No lessons found
					</h3>
					<p className="text-gray-600 dark:text-gray-400">
						Try adjusting your search terms or filters
					</p>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredLessons.map((lesson, index) => (
						<LessonCard
							key={lesson.id}
							lesson={lesson}
							progress={Math.random() * 100} // Mock progress - replace with real data
							isCompleted={Math.random() > 0.8} // Mock completion - replace with real data
							isPopular={index < 3} // Mark first 3 as popular
						/>
					))}
				</div>
			)}

			{/* Featured Lessons Section */}
			{filteredLessons.length > 0 && (
				<section className="space-y-6">
					<div className="text-center">
						<h2 className="text-3xl font-bold mb-4">Featured Lessons</h2>
						<p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Start with these popular lessons designed for quick learning and maximum impact.
						</p>
					</div>
					
					<div className="grid md:grid-cols-3 gap-6">
						{filteredLessons.slice(0, 3).map((lesson, index) => (
							<Card key={`featured-${lesson.id}`} className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800">
								<div className="absolute top-2 right-2">
									<Badge className="bg-blue-500 text-white">
										<Star className="h-3 w-3 mr-1" />
										Featured
									</Badge>
								</div>
								<CardHeader>
									<div className="text-3xl mb-2">{getCategoryIcon(lesson.category)}</div>
									<CardTitle className="text-lg">{lesson.title}</CardTitle>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										{lesson.description}
									</p>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
										<div className="flex items-center gap-1">
											<Clock className="h-4 w-4" />
											{lesson.duration_minutes} min
										</div>
										<div className="flex items-center gap-1">
											<Target className="h-4 w-4" />
											{lesson.signs_count || 0} signs
										</div>
									</div>
									<Button asChild className="w-full">
										<Link to={`/lesson/${lesson.slug}`}>
											<PlayCircle className="h-4 w-4 mr-2" />
											Start Now
										</Link>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			)}

			{/* Learning Path Section */}
			<section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
				<div className="max-w-4xl">
					<h2 className="text-3xl font-bold mb-4">Structured Learning Path</h2>
					<p className="text-blue-100 mb-6 text-lg">
						Follow our carefully designed curriculum that builds from basic alphabet to complex conversations.
					</p>
					
					<div className="grid md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<BookOpen className="h-8 w-8" />
							</div>
							<h3 className="font-semibold mb-2 text-xl">Foundation</h3>
							<p className="text-blue-100 text-sm">Master the alphabet, numbers, and basic greetings to build your ASL foundation</p>
							<div className="mt-3 text-xs text-blue-200">
								Lessons 1-3 • Beginner Level
							</div>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<Users className="h-8 w-8" />
							</div>
							<h3 className="font-semibold mb-2 text-xl">Building Blocks</h3>
							<p className="text-blue-100 text-sm">Learn everyday vocabulary, family terms, and common expressions for daily communication</p>
							<div className="mt-3 text-xs text-blue-200">
								Lessons 4-7 • Intermediate Level
							</div>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<Zap className="h-8 w-8" />
							</div>
							<h3 className="font-semibold mb-2 text-xl">Fluency</h3>
							<p className="text-blue-100 text-sm">Practice complex conversations, advanced expressions, and cultural nuances</p>
							<div className="mt-3 text-xs text-blue-200">
								Lessons 8+ • Advanced Level
							</div>
						</div>
					</div>
					
					<div className="mt-8 text-center">
						<Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
							<Trophy className="h-5 w-5 mr-2" />
							View Complete Curriculum
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default SignSchoolPage;
