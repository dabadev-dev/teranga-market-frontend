import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Package, Loader2, Eye } from "lucide-react";
import {
  deleteProduct,
  getMyProducts,
  type Product,
} from "../../services/productService";

const SellerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer vos produits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce produit ?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteProduct(id);

      setProducts((current) => current.filter((product) => product.id !== id));
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer le produit.");
    } finally {
      setDeletingId(null);
    }
  };

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

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-green-700">Ma boutique</p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Mes produits
            </h1>

            <p className="mt-2 text-gray-600">
              Gérez les produits proposés dans votre boutique.
            </p>
          </div>

          <Link
            to="/dashboard/vendeuse/produits/nouveau"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-900 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            <Plus size={20} />
            Ajouter un produit
          </Link>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Chargement */}
        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <Loader2 size={35} className="animate-spin text-green-800" />
          </div>
        ) : products.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <Package size={45} className="mx-auto text-gray-400" />

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Aucun produit
            </h2>

            <p className="mt-2 text-gray-600">
              Vous n'avez pas encore ajouté de produit.
            </p>

            <Link
              to="/dashboard/vendeuse/produits/nouveau"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-green-950 hover:bg-yellow-400"
            >
              <Plus size={20} />
              Ajouter mon premier produit
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full min-w-180">
                <thead className="bg-green-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Produit
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Catégorie
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Prix
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                            {product.image ? (
                              <img
                                src={getImageUrl(product.image)}
                                alt={product.nom}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package size={22} className="text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.nom}
                            </p>

                            <p className="mt-1 max-w-xs truncate text-sm text-gray-500">
                              {product.description || "Aucune description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category?.nom || "Sans catégorie"}
                      </td>

                      <td className="px-6 py-4 font-semibold text-green-900">
                        {Number(product.prix).toLocaleString("fr-FR")} FCFA
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span
                          className={
                            product.stock > 0
                              ? "font-medium text-green-700"
                              : "font-medium text-red-600"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/dashboard/vendeuse/produits/${product.id}`}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                            title="Voir les détails"
                          >
                            <Eye size={18} />
                          </Link>

                          <Link
                            to={`/dashboard/vendeuse/produits/${product.id}/modifier`}
                            className="rounded-lg p-2 text-green-800 hover:bg-green-100"
                            title="Modifier"
                          >
                            <Pencil size={18} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            title="Supprimer"
                          >
                            {deletingId === product.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SellerProducts;
