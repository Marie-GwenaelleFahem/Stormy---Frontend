import api from "./api";
import { User } from "../types";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  username: string;
  password: string;
  email?: string;
}

export const authApi = {
  register: async (data: RegisterRequest) => {
    await api.post("/auth/register", data);
    // Après registration, les cookies sont définis, récupérer le user
    return await authApi.me();
  },

  login: async (data: LoginRequest) => {
    await api.post("/auth/login", data);
    // Après login, les cookies sont définis, récupérer le user
    return await authApi.me();
  },

  me: async () => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },
};
