import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react";
import * as Auth from "@/lib/_core/auth";

interface AuthContextType {
  user: Auth.User | null;
  loading: boolean;
  login: (user: Auth.User) => void;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Auth.User | null>(null);
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      console.log("[AuthProvider] Restoring session...");
      const cachedUser = await Auth.getUserInfo();
      console.log("[AuthProvider] Cached user:", cachedUser);
      if (cachedUser) {
        setUser(cachedUser);
      }
    } catch (error) {
      console.error("[AuthProvider] Session restoration failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = useCallback((user: Auth.User) => {
    console.log("[AuthProvider] User logged in:", user.email);
    setUser(user);
    Auth.setUserInfo(user);
  }, []);

  const logout = useCallback(() => {
    console.log("[AuthProvider] User logged out");
    setUser(null);
    Auth.clearUserInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
