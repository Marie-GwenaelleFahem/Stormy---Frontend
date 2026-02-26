import React, { createContext, useContext, useEffect } from "react";
import { useAuthStore } from "./authStore";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token, isAuthenticated, setAuth, logout, checkAuth } =
    useAuthStore();

  // Vérifier l'auth au chargement
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (user: User, token: string) => {
    setAuth(user, token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
