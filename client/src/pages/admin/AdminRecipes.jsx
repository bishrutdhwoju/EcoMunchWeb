import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import adminService from "@/services/adminService";
import recipeService from "@/services/recipeService";
import Layout from "@/components/Layout";
import ConfirmDialog from "@/components/ConfirmDialog";
import RecipeDialog from "@/components/RecipeDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Filter,
  Trash2,
} from "lucide-react";

const statusConfig = {
  approved: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Approved" },
  pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Pending" },
  rejected: { color: "bg-red-100 text-red-700", icon: XCircle, label: "Rejected" },
};

export default function AdminRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [expandedRecipeDetails, setExpandedRecipeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ isOpen: false, id: null, title: "" });

  useEffect(() => {
    fetchRecipes();
  }, [statusFilter]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllRecipes(statusFilter);
      setRecipes(data.recipes);
    } catch (err) {
      toast.error("Failed to load recipes");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await adminService.updateRecipeStatus(id, "approved");
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
      );
      toast.success("Recipe approved");
    } catch (err) {
      toast.error("Failed to approve recipe");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      await adminService.updateRecipeStatus(id, "rejected");
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
      );
      toast.success("Recipe rejected");
    } catch (err) {
      toast.error("Failed to reject recipe");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePending = async (id) => {
    try {
      setActionLoading(id);
      await adminService.updateRecipeStatus(id, "pending");
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "pending" } : r))
      );
      toast.success("Recipe moved to pending");
    } catch (err) {
      toast.error("Failed to move to pending");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewRecipe = async (id) => {
    try {
      setLoadingDetails(true);
      setExpandedRecipeId(id);
      const data = await recipeService.getById(id);
      setExpandedRecipeDetails(data.recipe);
    } catch (err) {
      console.error("Failed to fetch recipe details:", err);
      toast.error("Failed to load recipe details");
      setExpandedRecipeId(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDelete = async () => {
    const { id } = deleteConfirmDialog;
    try {
      setActionLoading(id);
      await recipeService.delete(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      toast.success("Recipe deleted");
    } catch (err) {
      toast.error("Failed to delete recipe");
    } finally {
      setActionLoading(null);
      setDeleteConfirmDialog({ isOpen: false, id: null, title: "" });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            Recipe Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Review, approve or reject submitted recipes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{recipes.length}</p>
              <p className="text-xs text-muted-foreground">Total Recipes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {recipes.filter((r) => r.status === "pending").length}
              </p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
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
              <p className="text-2xl font-bold text-red-600">
                {recipes.filter((r) => r.status === "rejected").length}
              </p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recipe List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredRecipes.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No recipes found
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredRecipes.map((recipe) => {
              const status = statusConfig[recipe.status];
              const StatusIcon = status.icon;
              return (
                <Card key={recipe.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {recipe.imageUrl ? (
                            <img src={`http://localhost:8000${recipe.imageUrl}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UtensilsCrossed className="h-6 w-6 text-primary/50" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">{recipe.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {recipe.author?.name || "Unknown"} • {formatDate(recipe.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                        {recipe.status !== "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                            onClick={() => handleApprove(recipe.id)}
                            disabled={actionLoading === recipe.id}
                          >
                            {actionLoading === recipe.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                        )}
                        {recipe.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleReject(recipe.id)}
                            disabled={actionLoading === recipe.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        )}
                        {recipe.status !== "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-yellow-600"
                            onClick={() => handlePending(recipe.id)}
                            disabled={actionLoading === recipe.id}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            To Pending
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => handleViewRecipe(recipe.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfirmDialog({ isOpen: true, id: recipe.id, title: recipe.title })}
                          disabled={actionLoading === recipe.id}
                        >
                          <Trash2 className="h-4 w-4" />
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
          isLoading={actionLoading === deleteConfirmDialog.id}
        />
      </div>
    </Layout>
  );
}
