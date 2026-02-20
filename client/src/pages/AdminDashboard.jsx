import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import adminService from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import {
  Users,
  UtensilsCrossed,
  Leaf,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  LayoutGrid,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    pendingRecipes: 0,
    approvedRecipes: 0,
    totalCategories: 0,
  });
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [usersData, recipesData, categoriesData] = await Promise.all([
        adminService.getUsers(),
        adminService.getAllRecipes("all"),
        adminService.getCategories(),
      ]);

      const recipes = recipesData.recipes || [];
      setStats({
        totalUsers: usersData.users?.length || 0,
        totalRecipes: recipes.length,
        pendingRecipes: recipes.filter((r) => r.status === "pending").length,
        approvedRecipes: recipes.filter((r) => r.status === "approved").length,
        totalCategories: categoriesData.categories?.length || 0,
      });

      setPendingRecipes(recipes.filter((r) => r.status === "pending").slice(0, 5));
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await adminService.updateRecipeStatus(id, "approved");
      setPendingRecipes((prev) => prev.filter((r) => r.id !== id));
      setStats((prev) => ({
        ...prev,
        pendingRecipes: prev.pendingRecipes - 1,
        approvedRecipes: prev.approvedRecipes + 1,
      }));
      toast.success("Recipe approved");
    } catch {
      toast.error("Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      await adminService.updateRecipeStatus(id, "rejected");
      setPendingRecipes((prev) => prev.filter((r) => r.id !== id));
      setStats((prev) => ({
        ...prev,
        pendingRecipes: prev.pendingRecipes - 1,
      }));
      toast.success("Recipe rejected");
    } catch {
      toast.error("Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground">
            Manage recipes, users, and monitor platform activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Recipes
              </CardTitle>
              <UtensilsCrossed className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalRecipes}</div>
              <p className="text-xs text-muted-foreground mt-1">All submissions</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingRecipes}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires review</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.approvedRecipes}</div>
              <p className="text-xs text-muted-foreground mt-1">Published recipes</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Recipes Table */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Pending Recipes
              </CardTitle>
              <CardDescription>
                Recipes waiting for your approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRecipes.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  No pending recipes 🎉
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50 border"
                    >
                      <div>
                        <p className="font-medium">{recipe.title}</p>
                        <p className="text-sm text-muted-foreground">
                          by {recipe.author?.name || "Unknown"} • {formatDate(recipe.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
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
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleReject(recipe.id)}
                          disabled={actionLoading === recipe.id}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/admin/recipes">
                <Button variant="outline" className="w-full mt-4">
                  View All Recipes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Link to="/admin/users">
                  <Button variant="outline" className="justify-start h-auto py-3 w-full">
                    <Users className="mr-3 h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Manage Users</p>
                      <p className="text-xs text-muted-foreground">View and manage user roles</p>
                    </div>
                  </Button>
                </Link>
                <Link to="/admin/recipes">
                  <Button variant="outline" className="justify-start h-auto py-3 w-full">
                    <UtensilsCrossed className="mr-3 h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Manage Recipes</p>
                      <p className="text-xs text-muted-foreground">Review and moderate recipes</p>
                    </div>
                  </Button>
                </Link>
                <Link to="/admin/categories">
                  <Button variant="outline" className="justify-start h-auto py-3 w-full">
                    <LayoutGrid className="mr-3 h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Manage Categories</p>
                      <p className="text-xs text-muted-foreground">Add or edit recipe categories</p>
                    </div>
                  </Button>
                </Link>
                <Link to="/admin/ingredients">
                  <Button variant="outline" className="justify-start h-auto py-3 w-full">
                    <Leaf className="mr-3 h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Manage Ingredients</p>
                      <p className="text-xs text-muted-foreground">Add or edit ingredients</p>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
