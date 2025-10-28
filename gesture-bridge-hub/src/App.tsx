import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TranslatePage from "./pages/TranslatePage";
import PoseSearchPage from "./pages/PoseSearchPage";
import SignSchoolPage from "./pages/SignSchoolPage";
import LessonDetailPage from "./pages/LessonDetailPage";
import DashboardPage from "./pages/DashboardPage";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/translate" element={<TranslatePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/sign-school" element={<SignSchoolPage />} />
              <Route path="/poses" element={<PoseSearchPage />} />
              <Route path="/lesson/:lessonId" element={<LessonDetailPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
