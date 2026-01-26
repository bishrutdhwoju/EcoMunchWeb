import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import recipeService from "@/services/recipeService";
import Layout from "@/components/Layout";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  Save,
  UtensilsCrossed,
  Trash2,
} from "lucide-react";

// Form validation schema
const recipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  ingredients: z.string().min(5, "Ingredients must be at least 5 characters"),
  instructions: z.string().min(20, "Instructions must be at least 20 characters"),
  servings: z.coerce.number().min(1, "Servings must be at least 1").max(20, "Max 20 servings"),
  prepTime: z.coerce.number().min(1, "Prep time required").max(480, "Max 8 hours"),
  cookTime: z.coerce.number().min(1, "Cook time required").max(480, "Max 8 hours"),
});

// Options
const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snacks", "Desserts", "Beverages"];
const DIETARY = ["Vegetarian", "Non-Vegetarian", "Vegan"];
const SUSTAINABILITY = ["Seasonal", "Zero-Waste", "Local Ingredients"];
const DIFFICULTY = ["easy", "medium", "hard"];

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const isEditing = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(isEditing);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  
  // Select states
  const [category, setCategory] = useState("");
  const [dietary, setDietary] = useState("");
  const [sustainability, setSustainability] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      description: "",
      ingredients: "",
      instructions: "",
      servings: 4,
      prepTime: 15,
      cookTime: 30,
    },
  });

  // Load existing recipe data if editing
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getById(id);
        const recipe = data.recipe;
        
        reset({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients || "",
          instructions: recipe.instructions,
          servings: recipe.servings,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookingTime,
        });
        
        setCategory(recipe.category?.name || "");
        setDietary(recipe.dietary || "");
        setSustainability(recipe.sustainability || "");
        setDifficulty(recipe.difficulty || "medium");
        
        if (recipe.imageUrl) {
          setImagePreview(`http://localhost:8000${recipe.imageUrl}`);
        }
      } catch (err) {
        toast.error("Failed to load recipe");
        navigate("/my-recipes");
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (isEditing) {
      fetchRecipe();
    }
  }, [id, isEditing, reset, navigate]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", { description: "Please select an image file" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", { description: "Image must be less than 5MB" });
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data) => {
    if (!category) {
      toast.error("Missing field", { description: "Please select a category" });
      return;
    }
    if (!dietary) {
      toast.error("Missing field", { description: "Please select a dietary preference" });
      return;
    }

    try {
      setIsLoading(true);

      
      const recipeBody = {
        ...data,
        categoryName: category,
        dietary,
        sustainability: sustainability || null,
        difficulty,
        image: imageFile,
      };

      if (isEditing) {
        await recipeService.update(id, recipeBody);
      } else {
        await recipeService.create(recipeBody);
      }

      toast.success(isEditing ? "Recipe updated!" : "Recipe published!", {
        description: isEditing
          ? "Your recipe has been updated successfully."
          : "Your recipe is now live on the Explore page!",
      });

      navigate("/my-recipes");
    } catch (err) {
      toast.error("Failed to save recipe", {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await recipeService.delete(id);
      toast.success("Recipe deleted");
      navigate("/my-recipes");
    } catch (err) {
      toast.error("Deletion failed");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmDialog(false);
    }
  };

  if (isInitialLoading) {
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
          <Link
            to="/my-recipes"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Recipes
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {isEditing ? "Edit Recipe" : "Add New Recipe"}
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update your recipe details below"
                  : "Share your delicious recipe with the community"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label>Recipe Image</Label>
                  <div
                    onClick={handleImageClick}
                    className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:border-primary/50 ${
                      imagePreview ? "border-primary" : "border-muted-foreground/25"
                    }`}
                  >
                    {imagePreview ? (
                      <div className="relative aspect-video">
                        <img
                          src={imagePreview}
                          alt="Recipe preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                          className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Upload className="h-10 w-10" />
                        <p className="text-sm">Click to upload recipe image</p>
                        <p className="text-xs">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Recipe Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Traditional Momo"
                    {...register("title")}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="A brief description of your recipe..."
                    rows={2}
                    {...register("description")}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className={!category ? "text-muted-foreground" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Dietary Type *</Label>
                    <Select value={dietary} onValueChange={setDietary}>
                      <SelectTrigger className={!dietary ? "text-muted-foreground" : ""}>
                        <SelectValue placeholder="Select dietary type" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIETARY.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sustainability Type</Label>
                    <Select value={sustainability} onValueChange={setSustainability}>
                      <SelectTrigger className={!sustainability ? "text-muted-foreground" : ""}>
                        <SelectValue placeholder="Select (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUSTAINABILITY.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className={!difficulty ? "text-muted-foreground" : ""}>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTY.map((d) => (
                          <SelectItem key={d} value={d.toLowerCase()}>
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prepTime">Prep Time (mins) *</Label>
                    <Input id="prepTime" type="number" {...register("prepTime")} />
                    {errors.prepTime && <p className="text-sm text-destructive">{errors.prepTime.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cookTime">Cook Time (mins) *</Label>
                    <Input id="cookTime" type="number" {...register("cookTime")} />
                    {errors.cookTime && <p className="text-sm text-destructive">{errors.cookTime.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servings">Servings *</Label>
                    <Input id="servings" type="number" {...register("servings")} />
                    {errors.servings && <p className="text-sm text-destructive">{errors.servings.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ingredients">Ingredients *</Label>
                  <Textarea id="ingredients" rows={4} placeholder="List items line by line..." {...register("ingredients")} />
                  {errors.ingredients && <p className="text-sm text-destructive">{errors.ingredients.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Cooking Instructions *</Label>
                  <Textarea id="instructions" rows={6} {...register("instructions")} />
                  {errors.instructions && <p className="text-sm text-destructive">{errors.instructions.message}</p>}
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                  {isEditing && (
                    <Button type="button" variant="destructive" onClick={() => setDeleteConfirmDialog(true)} disabled={isDeleting || isLoading}>
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                      Delete Recipe
                    </Button>
                  )}
                  <div className="flex-1" />
                  <Button type="button" variant="outline" onClick={() => navigate("/my-recipes")} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {isEditing ? "Update Recipe" : "Submit Recipe"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmDialog}
        onClose={() => setDeleteConfirmDialog(false)}
        onConfirm={handleDelete}
        title="Delete Recipe"
        description="Are you sure you want to delete this recipe? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
      />
    </Layout>
  );
}
