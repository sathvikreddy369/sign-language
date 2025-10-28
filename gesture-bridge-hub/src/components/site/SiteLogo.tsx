import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Hand } from "lucide-react";

export function SiteLogo({ className }: { className?: string }) {
  return (
    <NavLink to="/" className={cn("flex items-center space-x-2 group", className)}>
      <div className="relative">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Hand className="h-4 w-4 text-white" />
        </div>
      </div>
      <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Gesture Bridge
      </span>
    </NavLink>
  );
}
