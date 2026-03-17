import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";
import { authApi } from "../services";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
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

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error("Logout error:", error);
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: () => {
        const { token } = get();
        // Si on a un token (même "cookie"), on considère qu'on est auth
        // Les cookies seront gérés automatiquement par Axios
        if (token) {
          set({ isAuthenticated: true });
        } else {
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key pour persister l'user
    },
  ),
);
