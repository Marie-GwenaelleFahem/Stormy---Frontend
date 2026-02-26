import { User } from "../types";
import { mockUsers } from "../utils/mockData";

/**
 * Hash un mot de passe avec SHA-256
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * Vérifie un mot de passe contre un hash
 */
export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  const hash = await hashPassword(password);
  return hash === passwordHash;
};

/**
 * Trouve un utilisateur par email
 */
export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
};

/**
 * Vérifie si un email existe déjà
 */
export const emailExists = (email: string): boolean => {
  return !!findUserByEmail(email);
};

/**
 * Vérifie si un username existe déjà
 */
export const usernameExists = (username: string): boolean => {
  return mockUsers.some(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
};

/**
 * Authentifie un utilisateur
 */
export const authenticate = async (
  email: string,
  password: string,
): Promise<User | null> => {
  const user = findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  return isValid ? user : null;
};

/**
 * Crée un nouvel utilisateur (mock - en attendant le back)
 */
export const registerUser = async (
  username: string,
  email: string,
  password: string,
): Promise<User> => {
  const passwordHash = await hashPassword(password);

  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    email,
    passwordHash,
    createdAt: Date.now(),
    status: "online",
  };

  // En dev, on l'ajoute au mock
  mockUsers.push(newUser);

  return newUser;
};

/**
 * Génère un token JWT mock (en attendant le back)
 */
export const generateMockToken = (user: User): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24h
  };

  // En production, ce serait un vrai JWT signé côté serveur
  return btoa(JSON.stringify(payload));
};

/**
 * Décode un token JWT mock
 */
export const decodeMockToken = (token: string): any => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

/**
 * Vérifie si un token est valide
 */
export const isTokenValid = (token: string): boolean => {
  const decoded = decodeMockToken(token);
  if (!decoded || !decoded.exp) {
    return false;
  }

  return decoded.exp > Date.now();
};
