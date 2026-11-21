
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  SlidersHorizontal,
  ShoppingBag,
} from "lucide-react";

import type { Product } from "../services/productService";
import {
  getProducts,
} from "../services/productService";
import { getCategories } from "../services/categoryService";

type Category = Awaited<ReturnType<typeof getCategories>>[number];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        if (!cancelled) {
          setProducts(productsData);
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error("Erreur de chargement du catalogue :", err);

        if (!cancelled) {
          setError(
            "Impossible de charger les produits. Vérifiez que le serveur backend est démarré."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Évite d'afficher deux fois la catégorie Céréales.
  const uniqueCategories = useMemo(
    () =>
      categories.filter(
        (category, index, array) =>
          array.findIndex((item) => item.nom === category.nom) === index
      ),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.nom.toLowerCase().includes(normalizedSearch) ||
        (product.description ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "Toutes" ||
        product.category?.nom === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const formatPrice = (price: number | string) =>
    `${Number(price).toLocaleString("fr-FR")} FCFA`;

  // Les images sont dans le dossier public/images du frontend.
  const getImageUrl = (image?: string | null) => {
  if (!image) return "/images/placeholder.png";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `http://localhost:3000${image}`;
  }

  return image.startsWith("/") ? image : `/${image}`;
};

  return (
    <main className="min-h-screen bg-[#FAF7F0]">
      {/* EN-TÊTE DU CATALOGUE */}
      <section className="bg-green-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-semibold uppercase tracking-[0.2em] text-yellow-400">
              Notre catalogue
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Découvrez les produits
              <span className="block text-yellow-400">
                de nos entrepreneures.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-green-100/75 sm:text-lg">
              Explorez une sélection de produits locaux proposés par les
              femmes entrepreneures du Sénégal.
            </p>
          </div>
        </div>
      </section>

      {/* CATALOGUE */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* RECHERCHE + FILTRE */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Recherche */}
            <div className="relative w-full lg:max-w-xl">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500/20"
              />
            </div>

            {/* Nombre */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ShoppingBag size={18} className="text-green-800" />

              <span>
                {filteredProducts.length} produit
                {filteredProducts.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* CATÉGORIES */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <div className="mr-2 flex items-center gap-2 text-sm font-medium text-gray-600">
              <SlidersHorizontal size={16} />
              Filtrer :
            </div>

            <button
              onClick={() => setSelectedCategory("Toutes")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === "Toutes"
                  ? "bg-green-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Toutes
            </button>

            {uniqueCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.nom)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category.nom
                    ? "bg-green-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.nom}
              </button>
            ))}
          </div>
        </div>

        {/* RÉSULTATS */}
        <div className="mt-10">
          {loading ? (
            <div className="py-16 text-center text-gray-500">
              Chargement des produits...
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-white px-6 py-12 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-green-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-900"
              >
                Réessayer
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* IMAGE */}
                  <Link
                    to={`/products/${product.id}`}
                    className="block overflow-hidden"
                  >
                    <div className="h-64 overflow-hidden bg-[#F6F0E2]">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.nom}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "/images/placeholder.png";
                        }}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* CONTENU */}
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-yellow-600">
                      {product.category?.nom ?? "Produit local"}
                    </span>

                    <Link to={`/products/${product.id}`}>
                      <h2 className="mt-2 text-lg font-bold text-green-950 transition hover:text-green-700">
                        {product.nom}
                      </h2>
                    </Link>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                      {product.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-lg font-bold text-green-900">
                        {formatPrice(product.prix)}
                      </span>

                      <Link
                        to={`/products/${product.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-800 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
                      >
                        Voir
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-800">
                <Search size={25} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-green-950">
                Aucun produit trouvé
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Essayez un autre mot-clé ou choisissez une autre catégorie.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("Toutes");
                }}
                className="mt-5 rounded-lg bg-green-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
