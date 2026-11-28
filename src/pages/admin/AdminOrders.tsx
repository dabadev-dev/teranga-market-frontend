import { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  Loader2,
} from "lucide-react";

import {
  getOrders,
  type Order,
  type OrderStatus,
} from "../../services/orderService";

const statusLabels: Record<OrderStatus, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  EXPEDIEE: "Expédiée",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
  PARTIELLEMENT_LIVREE: "Partiellement livrée",
};

const statusClasses: Record<OrderStatus, string> = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMEE: "bg-blue-100 text-blue-800",
  EXPEDIEE: "bg-purple-100 text-purple-800",
  LIVREE: "bg-green-100 text-green-800",
  ANNULEE: "bg-red-100 text-red-800",
  PARTIELLEMENT_LIVREE: "bg-yellow-100 text-yellow-800",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();
      setOrders(data);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Impossible de récupérer les commandes.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

const getImageUrl = (image?: string | null) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
return `${import.meta.env.VITE_API_URL}${image}`;
    }

    return image.startsWith("/") ? image : `/images/${image}`;
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "EN_ATTENTE":
        return <Clock size={15} />;

      case "CONFIRMEE":
        return <CheckCircle size={15} />;

      case "EXPEDIEE":
        return <Truck size={15} />;

      case "LIVREE":
        return <CheckCircle size={15} />;

      case "ANNULEE":
        return <XCircle size={15} />;

        case "PARTIELLEMENT_LIVREE":
  return <Package size={15} />;

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-green-950">
            Gestion des commandes
          </h1>

          <p className="mt-2 text-gray-600">
            Consultez et gérez les commandes passées sur TerangaMarket.
          </p>
        </div>

        {/* ERREUR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* CONTENU */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          {/* LOADING */}
          {loading ? (
            <div className="flex justify-center items-center h-screen">
        <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-purple-500"></div>
        <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-red-500 ml-3"></div>
        <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-blue-500 ml-3"></div>
      </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Package size={24} className="text-gray-400" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                Aucune commande
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Aucune commande n'a encore été passée.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-100 bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Commande
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Produits
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Total
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Statut
                      </th>

                      
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-gray-50"
                      >
                        {/* COMMANDE */}
                        <td className="px-6 py-5">
                          <p className="font-semibold text-gray-900">
                            #{order.id}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Commande TerangaMarket
                          </p>
                        </td>

                        {/* PRODUITS */}
                        <td className="px-6 py-5">
                          <div className="space-y-2">
                            {order.items?.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3"
                              >
                                {item.product?.image ? (
                                  <img
                                    src={getImageUrl(item.product.image)}
                                    alt={item.product.nom}
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                    <Package
                                      size={16}
                                      className="text-gray-400"
                                    />
                                  </div>
                                )}

                                <div>
                                  <p className="text-sm font-medium text-gray-800">
                                    {item.product?.nom ||
                                      `Produit #${item.productId}`}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    Quantité : {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* TOTAL */}
                        <td className="px-6 py-5">
                          <span className="font-bold text-green-900">
                            {Number(order.total).toLocaleString("fr-FR")} FCFA
                          </span>
                        </td>

                        {/* STATUT */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses[order.statut]}`}
                          >
                            {getStatusIcon(order.statut)}
                            {statusLabels[order.statut]}
                          </span>
                        </td>                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="divide-y divide-gray-100 md:hidden">
                {orders.map((order) => (
                  <div key={order.id} className="p-5">

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-gray-900">
                          Commande #{order.id}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {order.items?.length || 0} produit(s)
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[order.statut]}`}
                      >
                        {getStatusIcon(order.statut)}
                        {statusLabels[order.statut]}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3"
                        >
                          {item.product?.image ? (
                            <img
                              src={getImageUrl(item.product.image)}
                              alt={item.product.nom}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                              <Package
                                size={18}
                                className="text-gray-400"
                              />
                            </div>
                          )}

                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {item.product?.nom ||
                                `Produit #${item.productId}`}
                            </p>

                            <p className="text-xs text-gray-500">
                              Quantité : {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          Total
                        </p>

                        <p className="font-bold text-green-900">
                          {Number(order.total).toLocaleString("fr-FR")} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}