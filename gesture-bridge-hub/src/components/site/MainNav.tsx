import { NavLink } from "react-router-dom";
import { SiteLogo } from "./SiteLogo";
import { cn } from "@/lib/utils";
import { Camera, BookOpen, Search } from "lucide-react";

export function MainNav() {
  const navItems = [
    { to: "/translate", label: "Translate", icon: Camera },
    { to: "/sign-school", label: "Sign School", icon: BookOpen },
    { to: "/poses", label: "Poses", icon: Search },
  ];

  return (
    <div className="mr-4 hidden md:flex items-center">
      <SiteLogo />
      <nav className="flex items-center gap-1 ml-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-muted",
                  isActive 
                    ? "text-foreground bg-muted" 
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
