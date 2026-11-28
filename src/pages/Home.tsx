import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";

import type { Product } from "../services/productService";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

type Category = Awaited<ReturnType<typeof getCategories>>[number];

const categoryIcons: Record<string, string> = {
  Céréales: "🌾",
  "Produits naturels": "🌿",
  "Fruits & transformation": "🥭",
  "Noix & graines": "🥜",
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHomeData() {
      try {
        setLoading(true);
        setError("");

        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        if (!cancelled) {
          setProducts(productsData.slice(0, 6));
          setCategories(
            categoriesData.filter(
              (category, index, array) =>
                array.findIndex((item) => item.nom === category.nom) === index,
            ),
          );
        }
      } catch (err) {
        console.error("Erreur de chargement de l'accueil :", err);

        if (!cancelled) {
          setError("Impossible de charger les données du catalogue.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHomeData();

    return () => {
      cancelled = true;
    };
  }, []);

  const getImageUrl = (image?: string) => {
    if (!image) return "/images/placeholder.png";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return `https://teranga-market-backend-64wi.onrender.com${image}`;
    }

    return image.startsWith("/") ? image : `/images/${image}`;
  };

  const formatPrice = (price: number | string) =>
    `${Number(price).toLocaleString("fr-FR")} FCFA`;

  return (
    <main className="bg-[#FAF7F0]">
      {/* HERO */}

      <section className="relative isolate min-h-[600px] w-full overflow-hidden sm:min-h-[650px] lg:min-h-[720px]">
        {/* Image avec le masque */}
        <div className="absolute inset-0 z-0 bg-[url('/images/hero.png')] bg-cover bg-center mask-r-from-20%" />

        {/* Contenu au-dessus de l'image et du masque */}
        <div className="absolute inset-0 z-10 flex flex-col items-end justify-end px-5 py-16 text-right sm:px-8">
          <div className="max-w-7xl">
            <h1 className="text-4xl font-bold leading-tight text-green-900 sm:text-5xl lg:text-6xl">
              Les produits locaux <br />
              au cœur du numérique.
            </h1>

            <div className="mt-8 flex w-full flex-col justify-end gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 py-3.5 font-semibold text-green-950 transition hover:bg-yellow-400"
              >
                Découvrir le catalogue
                <ArrowRight size={19} />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-800 bg-white/5 px-6 py-3.5 font-semibold text-green-800 transition hover:text-white hover:bg-green-800"
              >
                Ouvrir ma boutique
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATÉGORIES */}
      <section
        id="categories"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-semibold uppercase tracking-widest text-yellow-600">
              Explorer
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-950 sm:text-4xl">
              Découvrez nos catégories
            </h2>

            <p className="mt-3 max-w-2xl text-gray-600">
              Explorez une sélection de produits proposés par des entrepreneures
              locales.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-semibold text-green-800 hover:text-green-950"
          >
            Voir tous les produits
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <p className="mt-10 text-gray-500">Chargement des catégories...</p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/products"
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F7F0DE] text-3xl transition group-hover:scale-105">
                  {categoryIcons[category.nom] ?? "🛍️"}
                </div>

                <h3 className="mt-5 text-lg font-bold text-green-950">
                  {category.nom}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-green-800">
                  Explorer
                  <ArrowRight size={15} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* PRODUITS POPULAIRES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="font-semibold uppercase tracking-widest text-yellow-600">
                Notre sélection
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-950 sm:text-4xl">
                Produits populaires
              </h2>

              <p className="mt-3 text-gray-600">
                Une sélection de produits locaux disponibles sur TerangaMarket.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 font-semibold text-green-800"
            >
              Voir le catalogue
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <p className="mt-10 text-gray-500">Chargement des produits...</p>
          ) : error ? (
            <p className="mt-10 text-red-600">{error}</p>
          ) : products.length === 0 ? (
            <p className="mt-10 text-gray-500">
              Aucun produit disponible pour le moment.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link to={`/products/${product.id}`} className="block">
                    <div className="h-64 overflow-hidden bg-[#F6F0E2]">
                      {product.image ? (
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.nom}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          <ShoppingBag size={40} />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-yellow-600">
                      {product.category?.nom ?? "Produit local"}
                    </span>

                    <h3 className="mt-2 text-xl font-bold text-green-950">
                      {product.nom}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                      {product.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-3">
                      <span className="text-lg font-bold text-green-900">
                        {formatPrice(product.prix)}
                      </span>

                      <Link
                        to={`/products/${product.id}`}
                        className="rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
                      >
                        Voir le produit
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* POURQUOI TERANGAMARKET */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold uppercase tracking-widest text-yellow-500">
              Notre mission
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Pourquoi TerangaMarket ?
            </h2>

            <p className="mt-4 text-gray-600">
              Nous rapprochons les entrepreneures sénégalaises de leurs clients
              grâce au numérique.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-800">
                <Users size={27} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-green-950">
                Valoriser les entrepreneures
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Donner davantage de visibilité aux femmes qui produisent et
                commercialisent des produits locaux.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                <ShoppingBag size={27} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-green-950">
                Simplifier l'achat
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Permettre aux clients de découvrir les produits, gérer leur
                panier et passer leurs commandes facilement.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-800">
                <ShieldCheck size={27} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-green-950">
                Un environnement sécurisé
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Une plateforme organisée autour des comptes, des rôles et d'un
                système de gestion des commandes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEVENIR VENDEUSE */}
      <section id="vendeuse" className="bg-green-300 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-green-900 px-6 py-12 sm:px-10 lg:px-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-green-950">
                  <Store size={23} />
                </div>

                <h2 className="mt-6 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
                  Vous êtes entrepreneure ?
                  <span className="block text-yellow-500">
                    Vendez vos produits sur TerangaMarket.
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl leading-7 text-green-100/70">
                  Créez votre compte vendeuse, présentez vos produits et
                  développez votre visibilité auprès de nouveaux clients.
                </p>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-7 py-4 font-bold text-white/90 transition hover:bg-yellow-600"
              >
                Devenir vendeuse
                <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
