import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Leaf,
  Home,
  UtensilsCrossed,
  BookOpen,
  Bookmark,
  Sprout,
  User,
  Shield,
  Users,
  LayoutGrid,
  ChevronDown,
  LogOut,
  Compass,
  Settings,
  Menu,
  X,
} from "lucide-react";

// Navigation items for different roles
const userNavItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Explore", path: "/recipes", icon: Compass },
  { label: "My Recipes", path: "/my-recipes", icon: BookOpen },
  { label: "Bookmarks", path: "/bookmarks", icon: Bookmark },
  { label: "Sustainability", path: "/sustainability", icon: Sprout },
];

const adminNavItems = [
  { label: "Dashboard", path: "/admin", icon: Shield },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Recipes", path: "/admin/recipes", icon: UtensilsCrossed },
  { label: "Categories", path: "/admin/categories", icon: LayoutGrid },
  { label: "Ingredients", path: "/admin/ingredients", icon: Leaf },
];

const guestNavItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Explore", path: "/recipes", icon: Compass },
  { label: "Sustainability", path: "/sustainability", icon: Sprout },
];

export default function Layout({ children }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get appropriate nav items based on role
  const getNavItems = () => {
    if (!isAuthenticated) return guestNavItems;
    if (isAdmin) return adminNavItems;
    return userNavItems;
  };

  const navItems = getNavItems();

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if current path matches nav item
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-foreground tracking-tight">EcoMunch</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user?.avatarUrl ? `http://localhost:8000${user.avatarUrl}` : undefined} alt={user?.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline-block text-sm font-medium max-w-[100px] truncate">
                        {user?.name}
                      </span>
                      {isAdmin && (
                        <span className="hidden sm:inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          Admin
                        </span>
                      )}
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Switch between User/Admin view */}
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center cursor-pointer">
                            <Shield className="mr-2 h-4 w-4 text-primary" />
                            <span className="text-primary font-medium">Admin Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/" className="flex items-center cursor-pointer">
                            <Home className="mr-2 h-4 w-4" />
                            User View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Sign in</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden ml-1 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-background mt-auto">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">EcoMunch</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Healthy Nepali recipes for a sustainable future. Cook with purpose, eat with joy.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Explore</h4>
              <div className="flex flex-col gap-2">
                <Link to="/recipes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Recipes
                </Link>
                <Link to="/recipes?category=Breakfast" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Breakfast
                </Link>
                <Link to="/recipes?category=Dinner" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dinner
                </Link>
                <Link to="/sustainability" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sustainability
                </Link>
              </div>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Account</h4>
              <div className="flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Profile
                    </Link>
                    <Link to="/my-recipes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      My Recipes
                    </Link>
                    <Link to="/bookmarks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Bookmarks
                    </Link>
                    <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Settings
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Sign In
                    </Link>
                    <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
              <div className="flex flex-col gap-2">
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © 2026 EcoMunch. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with 🌱 for a greener planet
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
