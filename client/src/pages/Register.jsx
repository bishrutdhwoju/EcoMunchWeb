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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Leaf, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Calendar,
  ChefHat,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldQuestion
} from "lucide-react";

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was the name of your first school?",
  "What is your favorite food?",
];

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
    dob: z.string().optional(),
    cookingLevel: z.string().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
    securityAnswer: z.string().min(1, "Security answer is required"),
    agreeTerms: z.boolean().refine(val => val === true, {
      message: "You must agree to the terms"
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [securityQuestion, setSecurityQuestion] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      cookingLevel: "",
      password: "",
      confirmPassword: "",
      securityAnswer: "",
      agreeTerms: false
    },
  });

  const password = watch("password");

  const passwordChecks = [
    { label: "6+ chars", valid: password?.length >= 6 },
    { label: "Uppercase", valid: /[A-Z]/.test(password || "") },
    { label: "Lowercase", valid: /[a-z]/.test(password || "") },
    { label: "Number", valid: /[0-9]/.test(password || "") },
    { label: "Special", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password || "") },
  ];

  const handleNextStep = async () => {
    const isValid = await trigger(["name", "email"]);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const onSubmit = async (data) => {
    if (!securityQuestion) {
      toast.error("Missing field", { description: "Please select a security question" });
      return;
    }
    try {
      setIsLoading(true);
      const res = await registerUser(
        data.name,
        data.email,
        data.password,
        securityQuestion,
        data.securityAnswer
      );
      toast.success("Account created!", {
        description: "Welcome to EcoMunch! Start exploring healthy recipes.",
      });
      if (res?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error("Registration failed", {
        description: err.response?.data?.message || "Please try again with different credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-8 flex-col items-center justify-center relative overflow-hidden">
        {/* Bubble Particles */}
        <BubbleParticles />
        
        {/* Logo */}
        <Link to="/" className="absolute top-8 left-8 inline-flex items-center gap-2 z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-emerald-800">EcoMunch</span>
        </Link>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <img 
            src="/EcoMunch-image.png" 
            alt="EcoMunch" 
            className="w-72 h-72 xl:w-80 xl:h-80 object-contain drop-shadow-lg"
          />
          <h2 className="text-2xl font-bold text-emerald-900 mt-6 mb-2">Eat Well, Live Well</h2>
          <p className="text-emerald-700/80 text-center max-w-sm">
            Join our community exploring authentic Nepali recipes for a healthier lifestyle.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-8 bg-white">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-emerald-700">EcoMunch</span>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Step {currentStep}/2
              </span>
              <div className="flex gap-1.5 flex-1">
                <div className={`h-1 flex-1 rounded-full ${currentStep >= 1 ? "bg-emerald-500" : "bg-gray-200"}`} />
                <div className={`h-1 flex-1 rounded-full ${currentStep >= 2 ? "bg-emerald-500" : "bg-gray-200"}`} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentStep === 1 ? "Create your account" : "Secure your account"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {currentStep === 1 
                ? "Tell us about yourself to get started" 
                : "Choose a strong password to protect your account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      {...register("name")}
                      className={`pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white ${
                        errors.name ? "border-red-400" : "focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>

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
                      className={`pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white ${
                        errors.email ? "border-red-400" : "focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Phone <span className="text-gray-400 font-normal">(optional)</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+977 98XXXXXXXX"
                      {...register("phone")}
                      className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Birthday */}
                <div>
                  <Label htmlFor="dob" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Birthday
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      id="dob"
                      type="date"
                      {...register("dob")}
                      className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Cooking Experience
                  </Label>
                  <div className="relative">
                    <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                    <Select onValueChange={(value) => setValue("cookingLevel", value)}>
                      <SelectTrigger className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 w-full">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="chef">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="button" 
                  onClick={handleNextStep}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium mt-2"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      {...register("password")}
                      className={`pl-10 pr-10 h-11 bg-gray-50 border-gray-200 focus:bg-white ${
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
                  <div className="flex items-center gap-4 mt-2">
                    {passwordChecks.map((check, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          check.valid ? "bg-emerald-500" : "bg-gray-200"
                        }`}>
                          {check.valid && <Check className="h-2 w-2 text-white" />}
                        </div>
                        <span className={`text-xs ${check.valid ? "text-emerald-600" : "text-gray-400"}`}>
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      {...register("confirmPassword")}
                      className={`pl-10 pr-10 h-11 bg-gray-50 border-gray-200 focus:bg-white ${
                        errors.confirmPassword ? "border-red-400" : "focus:border-emerald-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Security Question */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Security Question
                  </Label>
                  <div className="relative">
                    <ShieldQuestion className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                    <Select onValueChange={(value) => setSecurityQuestion(value)}>
                      <SelectTrigger className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-500 w-full">
                        <SelectValue placeholder="Choose a security question" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECURITY_QUESTIONS.map((q) => (
                          <SelectItem key={q} value={q}>{q}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Security Answer */}
                <div>
                  <Label htmlFor="securityAnswer" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Security Answer
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="securityAnswer"
                      type="text"
                      placeholder="Your answer (used for password recovery)"
                      {...register("securityAnswer")}
                      className={`pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white ${
                        errors.securityAnswer ? "border-red-400" : "focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  {errors.securityAnswer && (
                    <p className="text-xs text-red-500 mt-1">{errors.securityAnswer.message}</p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input 
                    type="checkbox"
                    {...register("agreeTerms")}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link to="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-red-500">{errors.agreeTerms.message}</p>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="h-11 px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Sign in */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
