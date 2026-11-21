import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/">
              <h2 className="text-3xl font-semibold">
                Teranga<span className="text-yellow-600">Market</span>
              </h2>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-yellow-100">
              La marketplace des femmes entrepreneures du Sénégal
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-yellow-500 hover:text-green-950"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-yellow-500 hover:text-green-950"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-yellow-500 hover:text-green-950"
              >
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold">Navigation</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/products" className="hover:text-yellow-600">
                  Produits
                </Link>
              </li>

              <li>
                <Link to="/cart" className="hover:text-yellow-600">
                  Mon panier
                </Link>
              </li>

              <li>
                <Link to="/login" className="hover:text-yellow-600">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendeuses */}
          <div>
            <h3 className="font-semibold">Pour les vendeuses</h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href="#vendeuse" className="hover:text-yellow-600">
                  Devenir vendeuse
                </a>
              </li>

              <li>
                <Link to="/register" className="hover:text-yellow-600">
                  Créer un compte
                </Link>
              </li>

              <li>
                <a href="#" className="hover:text-yellow-600">
                  Comment ça marche ?
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold">Contact</h3>

            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="shrink-0 text-yellow-600" />
                <span>Sénégal</span>
              </li>

              <li className="flex gap-3">
                <Phone size={18} className="shrink-0 text-yellow-600" />
                <span>+221 77 000 00 00</span>
              </li>

              <li className="flex gap-3">
                <Mail size={18} className="shrink-0 text-yellow-600" />
                <span>contact@terangamarket.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/30 pt-6 text-center text-sm text-white/80">
          © {new Date().getFullYear()} TerangaMarket — Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
