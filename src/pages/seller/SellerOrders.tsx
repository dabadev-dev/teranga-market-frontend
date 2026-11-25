import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Loader2, Package } from "lucide-react";

import {
  getSellerOrders,
  updateOrderStatus,
  type SellerOrder,
  type OrderStatus,
} from "../../services/orderService";

const SellerOrders = () => {
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getImageUrl = (image?: string | null) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return `http://localhost:3000${image}`;
    }

    return image.startsWith("/") ? image : `/images/${image}`;
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        const data = await getSellerOrders();

        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer les commandes.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "EN_ATTENTE":
        return "En attente";
      case "CONFIRMEE":
        return "Confirmée";
      case "EXPEDIEE":
        return "Expédiée";
      case "LIVREE":
        return "Livrée";
      case "ANNULEE":
        return "Annulée";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "EN_ATTENTE":
        return "bg-yellow-100 text-yellow-800";

      case "CONFIRMEE":
        return "bg-blue-100 text-blue-800";

      case "EXPEDIEE":
        return "bg-purple-100 text-purple-800";

      case "LIVREE":
        return "bg-green-100 text-green-800";

      case "ANNULEE":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (orderId: number, statut: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const response = await updateOrderStatus(orderId, statut);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                statut: response.sellerOrder.statut,
              }
            : order,
        ),
      );
    } catch (err: any) {
      console.error("Erreur modification statut :", err);

      setError(
        err?.response?.data?.message ||
          "Impossible de modifier le statut de la commande.",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getNextAction = (status: OrderStatus) => {
    switch (status) {
      case "EN_ATTENTE":
        return [
          { label: "Confirmer", statut: "CONFIRMEE" as OrderStatus },
          { label: "Annuler", statut: "ANNULEE" as OrderStatus },
        ];

      case "CONFIRMEE":
        return [
          {
            label: "Marquer comme expédiée",
            statut: "EXPEDIEE" as OrderStatus,
          },
        ];

      case "EXPEDIEE":
        return [
          { label: "Marquer comme livrée", statut: "LIVREE" as OrderStatus },
        ];

      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F0]">
        <Loader2 size={40} className="animate-spin text-green-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-green-700">Ma boutique</p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Mes commandes
          </h1>

          <p className="mt-2 text-gray-600">
            Consultez les commandes contenant vos produits.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <ShoppingBag size={45} className="mx-auto text-gray-400" />

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Aucune commande
            </h2>

            <p className="mt-2 text-gray-600">
              Vous n'avez pas encore reçu de commande.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <p className="font-bold text-gray-900">
                      Commande #{order.id}
                    </p>

                    {order.createdAt && (
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        order.statut,
                      )}`}
                    >
                      {getStatusLabel(order.statut)}
                    </span>

                    <span className="font-bold text-green-900">
                      {Number(order.total).toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                </div>

                {/* Produits */}
                <div className="mt-5 border-t pt-5">
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                          {item.product?.image ? (
                            <img
                              src={getImageUrl(item.product.image)}
                              alt={item.product.nom}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={20} className="text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.product?.nom || `Produit #${item.productId}`}
                          </p>

                          <p className="text-sm text-gray-500">
                            Quantité : {item.quantity}
                          </p>
                        </div>

                        <p className="font-medium text-gray-900">
                          {Number(item.prix).toLocaleString("fr-FR")} FCFA
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t pt-4">
                  <Link
                    to={`/orders/${order.orderId}`}
                    className="text-sm font-semibold text-green-800 hover:text-green-950"
                  >
                    Voir les détails →
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {getNextAction(order.statut).map((action) => (
                    <button
                      key={action.statut}
                      type="button"
                      disabled={updatingOrderId === order.id}
                      onClick={() =>
                        handleStatusChange(order.id, action.statut)
                      }
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        action.statut === "ANNULEE"
                          ? "border border-red-200 text-red-700 hover:bg-red-50"
                          : "bg-green-800 text-white hover:bg-green-900"
                      }`}
                    >
                      {updatingOrderId === order.id ? (
                        <Loader2 size={16} className="inline animate-spin" />
                      ) : (
                        action.label
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SellerOrders;
