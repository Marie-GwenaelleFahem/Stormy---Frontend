import { User } from "../types";
import { authApi } from "../services";

/**
 * Authentifie un utilisateur via l'API Azure
 */
export const authenticate = async (
  username: string,
  password: string,
): Promise<User | null> => {
  try {
    const user = await authApi.login({ username, password });
    return user;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

/**
 * Crée un nouvel utilisateur via l'API Azure
 */
export const registerUser = async (
  phone: string,
  username: string,
  password: string,
  email?: string,
): Promise<User> => {
  try {
    const user = await authApi.register({
      phone,
      username,
      password,
      email,
    });
    return user;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

/**
 * Valide un email (format basique)
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Valide un téléphone (format basique)
 */
export const isValidPhone = (phone: string): boolean => {
  return phone.length >= 10;
};

/**
 * Valide un username
 */
export const isValidUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 50;
};

/**
 * Décode un token JWT standard (3 parties)
 */
export const decodeMockToken = (token: string): any => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
};

/**
 * Vérifie si un token JWT est valide
 */
export const isTokenValid = (token: string): boolean => {
  if (!token) return false;

  const decoded = decodeMockToken(token);
  if (!decoded) return false;

  // Vérifier l'expiration si présente
  if (decoded.exp) {
    return decoded.exp * 1000 > Date.now();
  }

  return true;
};
