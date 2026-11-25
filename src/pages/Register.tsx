import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";

import api from "../services/api";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: "",
    telephone: "",
    adresse: "",
    role: "CLIENT",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (!form.nom || !form.email || !form.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (form.password.length < 6) {
      setError("Votre mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        nom: form.nom,
        email: form.email,
        password: form.password,
        telephone: form.telephone || undefined,
        adresse: form.adresse || undefined,
        typeCompte: form.role,
      });

      navigate("/login", {
        state: {
          message:
            form.role === "VENDEUSE"
              ? "Votre demande vendeuse a été envoyée. Elle sera examinée par notre équipe."
              : "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setError(
          Array.isArray(message)
            ? message.join(", ")
            : message || "Impossible de créer le compte.",
        );
        console.error("Erreur inscription :", error.response?.data);
      } else {
        setError("Une erreur inattendue est survenue.");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(41,67,143,0.12)] md:grid md:grid-cols-2">
        {/* Partie gauche */}
        <div className="hidden lg:flex bg-green-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-green-900 to-green-800" />

          <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
            <div>
              <Link to="/" className="inline-flex items-center">
                <img
                src="/images/logo.png"
                alt="TerangaMarket"
                className=" w-full h-70 object-cover"
              />
              </Link>
            </div>

            <div className="max-w-lg">
              <p className="text-yellow-400 uppercase tracking-[0.2em] text-sm font-semibold">
                Bienvenue sur TerangaMarket
              </p>

              <h1 className="text-4xl xl:text-5xl font-bold leading-tight mt-4">
                Le savoir-faire local
                <span className="text-yellow-400"> à portée de clic.</span>
              </h1>

              <p className="text-green-100 text-lg leading-relaxed mt-6">
                Découvrez les produits de nos entrepreneures sénégalaises et
                participez à la valorisation du commerce local.
              </p>

              <div className="space-y-4 mt-10">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <Users size={22} className="text-yellow-400" />
                  </div>

                  <div>
                    <p className="font-semibold">Des femmes entrepreneures</p>
                    <p className="text-sm text-green-200">
                      Soutenez leur savoir-faire et leurs activités.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <MapPin size={22} className="text-yellow-400" />
                  </div>

                  <div>
                    <p className="font-semibold">Des produits locaux</p>
                    <p className="text-sm text-green-200">
                      Mil, maïs, noix de cajou et bien d'autres produits.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <ShieldCheck size={22} className="text-yellow-400" />
                  </div>

                  <div>
                    <p className="font-semibold">Une plateforme de confiance</p>
                    <p className="text-sm text-green-200">
                      Des vendeuses vérifiées par notre équipe.
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

        {/* Formulaire */}
        <div className="w-full flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-xl">
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

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Créer votre compte
              </h2>

              <p className="text-gray-500 mt-2">
                Rejoignez la communauté TerangaMarket.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nom */}
              <div>
                <label
                  htmlFor="nom"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nom complet *
                </label>

                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Ex. Aminata Diop"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Adresse email *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="vous@exemple.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Téléphone + adresse */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="telephone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Téléphone
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={form.telephone}
                      onChange={handleChange}
                      placeholder="77 123 45 67"
                      className="w-full rounded-xl border border-gray-300 pl-11 pr-4 py-3.5 text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="adresse"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Adresse
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="adresse"
                      name="adresse"
                      type="text"
                      value={form.adresse}
                      onChange={handleChange}
                      placeholder="Ville / quartier"
                      className="w-full rounded-xl border border-gray-300 pl-11 pr-4 py-3.5 text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Mot de passe *
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Au moins 6 caractères"
                    className="w-full rounded-xl border border-gray-300 px-4 pr-12 py-3.5 text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-100"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-800"
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

              {/* Type de compte */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Je souhaite
                </label>

                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-100"
                >
                  <option value="CLIENT">Acheter des produits</option>

                  <option value="VENDEUSE">Vendre mes produits</option>
                </select>
              </div>

              {form.role === "VENDEUSE" && (
                <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">
                  <p className="text-sm font-semibold text-yellow-900">
                    Devenir vendeuse sur TerangaMarket
                  </p>

                  <p className="text-sm text-yellow-800 mt-1 leading-relaxed">
                    Votre demande sera examinée par un administrateur. Vous
                    pourrez publier vos produits une fois votre compte approuvé.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-900 hover:bg-green-800 text-white font-semibold rounded-xl py-3.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Vous avez déjà un compte ?
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-green-900 font-semibold mt-1 hover:text-yellow-600 transition"
              >
                Se connecter
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
