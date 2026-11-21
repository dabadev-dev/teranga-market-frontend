
import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Package,
  ShoppingBag,
  Phone,
  Loader2,
} from "lucide-react";

import {
  getOrder,
  getGuestOrder,
  type Order,
} from "../services/orderService";

import { useAuth } from "../context/AuthContext";

export default function OrderDetail() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [lookupLoading, setLookupLoading] = useState(false);

  const [telephone, setTelephone] = useState("");
  const [error, setError] = useState("");

  // Construire l'URL de l'image
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

  // Charger automatiquement la commande si l'utilisateur est connecté
  useEffect(() => {
    if (authLoading) return;

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      setError("Numéro de commande invalide.");
      setLoading(false);
      return;
    }

    if (!user) {
      // Le client invité doit vérifier son numéro de téléphone
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrder(Number(id));
        setOrder(data);
      } catch (err: any) {
        console.error("Erreur récupération commande :", err);

        setError(
          err?.response?.data?.message ||
            "Impossible de récupérer cette commande.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, user, authLoading]);

  // Vérification du téléphone pour un client invité
  const handleGuestLookup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!telephone.trim()) {
      setError("Veuillez saisir votre numéro de téléphone.");
      return;
    }

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      setError("Numéro de commande invalide.");
      return;
    }

    try {
      setLookupLoading(true);
      setError("");

      const data = await getGuestOrder(Number(id), telephone.trim());

      setOrder(data);
    } catch (err: any) {
      console.error("Erreur consultation commande invité :", err);

      setError(
        err?.response?.data?.message ||
          "Impossible de retrouver cette commande. Vérifiez votre numéro de téléphone.",
      );
    } finally {
      setLookupLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-green-900" />
          <p className="mt-4 text-gray-600">
            Chargement de votre commande...
          </p>
        </div>
      </main>
    );
  }

  // Formulaire de vérification pour les clients non connectés
  if (!user && !order) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Phone className="h-8 w-8 text-green-800" />
          </div>

          <h1 className="mt-5 text-center text-2xl font-bold text-green-900">
            Consulter ma commande
          </h1>

          <p className="mt-3 text-center text-gray-600">
            Pour consulter votre commande #{id}, saisissez le numéro de
            téléphone utilisé lors de votre achat.
          </p>

          <form onSubmit={handleGuestLookup} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="telephone"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Numéro de téléphone
              </label>

              <input
                id="telephone"
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Ex. : 771234567"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={lookupLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-900 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {lookupLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Vérifier et consulter ma commande"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/products"
              className="text-sm font-medium text-green-800 hover:underline"
            >
              Retour aux produits
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Erreur lors du chargement d'une commande d'un utilisateur connecté
  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Package className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Commande introuvable
          </h1>

          <p className="mt-3 text-gray-600">
            {error || "Cette commande n'existe pas."}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-900 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            <ShoppingBag className="h-5 w-5" />
            Retour aux produits
          </Link>
        </div>
      </main>
    );
  }

  const isSeller = user?.role === "VENDEUSE";
  const sellerSubOrder = order.sellerOrders?.[0];

  // Une vendeuse voit uniquement les produits et le total de sa sous-commande
  const displayedItems = isSeller
    ? sellerSubOrder?.items ?? []
    : order.items ?? [];

  const displayedStatus = isSeller
    ? sellerSubOrder?.statut ?? order.statut
    : order.statut;

  const displayedTotal = isSeller
    ? Number(sellerSubOrder?.total ?? order.total)
    : Number(order.total);

  const statusLabels: Record<string, string> = {
    EN_ATTENTE: "En attente",
    CONFIRMEE: "Confirmée",
    EXPEDIEE: "Expédiée",
    PARTIELLEMENT_LIVREE: "Partiellement livrée",
    LIVREE: "Livrée",
    ANNULEE: "Annulée",
  };

  const statusColors: Record<string, string> = {
    EN_ATTENTE: "bg-yellow-100 text-yellow-800",
    CONFIRMEE: "bg-blue-100 text-blue-800",
    EXPEDIEE: "bg-purple-100 text-purple-800",
    PARTIELLEMENT_LIVREE: "bg-orange-100 text-orange-800",
    LIVREE: "bg-green-100 text-green-800",
    ANNULEE: "bg-red-100 text-red-800",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    EN_ATTENTE: <Clock className="h-5 w-5" />,
    CONFIRMEE: <CheckCircle className="h-5 w-5" />,
    EXPEDIEE: <Package className="h-5 w-5" />,
    PARTIELLEMENT_LIVREE: <Package className="h-5 w-5" />,
    LIVREE: <CheckCircle className="h-5 w-5" />,
    ANNULEE: <Package className="h-5 w-5" />,
  };

  const statusLabel = statusLabels[displayedStatus] || displayedStatus;
  const statusColor =
    statusColors[displayedStatus] || "bg-gray-100 text-gray-800";

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-4 py-10 md:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          to={isSeller ? "/dashboard/vendeuse/commandes" : "/products"}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-green-900 transition hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {isSeller ? "Retour à mes commandes" : "Continuer mes achats"}
        </Link>

        <div className="mb-8">
          <p className="text-sm font-medium text-yellow-600">TerangaMarket</p>

          <h1 className="mt-1 text-3xl font-bold text-green-900 md:text-4xl">
            Détail de ma commande
          </h1>

          <p className="mt-2 text-gray-600">Commande #{order.id}</p>
        </div>

        {/* Statut */}
        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Statut de la commande</p>

              <div
                className={`mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${statusColor}`}
              >
                {statusIcons[displayedStatus]}
                {statusLabel}
              </div>
            </div>

            {order.createdAt && (
              <div className="text-sm text-gray-500">
                Commandée le{" "}
                <span className="font-medium text-gray-700">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Produits et résumé */}
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                <ShoppingBag className="h-5 w-5 text-green-900" />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Produits commandés
                </h2>

                <p className="text-sm text-gray-500">
                  {displayedItems.length} article
                  {displayedItems.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {displayedItems.length === 0 ? (
              <p className="py-6 text-center text-gray-500">
                Aucun produit à afficher.
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {displayedItems.map((item) => {
                  const unitPrice = Number(item.prix);
                  const subtotal = unitPrice * item.quantity;

                  return (
                    <div key={item.id} className="flex gap-4 py-5">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {item.product?.image ? (
                          <img
                            src={getImageUrl(item.product.image)}
                            alt={item.product.nom || "Produit commandé"}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.product?.nom || `Produit #${item.productId}`}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantité : {item.quantity}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {unitPrice.toLocaleString("fr-FR")} FCFA / unité
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-bold text-green-900">
                          {subtotal.toLocaleString("fr-FR")} FCFA
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Résumé */}
          <aside className="h-fit rounded-2xl bg-green-900 p-6 text-white shadow-sm">
            <h2 className="text-xl font-bold">Résumé</h2>

            <div className="mt-6 space-y-4 border-b border-white/20 pb-6">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-white/70">Sous-total</span>
                <span>{displayedTotal.toLocaleString("fr-FR")} FCFA</span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-white/70">Livraison</span>
                <span>À confirmer</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="font-semibold">Total</span>

              <span className="text-2xl font-bold text-yellow-400">
                {displayedTotal.toLocaleString("fr-FR")} FCFA
              </span>
            </div>

            <Link
              to="/products"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-green-900 transition hover:bg-yellow-50"
            >
              <ShoppingBag className="h-5 w-5" />
              Continuer mes achats
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
