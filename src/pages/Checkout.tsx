import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  ShoppingBag,
  User,
  Loader2,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { useAuth } from "../context/AuthContext";

type PaymentMethod = "wave" | "orange_money" | "cash";

function getImageUrl(image?: string | null): string {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `http://localhost:3000${image}`;
  }

  return image.startsWith("/") ? image : `/images/${image}`;
}

function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.nom || "");
  const [phone, setPhone] = useState(user?.telephone || "");
  const [address, setAddress] = useState(user?.adresse || "");
  const [city, setCity] = useState("Dakar");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-green-800" />

          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Votre panier est vide
          </h1>

          <p className="mb-6 text-gray-600">
            Ajoutez des produits avant de passer une commande.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-green-900 px-6 py-3 font-medium text-white transition hover:bg-green-800"
          >
            Découvrir les produits
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setError("Veuillez remplir tous les champs de livraison.");
      return;
    }

    if (items.some((item) => !item.product.id || item.quantity < 1)) {
      setError("Un produit du panier est invalide.");
      return;
    }

    try {
      setLoading(true);

      // Créer la commande
      const order = await createOrder({
        nom: fullName.trim(),
        telephone: phone.trim(),
        adresse: `${address.trim()}, ${city.trim()}`,
        items: items.map((item) => ({
          productId: Number(item.product.id),
          quantity: Number(item.quantity),
        })),
      });

      clearCart();

      navigate("/order-confirmation", {
        state: { orderId: order.id },
      });
    } catch (err: unknown) {
      console.error("Erreur création commande :", err);

      const apiError = err as {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
      };

      const message = apiError.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message ||
              "Une erreur est survenue lors de la création de la commande.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-green-900 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au panier
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Finaliser la commande
          </h1>

          <p className="mt-2 text-gray-600">
            Vérifiez vos informations avant de confirmer votre commande.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          {/* Informations de livraison */}
          <div className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <MapPin className="h-5 w-5 text-green-900" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Informations de livraison
                  </h2>

                  <p className="text-sm text-gray-500">
                    Où souhaitez-vous recevoir votre commande ?
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Nom complet
                  </label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex : Aminata Diop"
                      required
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Téléphone
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex : 77 000 00 00"
                      required
                      className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Ville
                  </label>

                  <input
                    id="city"
                    type="text"
                    autoComplete="address-level2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex : Dakar"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Adresse de livraison
                  </label>

                  <textarea
                    id="address"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Quartier, rue, point de repère..."
                    rows={3}
                    required
                    className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>
            </section>

            {/* Mode de paiement */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-full bg-yellow-100 p-2">
                  <CreditCard className="h-5 w-5 text-yellow-700" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Mode de paiement
                  </h2>

                  <p className="text-sm text-gray-500">
                    Choisissez votre mode de paiement.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === "wave"
                      ? "border-green-700 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="wave"
                    disabled
                    checked={paymentMethod === "wave"}
                    onChange={() => setPaymentMethod("wave")}
                    className="h-4 w-4 accent-green-800 cursor-not-allowed opacity-50"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Wave</p>
                    <p className="text-sm text-gray-500">Paiement mobile</p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === "orange_money"
                      ? "border-green-700 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="orange_money"
                    disabled
                    checked={paymentMethod === "orange_money"}
                    onChange={() => setPaymentMethod("orange_money")}
                    className="h-4 w-4 accent-green-800 cursor-not-allowed opacity-50"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Orange Money</p>
                    <p className="text-sm text-gray-500">Paiement mobile</p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === "cash"
                      ? "border-green-700 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="h-4 w-4 accent-green-800"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Paiement à la livraison
                    </p>
                    <p className="text-sm text-gray-500">
                      Payez lors de la réception.
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Résumé de la commande */}
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="mb-6 text-lg font-bold text-gray-900">
              Résumé de la commande
            </h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img
                    src={getImageUrl(item.product.image)}
                    alt={item.product.nom}
                    className="h-16 w-16 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {item.product.nom}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantité : {item.quantity}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-green-900">
                      {(
                        Number(item.product.prix) * item.quantity
                      ).toLocaleString("fr-FR")}{" "}
                      FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-gray-100" />

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Sous-total</span>
              <span>{Number(totalPrice).toLocaleString("fr-FR")} FCFA</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
              <span>Livraison</span>
              <span>À définir</span>
            </div>

            <div className="my-5 border-t border-gray-100" />

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>

              <span className="text-xl font-bold text-green-900">
                {Number(totalPrice).toLocaleString("fr-FR")} FCFA
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-900 px-5 py-3.5 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 cursor-pointer" />
                  Confirmer la commande
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              En confirmant votre commande, vous acceptez les informations de
              livraison renseignées.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default Checkout;
