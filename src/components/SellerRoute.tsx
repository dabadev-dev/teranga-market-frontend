
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SellerRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F0]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-900 border-t-transparent" />
      </div>
    );
  }

  // L'utilisateur doit être connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Le compte doit avoir le rôle VENDEUSE
  if (user.role !== "VENDEUSE") {
    return <Navigate to="/" replace />;
  }

  // L'administrateur doit avoir approuvé le compte
  if (user.statut !== "APPROUVEE") {
    return <Navigate to="/vendeuse-en-attente" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;
