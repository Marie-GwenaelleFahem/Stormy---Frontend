import axios from "axios";
import { useAuthStore } from "../auth/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://20.75.167.214:8080",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add token to headers
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand store (works outside React components)
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth from Zustand
      const { logout } = useAuthStore.getState();
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
