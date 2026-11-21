
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Package,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";

import { getOrders, type Order } from "../services/orderService";
import { useAuth } from "../context/AuthContext";

const statusLabels: Record<string, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  EXPEDIEE: "Expédiée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

const statusColors: Record<string, string> = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMEE: "bg-blue-100 text-blue-800",
  EXPEDIEE: "bg-purple-100 text-purple-800",
  LIVREE: "bg-green-100 text-green-800",
  ANNULEE: "bg-red-100 text-red-800",
};

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrders();

        // Les commandes les plus récentes en premier
        setOrders(
          [...data].sort(
            (a, b) =>
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime()
          )
        );
      } catch (err) {
        console.error("Erreur lors du chargement des commandes :", err);
        setError("Impossible de récupérer vos commandes. Réessayez.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] px-4 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-900 border-t-transparent" />
          <p className="mt-4 text-gray-600">
            Chargement de vos commandes...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-4 py-10 md:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-green-900 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Continuer mes achats
        </Link>

        <header className="mb-8">
          <p className="text-sm font-medium text-yellow-600">
            TerangaMarket
          </p>
          <h1 className="mt-1 text-3xl font-bold text-green-900 md:text-4xl">
            Mes commandes
          </h1>
          <p className="mt-2 text-gray-600">
            Retrouvez vos commandes et suivez leur évolution.
          </p>
        </header>

        {error ? (
          <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <Package className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-4 text-gray-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-green-900 px-5 py-3 font-semibold text-white hover:bg-green-800"
            >
              Réessayer
            </button>
          </section>
        ) : orders.length === 0 ? (
          <section className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <ShoppingBag className="h-8 w-8 text-green-900" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-green-900">
              Aucune commande pour le moment
            </h2>
            <p className="mt-2 text-gray-600">
              Vos commandes apparaîtront ici après votre premier achat.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-900 px-6 py-3 font-semibold text-white hover:bg-green-800"
            >
              Découvrir les produits
              <ArrowRight className="h-5 w-5" />
            </Link>
          </section>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-600">
              {orders.length} commande{orders.length > 1 ? "s" : ""}
            </p>

            <div className="space-y-4">
              {orders.map((order) => {
                const status = order.statut;

                return (
                  <article
                    key={order.id}
                    className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Numéro de commande
                        </p>
                        <h2 className="mt-1 text-lg font-bold text-green-900">
                          #{order.id}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            : "Date non disponible"}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:items-end">
                        <span
                          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${
                            statusColors[status] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {status === "EN_ATTENTE" ? (
                            <Clock className="h-4 w-4" />
                          ) : status === "CONFIRMEE" ||
                            status === "LIVREE" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Package className="h-4 w-4" />
                          )}
                          {statusLabels[status] ?? status}
                        </span>

                        <p className="text-xl font-bold text-green-900">
                          {Number(order.total).toLocaleString("fr-FR")} FCFA
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-500">
                        {order.items?.length ?? 0} article
                        {(order.items?.length ?? 0) > 1 ? "s" : ""}
                      </p>

                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                      >
                        Voir les détails
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
