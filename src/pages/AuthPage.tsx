import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  authenticate,
  registerUser,
  isValidUsername,
  isValidPhone,
} from "../auth/authUtils";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        // Login avec username + password
        if (!username || !password) {
          setError("Tous les champs sont requis");
          setLoading(false);
          return;
        }

        const user = await authenticate(username, password);
        if (!user) {
          setError("Identifiants incorrects");
          setLoading(false);
          return;
        }

        // Stocke l'user et le cookie (géré par Axios automatiquement)
        login(user, "cookie");
      } else {
        // Signup avec phone + username + password
        // Validations
        if (!phone || !username || !password) {
          setError("Tous les champs sont requis");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas");
          setLoading(false);
          return;
        }

        if (password.length < 8) {
          setError("Le mot de passe doit contenir au moins 8 caractères");
          setLoading(false);
          return;
        }

        if (!isValidPhone(phone)) {
          setError("Numéro de téléphone invalide");
          setLoading(false);
          return;
        }

        if (!isValidUsername(username)) {
          setError("Nom d'utilisateur invalide (3-50 caractères)");
          setLoading(false);
          return;
        }

        // Créer le compte
        const newUser = await registerUser(phone, username, password, email);
        login(newUser, "cookie");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Une erreur s'est produite. Réessayez.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
    setPhone("");
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="text-gray-600">
            {mode === "login"
              ? "Content de vous revoir !"
              : "Rejoignez-nous dès maintenant"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Signup only: Phone */}
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Téléphone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="+33612345678"
                  required={mode === "signup"}
                />
              </div>
            )}

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="JohnDoe"
                required
              />
            </div>

            {/* Signup only: Email (optionnel) */}
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email (optionnel)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="vous@exemple.com"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
              {mode === "signup" && (
                <p className="text-xs text-gray-500 mt-1">
                  Min 8 caractères, 1 chiffre et 1 caractère spécial requis
                </p>
              )}
            </div>

            {/* Signup only: Confirm Password */}
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required={mode === "signup"}
                />
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Chargement..."
                : mode === "login"
                  ? "Se connecter"
                  : "Créer mon compte"}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-6 text-center">
            <button
              onClick={switchMode}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition"
            >
              {mode === "login"
                ? "Pas encore de compte ? Inscrivez-vous"
                : "Déjà un compte ? Connectez-vous"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
