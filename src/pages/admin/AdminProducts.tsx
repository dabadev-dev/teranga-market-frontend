import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Package,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  getProducts,
  deleteProduct,
  type Product,
} from "../../services/productService";

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des produits :",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: number, nom: string) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le produit "${nom}" ?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteProduct(id);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du produit :",
        error,
      );

      alert("Impossible de supprimer ce produit.");
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
    <div className="min-h-screen bg-[#FAF7F0]">
      {/* En-tête */}
      <div className="bg-green-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            to="/dashboard/admin"
            className="inline-flex items-center gap-2 text-green-100 hover:text-yellow-400 text-sm mb-4 transition"
          >
            <ArrowLeft size={18} />
            Retour au tableau de bord
          </Link>

          <div className="flex items-center gap-3">
            <Package className="text-yellow-400" size={32} />

            <div>
              <p className="text-yellow-400 text-sm font-medium">
                TerangaMarket
              </p>

              <h1 className="text-2xl md:text-3xl font-bold">
                Gestion des produits
              </h1>
            </div>
          </div>

          <p className="text-green-100 mt-2">
            Consultez et gérez les produits publiés sur la plateforme.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Nombre de produits */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <p className="text-sm text-gray-500">
            Produits publiés
          </p>

          <p className="text-3xl font-bold text-gray-900 mt-1">
            {products.length}
          </p>
        </div>

        {/* Chargement */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2
              className="animate-spin text-green-800"
              size={32}
            />

            <span className="ml-3 text-gray-500">
              Chargement des produits...
            </span>
          </div>
        ) : products.length === 0 ? (
          /* Aucun produit */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Package
              className="mx-auto text-gray-400"
              size={48}
            />

            <h2 className="text-lg font-semibold text-gray-800 mt-4">
              Aucun produit
            </h2>

            <p className="text-gray-500 mt-2">
              Aucun produit n'est actuellement publié sur la plateforme.
            </p>
          </div>
        ) : (
          /* Liste des produits */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Produit
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Catégorie
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Prix
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                      Stock
                    </th>

                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* Produit */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.image ? (
                              <img
                                src={getImageUrl(product.image)}
                                alt={product.nom}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package
                                  className="text-gray-400"
                                  size={24}
                                />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.nom}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              Produit #{product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Catégorie */}
                      <td className="px-6 py-4">
                        {product.category ? (
                          <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                            {product.category.nom}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Non définie
                          </span>
                        )}
                      </td>

                      {/* Prix */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {Number(product.prix).toLocaleString("fr-FR")} FCFA
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span
                          className={
                            product.stock === 0
                              ? "text-red-600 font-medium"
                              : product.stock <= 5
                                ? "text-yellow-600 font-medium"
                                : "text-green-700 font-medium"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-2">
                          <Link
                            to={`/dashboard/vendeuse/produits/${product.id}/modifier`}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-800 hover:bg-green-100 transition text-sm font-medium"
                          >
                            <Edit size={16} />
                            Modifier
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(product.id, product.nom)
                            }
                            disabled={deletingId === product.id}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition text-sm font-medium"
                          >
                            {deletingId === product.id ? (
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}

                            Supprimer
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

export default AdminProducts;