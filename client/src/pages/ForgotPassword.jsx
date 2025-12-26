import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BubbleParticles from "@/components/BubbleParticles";
import {
  Leaf,
  Mail,
  Lock,
  ShieldQuestion,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  CheckCircle,
} from "lucide-react";

// Step 1: Email schema
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

// Step 2: Security answer schema
const answerSchema = z.object({
  securityAnswer: z.string().min(1, "Please enter your answer"),
});

// Step 3: New password schema
const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State carried between steps
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [resetToken, setResetToken] = useState("");

  // Step 1 form
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  // Step 2 form
  const answerForm = useForm({
    resolver: zodResolver(answerSchema),
    defaultValues: { securityAnswer: "" },
  });

  // Step 3 form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const newPassword = passwordForm.watch("newPassword");

  const passwordChecks = [
    { label: "6+ chars", valid: newPassword?.length >= 6 },
    { label: "Uppercase", valid: /[A-Z]/.test(newPassword || "") },
    { label: "Lowercase", valid: /[a-z]/.test(newPassword || "") },
    { label: "Number", valid: /[0-9]/.test(newPassword || "") },
    { label: "Special", valid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword || "") },
  ];

  // Step 1: Submit email to get security question
  const handleEmailSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await authAPI.getSecurityQuestion(data.email);
      setEmail(data.email);
      setSecurityQuestion(response.data.securityQuestion);
      setCurrentStep(2);
    } catch (err) {
      toast.error("Error", {
        description: err.response?.data?.message || "No account found with this email.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify security answer
  const handleAnswerSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await authAPI.verifySecurityAnswer(email, data.securityAnswer);
      setResetToken(response.data.resetToken);
      setCurrentStep(3);
    } catch (err) {
      toast.error("Error", {
        description: err.response?.data?.message || "Incorrect answer. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handlePasswordSubmit = async (data) => {
    try {
      setIsLoading(true);
      await authAPI.resetPassword(resetToken, data.newPassword);
      toast.success("Password reset!", {
        description: "Your password has been reset. You can now sign in.",
      });
      navigate("/login");
    } catch (err) {
      toast.error("Error", {
        description: err.response?.data?.message || "Failed to reset password. Please try again.",
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
          {/* Progress */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Step {currentStep}/3
            </span>
            <div className="flex gap-1.5 flex-1">
              <div className={`h-1 flex-1 rounded-full ${currentStep >= 1 ? "bg-emerald-500" : "bg-gray-200"}`} />
              <div className={`h-1 flex-1 rounded-full ${currentStep >= 2 ? "bg-emerald-500" : "bg-gray-200"}`} />
              <div className={`h-1 flex-1 rounded-full ${currentStep >= 3 ? "bg-emerald-500" : "bg-gray-200"}`} />
            </div>
          </div>

          {/* ===== STEP 1: Enter Email ===== */}
          {currentStep === 1 && (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot password?
                </h1>
                <p className="text-gray-500">
                  Enter your email and we'll help you reset your password using your security question.
                </p>
              </div>

              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-5">
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
                      {...emailForm.register("email")}
                      className={`pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white text-base ${
                        emailForm.formState.errors.email ? "border-red-400" : "focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="text-xs text-red-500 mt-1">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Looking up account...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}

          {/* ===== STEP 2: Answer Security Question ===== */}
          {currentStep === 2 && (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Security question
                </h1>
                <p className="text-gray-500">
                  Answer the security question you set during registration.
                </p>
              </div>

              {/* Show the question */}
              <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldQuestion className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Your Question</span>
                </div>
                <p className="text-sm font-medium text-emerald-900">{securityQuestion}</p>
              </div>

              <form onSubmit={answerForm.handleSubmit(handleAnswerSubmit)} className="space-y-5">
                <div>
                  <Label htmlFor="securityAnswer" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Your Answer
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="securityAnswer"
                      type="text"
                      placeholder="Enter your answer"
                      {...answerForm.register("securityAnswer")}
                      className={`pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white text-base ${
                        answerForm.formState.errors.securityAnswer ? "border-red-400" : "focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  {answerForm.formState.errors.securityAnswer && (
                    <p className="text-xs text-red-500 mt-1">{answerForm.formState.errors.securityAnswer.message}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="h-12 px-6 border-gray-300"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Answer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* ===== STEP 3: Set New Password ===== */}
          {currentStep === 3 && (
            <>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-emerald-600">Identity verified</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Set new password
                </h1>
                <p className="text-gray-500">
                  Choose a strong password for your account.
                </p>
              </div>

              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-5">
                {/* New Password */}
                <div>
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 mb-1.5 block">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      {...passwordForm.register("newPassword")}
                      className={`pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white text-base ${
                        passwordForm.formState.errors.newPassword ? "border-red-400" : "focus:border-emerald-500"
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
                      {...passwordForm.register("confirmPassword")}
                      className={`pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white text-base ${
                        passwordForm.formState.errors.confirmPassword ? "border-red-400" : "focus:border-emerald-500"
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
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </>
          )}

          {/* Back to login */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
              Sign in
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
            We've Got You
          </h2>
          <p className="text-emerald-700/80 max-w-sm text-lg">
            Don't worry — your recipes and bookmarks are safe. Let's get you back in!
          </p>
        </div>
      </div>
    </div>
  );
}
