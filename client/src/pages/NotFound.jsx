import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Leaf, UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center min-h-[60vh]">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
            <UtensilsCrossed className="h-16 w-16 text-primary/40" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-xl">🍂</span>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Looks like this recipe got lost in the kitchen! The page you're looking for
          doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/recipes">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
              <Leaf className="h-4 w-4" />
              Browse Recipes
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
