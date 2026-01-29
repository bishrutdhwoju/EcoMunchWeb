import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { bookmarkAPI } from "@/services/api";
import recipeService from "@/services/recipeService";
import Layout from "@/components/Layout";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bookmark,
  UtensilsCrossed,
  Clock,
  Users,
  X,
  Loader2,
  Sprout,
  Timer,
  Flame,
  Leaf,
} from "lucide-react";
import RecipeDialog from "@/components/RecipeDialog";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [expandedRecipeDetails, setExpandedRecipeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [removeConfirmDialog, setRemoveConfirmDialog] = useState({ isOpen: false, id: null, title: "" });

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      const response = await bookmarkAPI.getMyBookmarks();
      setBookmarks(response.data.bookmarks || []);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
      toast.error("Failed to load bookmarks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = async () => {
    const { id: recipeId, title } = removeConfirmDialog;
    try {
      setRemovingId(recipeId);
      await bookmarkAPI.remove(recipeId);
      setBookmarks((prev) => prev.filter((r) => r.id !== recipeId));
      if (expandedRecipeId === recipeId) {
        setExpandedRecipeId(null);
        setExpandedRecipeDetails(null);
      }
      toast.success("Bookmark removed", {
        description: `"${title}" has been removed from your bookmarks.`,
      });
    } catch (err) {
      toast.error("Failed to remove bookmark");
    } finally {
      setRemovingId(null);
      setRemoveConfirmDialog({ isOpen: false, id: null, title: "" });
    }
  };

  const toggleExpand = async (recipeId) => {
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

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Saved Recipes</h1>
          </div>
          <p className="text-muted-foreground">
            Your bookmarked recipes for quick access
            {bookmarks.length > 0 && (
              <span className="ml-1 font-medium text-foreground">
                ({bookmarks.length} saved)
              </span>
            )}
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No saved recipes</h3>
              <p className="text-muted-foreground mb-4">
                Start exploring and save your favorite recipes!
              </p>
              <Link to="/recipes">
                <Button>Browse Recipes</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((recipe) => (
              <div key={recipe.id} className="flex flex-col">
                <Card
                  className={`group overflow-hidden transition-colors cursor-pointer ${
                    expandedRecipeId === recipe.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => toggleExpand(recipe.id)}
                >
                  {/* Image */}
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
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={removingId === recipe.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setRemoveConfirmDialog({ isOpen: true, id: recipe.id, title: recipe.title });
                      }}
                      className="absolute top-2 right-2 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {removingId === recipe.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                    {recipe.sustainability && (
                      <span className="absolute top-2 left-2 rounded-full bg-green-100/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700 flex items-center gap-1">
                        <Sprout className="h-3 w-3" />
                        {recipe.sustainability}
                      </span>
                    )}
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
                          {formatTime(
                            (recipe.prepTime || 0) + (recipe.cookingTime || 0)
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {recipe.servings}
                        </span>
                      </div>
                      {recipe.category && (
                        <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                          {recipe.category.name}
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

      <ConfirmDialog
        isOpen={removeConfirmDialog.isOpen}
        onClose={() => setRemoveConfirmDialog({ isOpen: false, id: null, title: "" })}
        onConfirm={handleRemoveBookmark}
        title="Remove Bookmark"
        description={`Are you sure you want to remove "${removeConfirmDialog.title}" from your bookmarks?`}
        confirmText="Remove"
        variant="destructive"
        isLoading={removingId === removeConfirmDialog.id}
      />
    </Layout>
  );
}
