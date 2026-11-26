import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
  Truck,
  CheckCircle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getProduct, type Product } from "../services/productService";

import { useCart } from "../context/CartContext";

const formatPrice = (price: number | string) =>
  `${Number(price).toLocaleString("fr-FR")} FCFA`;

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product!, quantity);

    setSuccessMessage(`${product!.nom} ajouté au panier !`);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  useEffect(() => {
    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      setError("Identifiant du produit invalide.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProduct(Number(id));

        if (!cancelled) {
          setProduct(data);
          setQuantity(1);
        }
      } catch {
        if (!cancelled) {
          setError("Impossible de charger ce produit.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const getImageUrl = (image?: string | null) => {
    if (!image) return "/images/placeholder.png";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return `https://teranga-market-backend-64wi.onrender.com${image}`;
    }

    return image.startsWith("/") ? image : `/images/${image}`;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F0]">
        <p className="font-medium text-green-900">Chargement du produit...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] px-4 py-20">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-green-950">
            Produit introuvable
          </h1>

          <p className="mt-3 text-gray-500">
            {error ||
              "Le produit recherché n'existe pas ou n'est plus disponible."}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-800 px-5 py-3 font-semibold text-white hover:bg-green-900"
          >
            <ArrowLeft size={18} />
            Retour au catalogue
          </Link>
        </div>
      </main>
    );
  }

  const stock = Number(product.stock) || 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      {/* FIL D'ARIANE */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-800"
          >
            <ArrowLeft size={17} />
            Retour aux produits
          </Link>
        </div>
      </div>

      {/* DÉTAIL */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* IMAGE */}
          <div className="overflow-hidden rounded-3xl bg-[#F6F0E2]">
            <img
              src={getImageUrl(product.image)}
              alt={product.nom}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/images/placeholder.png";
              }}
              className="h-full max-h-[600px] min-h-[400px] w-full object-cover"
            />
          </div>

          {/* INFORMATIONS */}
          <div className="flex flex-col justify-center">
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-yellow-600">
              {product.category?.nom ?? "Produit local"}
            </span>

            <h1 className="mt-3 text-3xl font-bold text-green-950 sm:text-4xl">
              {product.nom}
            </h1>

            <p className="mt-6 text-3xl font-bold text-green-800">
              {formatPrice(product.prix)}
            </p>

            <div className="my-7 h-px bg-gray-200" />

            <p className="leading-8 text-gray-600">
              {product.description ||
                "Découvrez ce produit local proposé sur TerangaMarket."}
            </p>

            {/* STOCK */}
            <div
              className={`mt-6 rounded-xl p-4 ${
                stock > 0 ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  stock > 0 ? "text-green-800" : "text-red-700"
                }`}
              >
                {stock > 0
                  ? `${stock} unité(s) disponible(s)`
                  : "Rupture de stock"}
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Produit proposé par une entrepreneure de TerangaMarket.
              </p>
            </div>

            {/* QUANTITÉ */}
            <div className="mt-7">
              <p className="mb-3 text-sm font-semibold text-gray-700">
                Quantité
              </p>

              <div className="flex w-fit items-center rounded-xl border border-gray-200 bg-white">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                  className="flex h-11 w-11 items-center justify-center text-gray-600 hover:text-green-800 disabled:opacity-40"
                  aria-label="Diminuer la quantité"
                >
                  <Minus size={17} />
                </button>

                <span className="w-12 text-center font-semibold text-green-950">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={quantity >= stock}
                  onClick={() =>
                    setQuantity((current) => Math.min(stock, current + 1))
                  }
                  className="flex h-11 w-11 items-center justify-center text-gray-600 hover:text-green-800 disabled:opacity-40"
                  aria-label="Augmenter la quantité"
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>

            {/* ACTION */}

            {successMessage && (
              <div className="fixed right-5 top-24 z-50 flex items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-lg animate-in slide-in-from-right">
                <CheckCircle className="text-green-600" size={24} />

                <div className="flex-1">
                  <p className="font-bold text-green-900">Produit ajouté !</p>
                  <p className="text-sm text-gray-600">{successMessage}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSuccessMessage("")}
                  className="text-gray-400 hover:text-gray-700"
                  aria-label="Fermer le message"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <button
              type="button"
              disabled={stock <= 0}
              onClick={handleAddToCart}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-green-800 px-6 py-4 font-bold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={20} />
              {stock > 0 ? "Ajouter au panier" : "Produit indisponible"}
            </button>
            <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
              Total indicatif :{" "}
              <strong>
                {(Number(product.prix) * quantity).toLocaleString("fr-FR")} FCFA
              </strong>
            </div>

            {/* GARANTIES */}
            <div className="mt-8 grid gap-4 border-t border-gray-200 pt-7 sm:grid-cols-2">
              <div className="flex gap-3">
                <ShieldCheck size={21} className="shrink-0 text-green-800" />

                <div>
                  <p className="text-sm font-semibold text-green-950">
                    Achat sécurisé
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Vos données sont protégées.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Truck size={21} className="shrink-0 text-yellow-600" />

                <div>
                  <p className="text-sm font-semibold text-green-950">
                    Commande en ligne
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Gérez facilement vos commandes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
