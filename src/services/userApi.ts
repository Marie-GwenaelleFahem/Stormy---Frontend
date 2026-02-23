import api from "./api";
import { User } from "../types";

export const userApi = {
  getUsers: async (search?: string) => {
    const response = await api.get<User[]>("/users", {
      params: { search },
    });
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<User>("/users/me");
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch<User>("/users/me", data);
    return response.data;
  },

  updateStatus: async (status: "online" | "offline" | "away") => {
    const response = await api.patch<User>("/users/me/status", { status });
    return response.data;
  },
};
