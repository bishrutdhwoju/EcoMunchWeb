import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sprout,
  Leaf,
  Recycle,
  TreePine,
  Droplets,
  Sun,
} from "lucide-react";

const tips = [
  {
    icon: Leaf,
    title: "Use Local Ingredients",
    description: "Support local farmers and reduce carbon footprint by buying locally sourced produce.",
  },
  {
    icon: Recycle,
    title: "Reduce Food Waste",
    description: "Plan your meals, use leftovers creatively, and compost food scraps.",
  },
  {
    icon: Droplets,
    title: "Conserve Water",
    description: "Use efficient cooking methods and wash produce in bowls instead of running water.",
  },
  {
    icon: Sun,
    title: "Seasonal Cooking",
    description: "Cook with seasonal ingredients for better taste, nutrition, and sustainability.",
  },
  {
    icon: TreePine,
    title: "Plant-Based Options",
    description: "Incorporate more plant-based meals to reduce environmental impact.",
  },
  {
    icon: Sprout,
    title: "Grow Your Own",
    description: "Start a small herb garden or grow vegetables at home when possible.",
  },
];

export default function Sustainability() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900 dark:text-green-300 mb-4">
            <Sprout className="h-4 w-4" />
            Sustainable Cooking
          </div>
          <h1 className="text-3xl font-bold mb-4">Cook Green, Eat Clean</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn how to make your cooking more sustainable while enjoying delicious Nepali cuisine.
            Small changes in the kitchen can make a big difference for our planet.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <Card key={tip.title} className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-2">
                    <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                  <CardDescription>{tip.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Impact Stats */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-900">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Our Community Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">2,500+</p>
                <p className="text-sm text-muted-foreground">Sustainable Recipes Shared</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">500kg</p>
                <p className="text-sm text-muted-foreground">Food Waste Reduced</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">1,000+</p>
                <p className="text-sm text-muted-foreground">Local Farmers Supported</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">50+</p>
                <p className="text-sm text-muted-foreground">Zero-Waste Recipes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
