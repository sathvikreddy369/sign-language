import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  Share2, 
  Clock, 
  Copy, 
  Trash2, 
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

export interface HistoryItem {
  id: string;
  text: string;
  ts: string;
  confidence?: number;
  wordCount?: number;
}

export const HistoryPanel = ({ items = [] }: { items?: HistoryItem[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const sampleItems: HistoryItem[] = [
    { 
      id: '1', 
      text: 'Hello, my name is Alex. Nice to meet you!', 
      ts: new Date().toLocaleString(),
      confidence: 0.92,
      wordCount: 8
    },
    { 
      id: '2', 
      text: 'Thank you for your help today.', 
      ts: new Date(Date.now() - 3600000).toLocaleString(),
      confidence: 0.88,
      wordCount: 6
    },
    { 
      id: '3', 
      text: 'How are you doing?', 
      ts: new Date(Date.now() - 7200000).toLocaleString(),
      confidence: 0.95,
      wordCount: 4
    },
    { 
      id: '4', 
      text: 'I love learning sign language.', 
      ts: new Date(Date.now() - 10800000).toLocaleString(),
      confidence: 0.87,
      wordCount: 5
    },
  ];

  const list = items.length ? items : sampleItems;
  
  const filteredItems = list.filter(item =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!", description: "Text has been copied successfully." });
  };

  const downloadHistory = () => {
    const data = filteredItems.map(item => ({
      text: item.text,
      timestamp: item.ts,
      confidence: item.confidence,
      wordCount: item.wordCount
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: "Download started", description: "Your translation history is being downloaded." });
  };

  const shareHistory = async () => {
    const textToShare = filteredItems.map(item => `${item.text} (${item.ts})`).join('\n\n');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My ASL Translation History',
          text: textToShare,
        });
      } catch (err) {
        copyToClipboard(textToShare);
      }
    } else {
      copyToClipboard(textToShare);
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return "bg-gray-100 text-gray-800";
    if (confidence >= 0.9) return "bg-green-100 text-green-800";
    if (confidence >= 0.8) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Translation History
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {filteredItems.length} items
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search translations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
              />
            </div>
            
            <Button variant="outline" size="sm" onClick={downloadHistory}>
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={shareHistory}>
              <Share2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No matching translations' : 'No translations yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start translating to see your history here'
              }
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start justify-between p-4 rounded-lg border hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2 break-words">
                      {item.text}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.ts}
                      </span>
                      
                      {item.wordCount && (
                        <Badge variant="outline" className="text-xs">
                          {item.wordCount} words
                        </Badge>
                      )}
                      
                      {item.confidence && (
                        <Badge className={`text-xs ${getConfidenceColor(item.confidence)}`}>
                          {(item.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copyToClipboard(item.text)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Text
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
