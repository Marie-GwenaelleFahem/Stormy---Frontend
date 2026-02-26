import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";
import { decodeMockToken, isTokenValid } from "./authUtils";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: () => {
        const { token } = get();

        if (!token || !isTokenValid(token)) {
          get().logout();
          return;
        }

        // Le token est valide, on peut extraire les infos user si nécessaire
        const decoded = decodeMockToken(token);
        if (decoded && !get().user) {
          // Reconstruction basique du user depuis le token
          set({
            user: {
              id: decoded.userId,
              username: decoded.username,
              email: decoded.email,
              passwordHash: "",
              createdAt: decoded.iat,
              status: "online",
            },
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
    },
  ),
);
