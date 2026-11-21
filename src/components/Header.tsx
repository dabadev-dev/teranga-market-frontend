import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, UserRound, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { totalItems } = useCart();
  const { user, logout, loading } = useAuth();

  const isSeller = user?.role === "VENDEUSE" && user?.statut === "APPROUVEE";

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 ${
      isActive
        ? "text-yellow-600 font-semibold"
        : "text-gray-900 hover:text-yellow-600"
    }`;

  const closeMobileMenu = () => setMobileOpen(false);

  const message = `
    DÉCOUVREZ LES PRODUITS LOCAUX DES FEMMES ENTREPRENEURES DU SÉNÉGAL
    — ACHETEZ LOCAL ET SOUTENEZ L'ENTREPRENEURIAT FÉMININ
    — MIL, BISSAP, NOIX DE CAJOU ET BIEN PLUS ENCORE
    — TERANGAMARKET — LE SAVOIR-FAIRE LOCAL AU CŒUR DU NUMÉRIQUE
  `;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
            <img
              src="/images/logo.png"
              alt="TerangaMarket"
              className="w-full h-60 object-cover"
            />
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink to="/" className={navLinkClass}>
              Accueil
            </NavLink>

            <NavLink to="/products" className={navLinkClass}>
              Produits
            </NavLink>

            {!loading && isSeller && (
              <NavLink to="/dashboard/vendeuse" className={navLinkClass}>
                Espace vendeuse
              </NavLink>
            )}

            {user && (
              <NavLink to="/my-orders" className={navLinkClass}>
                Mes commandes
              </NavLink>
            )}

            {!user && !loading && (
              <a
                href="/#vendeuse"
                className="text-gray-900 transition-colors hover:text-yellow-600"
              >
                Devenir vendeuse
              </a>
            )}

            {user?.role === "ADMIN" && (
              <NavLink to="/dashboard/admin" className={navLinkClass}>
                Administration
              </NavLink>
            )}
          </nav>

          {/* Actions desktop */}
          <div className="hidden items-center gap-3 md:flex">
            {!loading &&
              (user ? (
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 rounded-lg border border-green-900 px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-lg border border-green-900 px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
                >
                  <UserRound size={18} />
                  Connexion
                </Link>
              ))}

            <Link
              to="/cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-green-800 text-white transition hover:bg-green-900"
              aria-label="Panier"
            >
              <ShoppingCart size={20} />

              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500 px-1 text-[11px] font-bold text-white">
                {totalItems}
              </span>
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-900 hover:bg-gray-100 md:hidden"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>

        {/* Navigation mobile */}
        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-5 md:hidden">
            <nav className="flex flex-col gap-4">
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={navLinkClass}
              >
                Accueil
              </NavLink>

              <NavLink
                to="/products"
                onClick={closeMobileMenu}
                className={navLinkClass}
              >
                Produits
              </NavLink>

              {!loading && isSeller && (
                <NavLink
                  to="/dashboard/vendeuse"
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  Espace vendeuse
                </NavLink>
              )}

              {user && (
                <NavLink
                  to="/my-orders"
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  Mes commandes
                </NavLink>
              )}

              {!user && !loading && (
                <a
                  href="/#vendeuse"
                  onClick={closeMobileMenu}
                  className="text-gray-900 transition-colors hover:text-yellow-600"
                >
                  Devenir vendeuse
                </a>
              )}

              <div className="border-t border-gray-100 pt-4">
                {!loading &&
                  (user ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="flex items-center gap-2 text-gray-900 transition-colors hover:text-yellow-600"
                    >
                      <LogOut size={18} />
                      Déconnexion
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 text-gray-900 transition-colors hover:text-yellow-600"
                    >
                      <UserRound size={18} />
                      Connexion
                    </Link>
                  ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Bandeau défilant */}
      <div className="w-full overflow-hidden bg-green-900 py-2 text-yellow-500">
        <div className="flex w-max animate-[marquee_50s_linear_infinite] whitespace-nowrap">
          <span className="mx-10">{message}</span>
          <span className="mx-10">{message}</span>
        </div>
      </div>
    </>
  );
}
