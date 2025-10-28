import {
  Sheet, 
  SheetContent, 
  SheetTrigger
} from "@/components/ui/sheet";
import { 
  Button, 
  buttonVariants
} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MainNav } from "./MainNav";
import { SiteLogo } from "./SiteLogo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, User, Settings, LogOut, BarChart3, Camera, BookOpen, Search } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const navItems = [
    { to: "/translate", label: "Translate", icon: Camera },
    { to: "/sign-school", label: "Sign School", icon: BookOpen },
    { to: "/poses", label: "Poses", icon: Search },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-blur]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4">
        <MainNav />
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0 w-80">
                <div className="px-6 py-4">
                  <SiteLogo />
                </div>
                <div className="px-6 space-y-4">
                  {/* User info in mobile */}
                  {isAuthenticated && user && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getUserInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.email}</p>
                        <Badge variant="secondary" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Links */}
                  <div className="space-y-2">
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
                          isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                        )
                      }
                    >
                      <span>Home</span>
                    </NavLink>
                    
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
                              isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                            )
                          }
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                    
                    {isAuthenticated && (
                      <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                          cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
                            isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                          )
                        }
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboard</span>
                      </NavLink>
                    )}
                  </div>
                  
                  {/* Auth buttons in mobile */}
                  <div className="pt-4 border-t space-y-2">
                    {!isAuthenticated ? (
                      <>
                        <NavLink
                          to="/login"
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "w-full justify-start"
                          )}
                        >
                          Login
                        </NavLink>
                        <NavLink
                          to="/signup"
                          className={cn(
                            buttonVariants({ variant: "default" }),
                            "w-full"
                          )}
                        >
                          Sign Up
                        </NavLink>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-2">
              {!isAuthenticated ? (
                <>
                  <NavLink
                    to="/login"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" })
                    )}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={cn(
                      buttonVariants({ variant: "default", size: "sm" })
                    )}
                  >
                    Sign Up
                  </NavLink>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getUserInitials(user!.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user!.email}</p>
                        <Badge variant="secondary" className="w-fit text-xs">
                          {user!.role}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <NavLink to="/dashboard" className="flex items-center">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-700 focus:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}