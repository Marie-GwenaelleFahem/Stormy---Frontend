import api from "./api";
import { User } from "../types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  me: async () => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },
};
