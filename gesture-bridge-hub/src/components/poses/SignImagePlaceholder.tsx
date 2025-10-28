import { Hand } from 'lucide-react';

interface SignImagePlaceholderProps {
  word: string;
  letter?: string;
  category: string;
  className?: string;
}

const getCategoryColor = (category: string) => {
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

export const SignImagePlaceholder = ({ word, letter, category, className = "" }: SignImagePlaceholderProps) => {
  const gradientClass = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);
  
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradientClass} ${className}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-2 text-6xl opacity-50">
          {categoryIcon}
        </div>
        <div className="absolute bottom-2 right-2 text-4xl opacity-30">
          <Hand className="w-8 h-8" />
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white p-4">
        <div className="text-center">
          {letter ? (
            <div className="text-6xl font-bold mb-2 font-mono">
              {letter}
            </div>
          ) : (
            <div className="text-2xl font-bold mb-2">
              {word}
            </div>
          )}
          
          <div className="text-sm opacity-90 font-medium">
            ASL Sign
          </div>
          
          <div className="text-xs opacity-75 mt-1">
            {category}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/10 rounded-full"></div>
      </div>
    </div>
  );
};