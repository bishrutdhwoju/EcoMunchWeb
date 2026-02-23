import { useState, useEffect } from "react";
import { toast } from "sonner";
import adminService from "@/services/adminService";
import Layout from "@/components/Layout";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  LayoutGrid,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  UtensilsCrossed,
  Loader2,
} from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ isOpen: false, id: null, name: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getCategories();
      setCategories(data.categories);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    try {
      setActionLoading("add");
      const data = await adminService.createCategory(newCategory.trim());
      setCategories([...categories, { ...data.category, recipeCount: 0 }]);
      setNewCategory("");
      toast.success("Category added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (id) => {
    const cat = categories.find((c) => c.id === id);
    setEditingId(id);
    setEditValue(cat.name);
  };

  const handleSaveEdit = async (id) => {
    if (!editValue.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    try {
      setActionLoading(id);
      await adminService.updateCategory(id, editValue.trim());
      setCategories(
        categories.map((c) => (c.id === id ? { ...c, name: editValue.trim() } : c))
      );
      setEditingId(null);
      toast.success("Category updated");
    } catch (err) {
      toast.error("Failed to update category");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    const { id, name } = deleteConfirmDialog;
    try {
      setActionLoading(id);
      await adminService.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error("Failed to delete category");
    } finally {
      setActionLoading(null);
      setDeleteConfirmDialog({ isOpen: false, id: null, name: "" });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutGrid className="h-8 w-8 text-primary" />
            Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage recipe categories
          </p>
        </div>

        {/* Add Category */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="max-w-xs"
              />
              <Button onClick={handleAdd} className="gap-2" disabled={actionLoading === "add"}>
                {actionLoading === "add" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No categories yet. Add one above!
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Card key={cat.id} className="group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <UtensilsCrossed className="h-5 w-5 text-primary" />
                      </div>
                      {editingId === cat.id ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(cat.id)}
                          className="h-8 w-32"
                          autoFocus
                        />
                      ) : (
                        <div>
                          <p className="font-medium">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {cat.recipeCount || 0} recipes
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {editingId === cat.id ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleSaveEdit(cat.id)}
                            disabled={actionLoading === cat.id}
                          >
                            {actionLoading === cat.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(cat.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => setDeleteConfirmDialog({ isOpen: true, id: cat.id, name: cat.name })}
                            disabled={actionLoading === cat.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <ConfirmDialog
          isOpen={deleteConfirmDialog.isOpen}
          onClose={() => setDeleteConfirmDialog({ isOpen: false, id: null, name: "" })}
          onConfirm={handleDelete}
          title="Delete Category"
          description={`Are you sure you want to delete the category "${deleteConfirmDialog.name}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="destructive"
          isLoading={actionLoading === deleteConfirmDialog.id}
        />
      </div>
    </Layout>
  );
}
