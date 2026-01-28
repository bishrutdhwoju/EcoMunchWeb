import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import recipeService from "@/services/recipeService";
import { bookmarkAPI } from "@/services/api";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  UtensilsCrossed,
  Plus,
  Clock,
  Edit,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import RecipeDialog from "@/components/RecipeDialog";

const statusConfig = {
  approved: {
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    icon: CheckCircle,
    label: "Approved",
  },
  pending: {
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    icon: AlertCircle,
    label: "Pending Review",
  },
  rejected: {
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    icon: XCircle,
    label: "Rejected",
  },
};

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [togglingBookmark, setTogglingBookmark] = useState(null);
  
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [expandedRecipeDetails, setExpandedRecipeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ isOpen: false, id: null, title: "" });

  useEffect(() => {
    fetchMyRecipes();
    fetchBookmarks();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      setIsLoading(true);
      const data = await recipeService.getMyRecipes();
      setRecipes(data.recipes);
    } catch (err) {
      toast.error("Failed to load your recipes");
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

  const toggleBookmark = async (recipeId) => {
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

  const handleDelete = async () => {
    const { id, title } = deleteConfirmDialog;
    try {
      setDeletingId(id);
      await recipeService.delete(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      toast.success("Recipe deleted");
    } catch (err) {
      toast.error("Failed to delete recipe");
    } finally {
      setDeletingId(null);
      setDeleteConfirmDialog({ isOpen: false, id: null, title: "" });
    }
  };

  const toggleExpand = async (e, recipeId) => {
    // Prevent expansion if clicking buttons or links
    if (e.target.closest("button") || e.target.closest("a")) return;
    
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Recipes</h1>
            <p className="text-muted-foreground">
              Manage your submitted recipes
            </p>
          </div>
          <Link to="/recipes/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Recipe
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{recipes.length}</p>
              <p className="text-xs text-muted-foreground">Total Recipes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {recipes.filter((r) => r.status === "approved").length}
              </p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {recipes.filter((r) => r.status === "pending").length}
              </p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-muted-foreground">
                0
              </p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : recipes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No recipes yet</h3>
              <p className="text-muted-foreground mb-4">
                Share your first recipe with the community!
              </p>
              <Link to="/recipes/new">
                <Button>Add Your First Recipe</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {recipes.map((recipe) => {
              const status = statusConfig[recipe.status];
              const StatusIcon = status.icon;
              const isDeleting = deletingId === recipe.id;

              return (
                <Card 
                  key={recipe.id} 
                  className={`transition-colors cursor-pointer hover:border-primary/50 ${expandedRecipeId === recipe.id ? "ring-2 ring-primary" : ""}`}
                  onClick={(e) => toggleExpand(e, recipe.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-16 w-16 rounded-lg bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {recipe.imageUrl ? (
                            <img 
                              src={`http://localhost:8000${recipe.imageUrl}`} 
                              alt={recipe.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UtensilsCrossed className="h-8 w-8 text-primary/50" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">{recipe.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(recipe.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Bookmark button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleBookmark(recipe.id)}
                          disabled={togglingBookmark === recipe.id}
                          title={bookmarkedIds.has(recipe.id) ? "Remove bookmark" : "Add bookmark"}
                        >
                          {togglingBookmark === recipe.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : bookmarkedIds.has(recipe.id) ? (
                            <BookmarkCheck className="h-4 w-4 text-primary" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                        <Link to={`/recipes/${recipe.id}/edit`}>
                          <Button variant="ghost" size="icon" title="Edit recipe">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmDialog({ isOpen: true, id: recipe.id, title: recipe.title });
                          }}
                          disabled={isDeleting}
                          title="Delete recipe"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
        
        <ConfirmDialog
          isOpen={deleteConfirmDialog.isOpen}
          onClose={() => setDeleteConfirmDialog({ isOpen: false, id: null, title: "" })}
          onConfirm={handleDelete}
          title="Delete Recipe"
          description={`Are you sure you want to delete "${deleteConfirmDialog.title}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="destructive"
          isLoading={deletingId === deleteConfirmDialog.id}
        />
      </div>
    </Layout>
  );
}
