
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useCart } from "../context/CartContext";

const formatPrice = (price: number) =>
  `${Number(price).toLocaleString("fr-FR")} FCFA`;


const getImageUrl = (image?: string | null) => {
  if (!image) return "/images/placeholder.png";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `https://teranga-market-backend-64wi.onrender.com${image}`;
  }

  return image.startsWith("/") ? image : `/images/${image}`;
};


export default function Cart() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF7F0]">
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-800">
            <ShoppingBag size={34} />
          </div>

          <h1 className="mt-7 text-3xl font-bold text-green-950 sm:text-4xl">
            Votre panier est vide
          </h1>

          <p className="mx-auto mt-4 max-w-lg leading-7 text-gray-500">
            Découvrez nos produits locaux et ajoutez vos articles préférés
            à votre panier.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-800 px-6 py-3.5 font-semibold text-white transition hover:bg-green-900"
          >
            Découvrir les produits
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F0]">
      {/* TITRE */}
      <section className="bg-green-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="font-semibold uppercase tracking-[0.2em] text-yellow-400">
            Mon panier
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            Vos produits sélectionnés
          </h1>

          <p className="mt-3 text-green-100/70">
            {totalItems} article{totalItems > 1 ? "s" : ""} dans votre panier
          </p>
        </div>
      </section>

      {/* PANIER */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* PRODUITS */}
          <div className="space-y-4">
            {items.map((item) => {
              const product = item.product;

              return (
                <article
                  key={product.id}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* IMAGE */}
                    <Link
                      to={`/products/${product.id}`}
                      className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#F6F0E2] sm:h-36 sm:w-36"
                    >
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.nom}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "/images/placeholder.png";
                        }}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    {/* INFORMATIONS */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-yellow-600">
                            {product.category?.nom ?? "Produit local"}
                          </span>

                          <Link to={`/products/${product.id}`}>
                            <h2 className="mt-1 text-lg font-bold text-green-950 hover:text-green-700">
                              {product.nom}
                            </h2>
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="shrink-0 text-gray-400 transition hover:text-red-600"
                          aria-label={`Supprimer ${product.nom}`}
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>

                      <p className="mt-2 hidden text-sm text-gray-500 sm:block">
                        {product.description}
                      </p>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                        {/* QUANTITÉ */}
                        <div className="flex items-center rounded-lg border border-gray-200">
                          <button
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              updateQuantity(
                                product.id,
                                item.quantity - 1
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center text-gray-600 hover:text-green-800 disabled:opacity-40"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="w-9 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                product.id,
                                item.quantity + 1
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center text-gray-600 hover:text-green-800"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        {/* PRIX */}
                        <p className="font-bold text-green-900">
                          {formatPrice(
                            Number(product.prix) * item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* VIDER */}
            <button
              type="button"
              onClick={clearCart}
              className="text-sm font-medium text-gray-500 transition hover:text-red-600"
            >
              Vider le panier
            </button>
          </div>

          {/* RÉSUMÉ */}
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-green-950">
              Résumé de la commande
            </h2>

            <div className="mt-6 space-y-4 border-b border-gray-100 pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>

                <span className="font-medium text-gray-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Livraison</span>

                <span className="font-medium text-gray-900">
                  À définir
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="font-semibold text-gray-700">Total</span>

              <span className="text-2xl font-bold text-green-900">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-6 py-4 font-bold text-white transition hover:bg-green-900"
            >
              Passer la commande
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/products"
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-green-800 px-6 py-3.5 text-sm font-semibold text-green-800 transition hover:bg-green-50"
            >
              Continuer mes achats
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
