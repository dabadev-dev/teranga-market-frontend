
import { Link } from "react-router-dom";
import { Clock, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function SellerPending() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F0] px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
          <Clock size={32} className="text-yellow-700" />
        </div>

        <h1 className="mb-3 text-2xl font-bold text-green-900">
          Demande en cours de validation
        </h1>

        <p className="mb-6 leading-relaxed text-gray-600">
          Votre inscription en tant que vendeuse a bien été prise en compte.
          Vous pourrez accéder à votre espace vendeuse dès que
          l'administrateur aura validé votre compte.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-lg bg-green-900 px-5 py-3 font-medium text-white transition hover:bg-green-800"
          >
            Retour à l'accueil
          </Link>

          <Link
            to="/login"
            >
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
