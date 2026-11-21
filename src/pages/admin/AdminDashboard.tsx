
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  Package,
  ShoppingBag,
  Clock,
  Tag,
  ArrowRight,
} from "lucide-react";

import { getUsers, type User } from "../../services/userService";

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des utilisateurs :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const totalUsers = users.length;

  const totalSellers = users.filter(
    (user) => user.role === "VENDEUSE"
  ).length;

  const pendingSellers = users.filter(
    (user) =>
      user.role === "VENDEUSE" &&
      user.statut === "EN_ATTENTE"
  ).length;

  const approvedSellers = users.filter(
    (user) =>
      user.role === "VENDEUSE" &&
      user.statut === "APPROUVEE"
  ).length;

  return (
    <div className="mx-auto max-w-7xl">
      {/* En-tête */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-800">
          Administration
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
          Tableau de bord administrateur
        </h1>

        <p className="mt-2 text-gray-600">
          Gérez les utilisateurs, les vendeuses, les produits et les commandes.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <p className="text-gray-500">
            Chargement du tableau de bord...
          </p>
        </div>
      ) : (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <Users className="mb-4 text-green-800" size={28} />

              <p className="text-sm text-gray-500">
                Utilisateurs
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                {totalUsers}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <UserCheck className="mb-4 text-green-800" size={28} />

              <p className="text-sm text-gray-500">
                Vendeuses
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                {totalSellers}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <Clock className="mb-4 text-yellow-600" size={28} />

              <p className="text-sm text-gray-500">
                Demandes en attente
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                {pendingSellers}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <UserCheck className="mb-4 text-green-600" size={28} />

              <p className="text-sm text-gray-500">
                Vendeuses approuvées
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                {approvedSellers}
              </p>
            </div>
          </div>

          {/* Gestion */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">
              Gestion de la plateforme
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Accédez rapidement aux différentes fonctionnalités.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {/* Vendeuses */}
              <Link
                to="/dashboard/admin/vendeuses"
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <UserCheck className="text-green-800" size={30} />
                  <ArrowRight className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-800" size={20} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  Gestion des vendeuses
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Valider ou refuser les demandes des vendeuses.
                </p>

                {pendingSellers > 0 && (
                  <span className="mt-4 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    {pendingSellers} demande
                    {pendingSellers > 1 ? "s" : ""} en attente
                  </span>
                )}
              </Link>

              {/* Produits */}
              <Link
                to="/dashboard/admin/produits"
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <Package className="text-green-800" size={30} />
                  <ArrowRight className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-800" size={20} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  Gestion des produits
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Superviser les produits publiés sur la plateforme.
                </p>
              </Link>

              {/* Commandes */}
              <Link
                to="/dashboard/admin/commandes"
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <ShoppingBag className="text-green-800" size={30} />
                  <ArrowRight className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-800" size={20} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  Gestion des commandes
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Consulter et suivre les commandes des clients.
                </p>
              </Link>

              {/* Catégories */}
              <Link
                to="/dashboard/admin/categories"
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <Tag className="text-green-800" size={30} />
                  <ArrowRight className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-800" size={20} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  Gestion des catégories
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Créer et gérer les catégories de produits.
                </p>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
