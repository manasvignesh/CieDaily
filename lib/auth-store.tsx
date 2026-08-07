/**
 * Authentication Store with Real Database Integration
 * 
 * This replaces the mock authentication with real database-backed auth
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from "react";
import { trpc } from "./trpc";

const TOKEN_KEY = "cie_auth_token";

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  department: string | null;
  year: number | null;
  collegeDomain: string | null;
  skills: string | null;
  techStack: string | null;
  interests: string | null;
  learningStreak: number | null;
  role: "student" | "space_admin" | "system_admin";
  isEmailVerified: boolean;
  isAccountSuspended: boolean;
  isOnline: boolean;
  githubUrl: string | null;
  linkedinUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and user on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        // Verify token and get user
        const result = await trpc.auth.verifyToken.query({ token: storedToken });
        if (result.valid && result.user) {
          setToken(storedToken);
          setCurrentUser(result.user as AuthUser);
        } else {
          // Token invalid, clear it
          await AsyncStorage.removeItem(TOKEN_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to load auth:", error);
      await AsyncStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await trpc.auth.login.mutate({ email, password });
      
      if (result.success && result.token && result.user) {
        // Store token
        await AsyncStorage.setItem(TOKEN_KEY, result.token);
        setToken(result.token);
        setCurrentUser(result.user as AuthUser);
        return true;
      } else {
        console.error("Login failed:", result.error);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const result = await trpc.auth.register.mutate({
        name,
        email,
        password,
      });
      
      if (result.success && result.token && result.user) {
        // Store token
        await AsyncStorage.setItem(TOKEN_KEY, result.token);
        setToken(result.token);
        setCurrentUser(result.user as AuthUser);
        return true;
      } else {
        console.error("Registration failed:", result.error);
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    if (currentUser) {
      try {
        await trpc.auth.logout.mutate({ userId: currentUser.id });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    
    // Clear local state
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCurrentUser(null);
  }, [currentUser]);

  const updateProfile = useCallback(async (updates: Partial<AuthUser>) => {
    if (!currentUser) return;

    try {
      const result = await trpc.auth.updateProfile.mutate({
        userId: currentUser.id,
        ...updates,
      });

      if (result.success && result.user) {
        setCurrentUser(result.user as AuthUser);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }, [currentUser]);

  const refreshUser = useCallback(async () => {
    if (!currentUser) return;

    try {
      const user = await trpc.auth.getUserById.query({ userId: currentUser.id });
      if (user) {
        setCurrentUser(user as AuthUser);
      }
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
