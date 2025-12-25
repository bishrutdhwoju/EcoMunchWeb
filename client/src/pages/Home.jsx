import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import recipeService from "@/services/recipeService";
import { bookmarkAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import {
  Leaf,
  UtensilsCrossed,
  Heart,
  Clock,
  Users,
  Sprout,
  ArrowRight,
  Star,
  Loader2,
  ChefHat,
  Bookmark,
  BookmarkCheck,
  Timer,
  Flame,
  X,
} from "lucide-react";
import RecipeDialog from "@/components/RecipeDialog";

// Mock data for categories
const popularCategories = [
  { name: "Breakfast", count: 23, icon: Clock },
  { name: "Lunch", count: 45, icon: UtensilsCrossed },
  { name: "Dinner", count: 34, icon: Heart },
  { name: "Snacks", count: 34, icon: Star },
  { name: "Desserts", count: 18, icon: Leaf },
  { name: "Beverages", count: 12, icon: Sprout },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [sustainablePicks, setSustainablePicks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [togglingBookmark, setTogglingBookmark] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [expandedRecipeDetails, setExpandedRecipeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await recipeService.getAll();
        const allRecipes = data.recipes || [];
        
        // Take 5 most recent community recipes
        setRecentRecipes(allRecipes.slice(0, 5));
        
        // Filter for sustainable recipes
        const sustainable = allRecipes.filter(r => r.sustainability).slice(0, 3);
        setSustainablePicks(sustainable);
      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch user's bookmarks on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated]);

  const fetchBookmarks = async () => {
    try {
      const response = await bookmarkAPI.getMyBookmarks();
      const ids = new Set((response.data.bookmarks || []).map(b => b.id));
      setBookmarkedIds(ids);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
    }
  };

  const toggleBookmark = async (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Sign in required", { description: "Please sign in to bookmark recipes." });
      return;
    }

    try {
      setTogglingBookmark(recipeId);
      if (bookmarkedIds.has(recipeId)) {
        await bookmarkAPI.remove(recipeId);
        setBookmarkedIds(prev => {
          const next = new Set(prev);
          next.delete(recipeId);
          return next;
        });
        toast.success("Bookmark removed");
      } else {
        await bookmarkAPI.add(recipeId);
        setBookmarkedIds(prev => new Set(prev).add(recipeId));
        toast.success("Recipe bookmarked!");
      }
    } catch (err) {
      toast.error("Failed to update bookmark");
    } finally {
      setTogglingBookmark(null);
    }
  };

  const toggleExpand = async (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();

    if (expandedRecipeId === recipeId) {
      setExpandedRecipeId(null);
      setExpandedRecipeDetails(null);
      return;
    }

    try {
      setLoadingDetails(true);
      setExpandedRecipeId(recipeId);
      const data = await recipeService.getById(recipeId);
      setExpandedRecipeDetails(data.recipe);
    } catch (err) {
      console.error("Failed to fetch recipe details:", err);
      toast.error("Failed to load recipe details");
      setExpandedRecipeId(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Leaf className="h-4 w-4" />
            Healthy & Sustainable Nepali Recipes
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Cook with Purpose,{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              Eat with Joy
            </span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Discover authentic Nepali recipes that are good for you and the planet.
            Join our community of mindful cooks.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/recipes">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <UtensilsCrossed className="h-5 w-5" />
                Explore Recipes
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/register">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Users className="h-5 w-5" />
                  Join Free
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 rounded-lg bg-card/50 p-4 backdrop-blur-sm border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">150+</p>
              <p className="text-xs text-muted-foreground">Recipes</p>
            </div>
            <div className="text-center border-x">
              <p className="text-2xl font-bold text-primary">500+</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">50+</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Recipes - Most Recent */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ChefHat className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Community Recipes</h2>
            </div>
            <p className="text-sm text-muted-foreground">Recently shared by our community</p>
          </div>
          <Link to="/recipes">
            <Button variant="ghost" size="sm" className="gap-1">
              See All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : recentRecipes.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No recipes shared yet. Be the first to share one!
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {recentRecipes.map((recipe) => (
              <div key={recipe.id} className="flex flex-col">
                <Card
                  className={`group overflow-hidden transition-all h-full cursor-pointer ${
                    expandedRecipeId === recipe.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={(e) => toggleExpand(e, recipe.id)}
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {recipe.imageUrl ? (
                      <img 
                        src={`http://localhost:8000${recipe.imageUrl}`} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/30">
                        <UtensilsCrossed className="h-12 w-12" />
                      </div>
                    )}
                    {/* Bookmark button */}
                    <button
                      onClick={(e) => toggleBookmark(e, recipe.id)}
                      disabled={togglingBookmark === recipe.id}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
                        bookmarkedIds.has(recipe.id)
                          ? "bg-primary text-white"
                          : "bg-background/80 text-muted-foreground hover:bg-background hover:text-foreground"
                      }`}
                    >
                      {togglingBookmark === recipe.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : bookmarkedIds.has(recipe.id) ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight">
                      {recipe.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {recipe.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime((recipe.prepTime || 0) + (recipe.cookingTime || 0))}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {recipe.servings}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-primary font-medium truncate">
                        by {recipe.author?.name || "EcoMunch"}
                      </span>
                    </div>

                  </CardContent>
                </Card>

                {/* Expanded details handled by RecipeDialog */}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <p className="text-sm text-muted-foreground">Browse recipes by category</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {popularCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to={`/recipes?category=${category.name}`}
                className="group"
              >
                <Card className="text-center hover:border-primary/50 transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium text-xs sm:text-sm">{category.name}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Sustainable Picks */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sprout className="h-5 w-5 text-green-600" />
              <h2 className="text-2xl font-bold">Sustainable Picks</h2>
            </div>
            <p className="text-sm text-muted-foreground">Eco-friendly recipes for a greener kitchen</p>
          </div>
          <Link to="/sustainability">
            <Button variant="ghost" size="sm" className="gap-1">
              Learn More <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : sustainablePicks.length === 0 ? (
          <Card className="p-8 text-center bg-green-50/50 text-muted-foreground border-green-100 italic">
            Check back later for seasonal eco-friendly recipes!
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sustainablePicks.map((pick) => (
              <div key={pick.id} className="flex flex-col">
                <Card
                  className={`border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900 group transition-all h-full cursor-pointer ${
                    expandedRecipeId === pick.id ? "ring-2 ring-green-500" : ""
                  }`}
                  onClick={(e) => toggleExpand(e, pick.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 overflow-hidden">
                      <CardTitle className="text-lg group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">
                        {pick.title}
                      </CardTitle>
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700 dark:bg-green-900 dark:text-green-300 flex-shrink-0">
                        {pick.sustainability}
                      </span>
                    </div>
                    <CardDescription className="line-clamp-2">{pick.description}</CardDescription>

                  </CardHeader>
                </Card>

                {/* Expanded Details for sustainable picks handled by RecipeDialog */}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA for non-authenticated users */}
      {!isAuthenticated && (
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Start Cooking?</h2>
              <p className="text-muted-foreground mb-4">
                Join EcoMunch today and get access to all recipes, save favorites, and share your own!
              </p>
              <Link to="/register">
                <Button size="lg" className="px-8">Create Free Account</Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      )}
      
      <RecipeDialog
        isOpen={expandedRecipeId !== null}
        onClose={() => {
          setExpandedRecipeId(null);
          setExpandedRecipeDetails(null);
        }}
        loadingDetails={loadingDetails}
        expandedRecipeDetails={expandedRecipeDetails}
      />
    </Layout>
  );
}
