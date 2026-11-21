import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const locationState = location.state as {
    from?: string;
    message?: string;
  } | null;

  const from = locationState?.from || "/";
  const successMessage = locationState?.message;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError(
        "Veuillez renseigner votre adresse email et votre mot de passe.",
      );
      return;
    }

    setLoading(true);

    try {
      const currentUser = await login({
        email,
        password,
      });

      if (currentUser.role === "ADMIN") {
        navigate("/dashboard/admin", { replace: true });
      } else if (currentUser.role === "VENDEUSE") {
        if (currentUser.statut === "APPROUVEE") {
          navigate("/dashboard/vendeuse", { replace: true });
        } else {
          navigate("/vendeuse-en-attente", { replace: true });
        }
      } else {
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error("Erreur de connexion :", error);

      const message =
        error?.response?.data?.message || "Email ou mot de passe incorrect.";

      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(41,67,143,0.12)] md:grid md:grid-cols-2">
        {/*PARTIE GAUCHE*/}
        <div className="hidden lg:flex bg-green-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-900 to-green-800" />

          <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
            {/* Logo */}
            <div>
              <Link to="/" className="inline-flex items-center">
                <img
                    src="/images/logo.png"
                    alt="TerangaMarket"
                    className="w-full h-70 object-cover"
                  />
              </Link>
            </div>

            {/* Présentation */}
            <div className="max-w-lg">
              <p className="text-yellow-400 uppercase tracking-[0.2em] text-sm font-semibold">
                Bienvenue sur TerangaMarket
              </p>

              <h1 className="text-4xl xl:text-5xl font-bold leading-tight mt-4">
                Votre marché local,
                <span className="text-yellow-400"> directement en ligne.</span>
              </h1>

              <p className="text-green-100 text-lg leading-relaxed mt-6">
                Découvrez les produits proposés par des femmes entrepreneures
                sénégalaises et soutenez leur savoir-faire local.
              </p>

              {/* Avantages */}
              <div className="space-y-5 mt-10">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <ShoppingBag size={22} className="text-yellow-400" />
                  </div>

                  <div>
                    <p className="font-semibold">Achetez des produits locaux</p>

                    <p className="text-sm text-green-200">
                      Retrouvez vos produits préférés au même endroit.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <Users size={22} className="text-yellow-400" />
                  </div>

                  <div>
                    <p className="font-semibold">Soutenez nos entrepreneures</p>

                    <p className="text-sm text-green-200">
                      Donnez plus de visibilité au travail des femmes.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <MapPin size={22} className="text-yellow-400" />
                  </div>

                  <div>
                    <p className="font-semibold">Le savoir-faire sénégalais</p>

                    <p className="text-sm text-green-200">
                      Mil, maïs, noix de cajou et autres produits locaux.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-green-300 text-sm">
              © {new Date().getFullYear()} TerangaMarket — Valorisons ensemble
              le commerce local.
            </p>
          </div>
        </div>

        {/*FORMULAIRE*/}
        <div className="w-full flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/">
                <img
                src="/images/logo.png"
                alt="TerangaMarket"
                className="w-full h-20 object-cover"
              />
              </Link>
            </div>

            {/* En-tête */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Bon retour !</h2>

              <p className="text-gray-500 mt-2">
                Connectez-vous à votre espace TerangaMarket.
              </p>
            </div>

            {/* Message après inscription */}
            {successMessage && (
              <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                {successMessage}
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Adresse email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="vous@exemple.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 py-3.5 text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Mot de passe
                  </label>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-gray-300 bg-white pl-11 pr-12 py-3.5 text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-800 transition"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Connexion */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-900 hover:bg-green-800 text-white font-semibold rounded-xl py-3.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            {/* Inscription */}
            <div className="mt-7 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Vous n'avez pas encore de compte ?
              </p>

              <Link
                to="/register"
                className="inline-flex items-center gap-1 mt-2 text-green-900 font-semibold hover:text-yellow-600 transition"
              >
                Créer un compte
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Retour accueil */}
            <div className="text-center mt-6">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-green-900 transition"
              >
                ← Retour à TerangaMarket
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
