import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://20.75.167.214:8080/",
  timeout: 10000,
  withCredentials: true, // Envoyer les cookies avec chaque requête
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou non authentifié
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
