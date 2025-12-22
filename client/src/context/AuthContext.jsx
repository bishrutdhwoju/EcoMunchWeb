import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/services/api";
import { toast } from "sonner";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      // Not authenticated, user stays null
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    if (response.data.success) {
      setUser(response.data.user);
    }
    return response.data;
  };

  const register = async (name, email, password, securityQuestion, securityAnswer) => {
    const response = await authAPI.register({ name, email, password, securityQuestion, securityAnswer });
    if (response.data.success) {
      setUser(response.data.user);
    }
    return response.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      toast.success("Logged out", {
        description: "You have been successfully logged out.",
      });
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
