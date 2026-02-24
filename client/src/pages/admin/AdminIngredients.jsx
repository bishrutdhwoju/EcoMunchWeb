import { useState, useEffect } from "react";
import { toast } from "sonner";
import adminService from "@/services/adminService";
import Layout from "@/components/Layout";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Leaf,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Check,
  Loader2,
} from "lucide-react";

export default function AdminIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ isOpen: false, id: null, name: "" });

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getIngredients();
      setIngredients(data.ingredients);
    } catch (err) {
      toast.error("Failed to load ingredients");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredIngredients = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newName.trim()) {
      toast.error("Please enter an ingredient name");
      return;
    }
    try {
      setActionLoading("add");
      const data = await adminService.createIngredient(newName.trim(), newCategory.trim() || "Other");
      setIngredients([...ingredients, { ...data.ingredient, usedIn: 0 }]);
      setNewName("");
      setNewCategory("");
      toast.success("Ingredient added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add ingredient");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      setActionLoading(id);
      await adminService.updateIngredient(id, editName.trim());
      setIngredients(
        ingredients.map((i) => (i.id === id ? { ...i, name: editName.trim() } : i))
      );
      setEditingId(null);
      toast.success("Ingredient updated");
    } catch (err) {
      toast.error("Failed to update ingredient");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    const { id, name } = deleteConfirmDialog;
    try {
      setActionLoading(id);
      await adminService.deleteIngredient(id);
      setIngredients(ingredients.filter((i) => i.id !== id));
      toast.success("Ingredient deleted");
    } catch (err) {
      toast.error("Failed to delete ingredient");
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
            <Leaf className="h-8 w-8 text-primary" />
            Ingredients
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage recipe ingredients database
          </p>
        </div>

        {/* Add Ingredient */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Add New Ingredient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Input
                placeholder="Ingredient name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="max-w-xs"
              />
              <Input
                placeholder="Category (e.g., Spices)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
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

        {/* Search */}
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Ingredients Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : ingredients.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No ingredients yet. Add one above!
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingredient</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Used In</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIngredients.map((ing) => (
                    <TableRow key={ing.id}>
                      <TableCell>
                        {editingId === ing.id ? (
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 w-40"
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium">{ing.name}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{ing.category || "Other"}</TableCell>
                      <TableCell className="text-muted-foreground">{ing.usedIn || 0} recipes</TableCell>
                      <TableCell className="text-right">
                        {editingId === ing.id ? (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleSaveEdit(ing.id)}
                              disabled={actionLoading === ing.id}
                            >
                              {actionLoading === ing.id ? (
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
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(ing.id, ing.name)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => setDeleteConfirmDialog({ isOpen: true, id: ing.id, name: ing.name })}
                              disabled={actionLoading === ing.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
        <ConfirmDialog
          isOpen={deleteConfirmDialog.isOpen}
          onClose={() => setDeleteConfirmDialog({ isOpen: false, id: null, name: "" })}
          onConfirm={handleDelete}
          title="Delete Ingredient"
          description={`Are you sure you want to delete "${deleteConfirmDialog.name}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="destructive"
          isLoading={actionLoading === deleteConfirmDialog.id}
        />
      </div>
    </Layout>
  );
}
