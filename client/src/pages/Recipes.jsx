import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import recipeService from "@/services/recipeService";
import { bookmarkAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UtensilsCrossed,
  Search,
  X,
  Clock,
  Users,
  Leaf,
  Filter,
  RotateCcw,
  Loader2,
  Bookmark,
  BookmarkCheck,
  Timer,
  Flame,
} from "lucide-react";
import RecipeDialog from "@/components/RecipeDialog";

// Filter options
const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Desserts", "Beverages"];
const DIETARY = ["All", "Vegetarian", "Non-Vegetarian", "Vegan"];
const SUSTAINABILITY = ["All", "Seasonal", "Zero-Waste", "Local Ingredients"];
const COOKING_TIME = ["All", "Under 15 min", "15-30 min", "30+ min"];

// Initial filter state
const initialFilters = {
  search: "",
  category: "All",
  dietary: "All",
  sustainability: "All",
  cookingTime: "All",
};

export default function Recipes() {
  const { isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [togglingBookmark, setTogglingBookmark] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [expandedRecipeDetails, setExpandedRecipeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, [filters.category, filters.dietary, filters.sustainability]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch user's bookmarks on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category !== "All") params.category = filters.category;
      if (filters.dietary !== "All") params.dietary = filters.dietary;
      if (filters.sustainability !== "All") params.sustainability = filters.sustainability;
      
      const data = await recipeService.getAll(params);
      setRecipes(data.recipes);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Update individual filter
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(initialFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.category !== "All" ||
      filters.dietary !== "All" ||
      filters.sustainability !== "All" ||
      filters.cookingTime !== "All"
    );
  }, [filters]);

  // Client-side cooking time filter
  const filteredRecipes = useMemo(() => {
    if (filters.cookingTime === "All") return recipes;
    
    return recipes.filter(recipe => {
      const time = (recipe.prepTime || 0) + (recipe.cookingTime || 0);
      if (filters.cookingTime === "Under 15 min") return time < 15;
      if (filters.cookingTime === "15-30 min") return time >= 15 && time <= 30;
      if (filters.cookingTime === "30+ min") return time > 30;
      return true;
    });
  }, [recipes, filters.cookingTime]);

  // Helper to format cooking time
  const formatTime = (minutes) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  };

  // Get badge color for dietary preference
  const getDietaryColor = (dietary) => {
    switch (dietary) {
      case "Vegetarian":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Vegan":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300";
      case "Non-Vegetarian":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get badge color for sustainability type
  const getSustainabilityColor = (sustainability, variant = "badge") => {
    const colors = {
      "Seasonal": {
        badge: "bg-orange-500 text-white",
        filter: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      },
      "Zero-Waste": {
        badge: "bg-purple-500 text-white",
        filter: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      },
      "Local Ingredients": {
        badge: "bg-blue-500 text-white",
        filter: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      },
    };
    return colors[sustainability]?.[variant] || "bg-green-500 text-white";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-muted-foreground">
            Discover our collection of authentic Nepali recipes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes by name..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10 pr-10"
            />
            {filters.search && (
              <button
                onClick={() => updateFilter("search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-3">
            <Select value={filters.category} onValueChange={(v) => updateFilter("category", v)}>
              <SelectTrigger className="w-[145px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.dietary} onValueChange={(v) => updateFilter("dietary", v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Dietary" />
              </SelectTrigger>
              <SelectContent>
                {DIETARY.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === "All" ? "All Dietary" : d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sustainability} onValueChange={(v) => updateFilter("sustainability", v)}>
              <SelectTrigger className="w-[175px]">
                <div className="flex items-center gap-2">
                  <Leaf className="h-3.5 w-3.5 text-green-600" />
                  <SelectValue placeholder="Sustainability" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {SUSTAINABILITY.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "All" ? "All Types" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.cookingTime} onValueChange={(v) => updateFilter("cookingTime", v)}>
              <SelectTrigger className="w-[145px]">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <SelectValue placeholder="Time" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {COOKING_TIME.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t === "All" ? "Any Time" : t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Recipe Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Finding delicious recipes...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <Card className="text-center py-16 flex flex-col items-center">
            <UtensilsCrossed className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              We couldn't find any recipes matching your criteria. Try different filters or search terms.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Reset All Filters
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="flex flex-col">
                <Card
                  className={`group overflow-hidden transition-all h-full border-muted/60 cursor-pointer ${
                    expandedRecipeId === recipe.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={(e) => toggleExpand(e, recipe.id)}
                >
                  <div className="aspect-[16/10] overflow-hidden relative bg-muted">
                    {recipe.imageUrl ? (
                      <img 
                        src={`http://localhost:8000${recipe.imageUrl}`} 
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <UtensilsCrossed className="h-12 w-12 text-primary/20" />
                      </div>
                    )}
                    
                    {recipe.sustainability && (
                      <span className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getSustainabilityColor(recipe.sustainability, "badge")}`}>
                        <Leaf className="h-3 w-3" />
                        {recipe.sustainability}
                      </span>
                    )}

                    {/* Bookmark button */}
                    <button
                      onClick={(e) => toggleBookmark(e, recipe.id)}
                      disabled={togglingBookmark === recipe.id}
                      className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors ${
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
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {recipe.category?.name || "Recipe"}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${getDietaryColor(recipe.dietary)}`}>
                        {recipe.dietary}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors leading-tight">
                      {recipe.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {recipe.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0 pb-6">
                    <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatTime((recipe.prepTime || 0) + (recipe.cookingTime || 0))}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          <span>{recipe.servings}</span>
                        </div>
                      </div>
                      {recipe.author && (
                        <span className="text-xs text-muted-foreground truncate">
                          by {recipe.author.name}
                        </span>
                      )}
                    </div>

                  </CardContent>
                </Card>

                {/* Expanded details handled by RecipeDialog */}
              </div>
            ))}
          </div>
        )}
      </div>
      
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
