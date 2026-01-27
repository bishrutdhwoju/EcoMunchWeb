import { Loader2, Timer, Flame, Users, Leaf, Clock, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function RecipeDialog({ 
  isOpen, 
  onClose, 
  loadingDetails, 
  expandedRecipeDetails 
}) {
  const formatTime = (minutes) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {loadingDetails ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : expandedRecipeDetails ? (
          <div className="space-y-6">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                {expandedRecipeDetails.category?.name && (
                  <span className="text-xs uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {expandedRecipeDetails.category.name}
                  </span>
                )}
                {expandedRecipeDetails.dietary && (
                  <span className="text-xs uppercase tracking-wider font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    {expandedRecipeDetails.dietary}
                  </span>
                )}
                {expandedRecipeDetails.difficulty && (
                  <span className="text-xs uppercase tracking-wider font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                    {expandedRecipeDetails.difficulty}
                  </span>
                )}
                {expandedRecipeDetails.sustainability && (
                  <span className="text-xs uppercase tracking-wider font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1">
                    <Leaf className="h-3 w-3" />
                    {expandedRecipeDetails.sustainability}
                  </span>
                )}
              </div>
              <DialogTitle className="text-2xl pt-1">
                {expandedRecipeDetails.title}
              </DialogTitle>
            </DialogHeader>

            <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
              {expandedRecipeDetails.imageUrl ? (
                <img 
                  src={`http://localhost:8000${expandedRecipeDetails.imageUrl}`} 
                  alt={expandedRecipeDetails.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/30">
                  <Flame className="h-16 w-16" />
                </div>
              )}
            </div>

            {expandedRecipeDetails.description && (
              <p className="text-foreground text-sm border-l-4 border-primary pl-4 py-1 italic">
                {expandedRecipeDetails.description}
              </p>
            )}

            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="bg-muted/50 rounded-xl p-3 border">
                <Timer className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Prep</p>
                <p className="font-semibold text-base">{formatTime(expandedRecipeDetails.prepTime)}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 border">
                <Flame className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Cook</p>
                <p className="font-semibold text-base">{formatTime(expandedRecipeDetails.cookingTime)}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 border">
                <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Servings</p>
                <p className="font-semibold text-base">{expandedRecipeDetails.servings || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
              {/* Ingredients column */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Ingredients
                </h4>
                {expandedRecipeDetails.ingredients ? (
                  <ul className="space-y-2">
                    {expandedRecipeDetails.ingredients.split('\n').filter(i => i.trim()).map((ingredient, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground items-start">
                        <span className="text-primary mt-1">•</span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No ingredients specified.</p>
                )}

                {expandedRecipeDetails.nutrition && Object.keys(expandedRecipeDetails.nutrition).length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Nutrition</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(expandedRecipeDetails.nutrition).map(([key, value]) => (
                        value && (
                          <span key={key} className="text-xs bg-muted/50 rounded px-2.5 py-1 flex flex-col items-center border">
                            <span className="text-muted-foreground capitalize font-medium mb-0.5">{key}</span>{" "}
                            <span className="font-bold">{value}</span>
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions column */}
              <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Instructions
                </h4>
                <div className="space-y-4">
                  {expandedRecipeDetails.instructions.split('\n\n').filter(i => i.trim()).map((step, i) => (
                    <div key={i} className="text-sm text-foreground bg-muted/20 rounded-lg p-3 border">
                      <span className="font-bold text-primary mb-1 block">Step {i + 1}</span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {expandedRecipeDetails.author && (
              <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground pt-4 border-t mt-6">
                <span>By</span>
                <span className="font-semibold px-2 py-1 bg-muted rounded-full text-foreground">{expandedRecipeDetails.author.name}</span>
                </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
