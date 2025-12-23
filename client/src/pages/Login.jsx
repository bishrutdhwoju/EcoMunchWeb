import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BubbleParticles from "@/components/BubbleParticles";
import { Leaf, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await login(data.email, data.password);
      toast.success("Welcome back!", {
        description: "You've successfully signed in to EcoMunch",
      });
      
      if (res?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error("Login failed", {
        description: err.response?.data?.message || "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-8 bg-white">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-8 w-fit">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-emerald-800">EcoMunch</span>
        </Link>

        {/* Form Container */}
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500">
              Sign in to continue your healthy cooking journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white text-base ${
                    errors.email ? "border-red-400" : "focus:border-emerald-500"
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Link to="/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white text-base ${
                    errors.password ? "border-red-400" : "focus:border-emerald-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-600 font-medium hover:text-emerald-700">
              Create one for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-8 flex-col items-center justify-center relative overflow-hidden">
        {/* Bubble Particles */}
        <BubbleParticles />
        
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-emerald-200/40 blur-2xl" />
          <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-teal-200/30 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-green-300/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {/* Image */}
          <div className="mb-8">
            <img 
              src="/EcoMunch-image.png" 
              alt="EcoMunch" 
              className="w-64 h-64 xl:w-72 xl:h-72 object-contain drop-shadow-lg"
            />
          </div>
          
          <h2 className="text-3xl font-bold text-emerald-900 mb-3">
            Good Food, Good Mood
          </h2>
          <p className="text-emerald-700/80 max-w-sm text-lg">
            Discover authentic Nepali recipes that nourish your body and delight your taste buds.
          </p>
        </div>
      </div>
    </div>
  );
}
