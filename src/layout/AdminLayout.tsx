
import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  Tags,
  Store,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const navigation = [
  {
    label: "Tableau de bord",
    path: "/dashboard/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Gestion des vendeuses",
    path: "/dashboard/admin/vendeuses",
    icon: Users,
  },
  {
    label: "Gestion des produits",
    path: "/dashboard/admin/produits",
    icon: Package,
  },
  {
    label: "Gestion des commandes",
    path: "/dashboard/admin/commandes",
    icon: ShoppingBag,
  },
  {
    label: "Gestion des catégories",
    path: "/dashboard/admin/categories",
    icon: Tags,
  },
];

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      {/* Barre mobile */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-green-900 px-5 py-4 text-white lg:hidden">
        <Link
          to="/dashboard/admin"
          onClick={closeMenu}
          className="flex items-center gap-2 font-bold"
        >
          <Store size={22} />
          TerangaMarket Admin
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      <div className="flex min-h-screen">
        {/* Fond sombre mobile */}
        {isOpen && (
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}

        {/* Menu latéral */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-green-900 text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
            <Link
              to="/dashboard/admin"
              onClick={closeMenu}
              className="flex items-center gap-3 text-xl font-bold"
            >
              <Store size={25} className="text-yellow-400" />
              TerangaMarket
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              className="lg:hidden"
              aria-label="Fermer le menu"
            >
              <X size={22} />
            </button>
          </div>

          <div className="px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
              Administration
            </p>
          </div>

          <nav className="flex-1 space-y-2 px-4">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-yellow-400 text-green-950"
                        : "text-green-100 hover:bg-white/10"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-green-100 transition hover:bg-white/10"
            >
              <LogOut size={19} />
              Retour à la boutique
            </Link>
          </div>
        </aside>

        {/* Contenu des pages */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
