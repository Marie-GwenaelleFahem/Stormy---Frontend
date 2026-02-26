import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  authenticate,
  registerUser,
  generateMockToken,
  emailExists,
  usernameExists,
} from "../auth/authUtils";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        // Login
        const user = await authenticate(email, password);
        if (!user) {
          setError("Email ou mot de passe incorrect");
          setLoading(false);
          return;
        }

        const token = generateMockToken(user);
        login(user, token);
      } else {
        // Signup
        // Validations
        if (!username || !email || !password) {
          setError("Tous les champs sont requis");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas");
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("Le mot de passe doit contenir au moins 6 caractères");
          setLoading(false);
          return;
        }

        if (emailExists(email)) {
          setError("Cet email est déjà utilisé");
          setLoading(false);
          return;
        }

        if (usernameExists(username)) {
          setError("Ce nom d'utilisateur est déjà pris");
          setLoading(false);
          return;
        }

        // Créer le compte
        const newUser = await registerUser(username, email, password);
        const token = generateMockToken(newUser);
        login(newUser, token);
      }
    } catch (err) {
      setError("Une erreur s'est produite. Réessayez.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
    setEmail("");
    setPassword("");
    setUsername("");
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
            {/* Signup only: Username */}
            {mode === "signup" && (
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
                  required={mode === "signup"}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="vous@exemple.com"
                required
              />
            </div>

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
