import { Link } from "react-router-dom";
import { Package, ShoppingBag, Plus, ArrowRight, } from "lucide-react";

import { useEffect, useState } from "react";
import { getMyProducts, type Product } from "../../services/productService";

import {
  getSellerOrders,
  type SellerOrder,
} from "../../services/orderService";

const SellerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          getMyProducts(),
          getSellerOrders(),
        ]);

        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Erreur chargement dashboard :", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const revenue = orders
    .filter((order) => order.statut === "LIVREE")
    .reduce((total, order) => total + Number(order.total), 0);

  return (
    <div className="min-h-screen">
      {/* En-tête */}
      <section className="bg-green-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-medium text-yellow-400">
                Espace vendeuse
              </p>

              <h1 className="text-3xl font-bold md:text-4xl">
                Bienvenue sur votre tableau de bord
              </h1>

              <p className="mt-2 max-w-2xl text-green-100">
                Gérez vos produits et suivez les commandes reçues sur
                TerangaMarket.
              </p>
            </div>

            <Link
              to="/dashboard/vendeuse/produits/nouveau"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-green-950 transition hover:bg-yellow-400"
            >
              <Plus size={20} />
              Ajouter un produit
            </Link>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Statistiques */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Mes produits</p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? "..." : products.length}
                </p>
              </div>

              <div className="rounded-xl bg-green-100 p-3 text-green-800">
                <Package size={25} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Commandes reçues</p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? "..." : orders.length}
                </p>
              </div>

              <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700">
                <ShoppingBag size={25} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ventes livrées</p>

                <p className="mt-2 text-2xl font-bold text-green-900">
                  {loading ? "..." : `${revenue.toLocaleString("fr-FR")} FCFA`}
                </p>
              </div>

              <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700">
                <ShoppingBag size={25} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Gestion de votre boutique
          </h2>

          <p className="mt-1 text-gray-600">
            Accédez rapidement aux principales fonctionnalités.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Link
              to="/dashboard/vendeuse/produits"
              className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-green-100 p-3 text-green-800">
                  <Package size={25} />
                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-800"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Mes produits
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Ajoutez, modifiez et gérez les produits de votre boutique.
              </p>
            </Link>

            <Link
              to="/dashboard/vendeuse/commandes"
              className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700">
                  <ShoppingBag size={25} />
                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-800"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Mes commandes
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Consultez les commandes contenant vos produits.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SellerDashboard;
