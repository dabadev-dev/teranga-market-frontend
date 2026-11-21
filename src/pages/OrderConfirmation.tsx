import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";

interface OrderConfirmationState {
  orderId?: number;
}

export default function OrderConfirmation() {
  const location = useLocation();

  const state = location.state as OrderConfirmationState | null;
  const orderId = state?.orderId;

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm md:p-12">

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-700" />
          </div>

          <h1 className="text-3xl font-bold text-green-900">
            Commande confirmée !
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-gray-600">
            Merci pour votre commande sur TerangaMarket.
            Votre commande a bien été enregistrée.
          </p>

          {orderId && (
            <div className="mt-6 rounded-2xl bg-[#FAF7F0] p-4">
              <p className="text-sm text-gray-500">
                Numéro de commande
              </p>

              <p className="mt-1 text-xl font-bold text-green-900">
                #{orderId}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {orderId && (
              <Link
                to={`/orders/${orderId}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-900 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                Voir ma commande
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-900 px-6 py-3 font-semibold text-green-900 transition hover:bg-green-50"
            >
              <ShoppingBag className="h-5 w-5" />
              Continuer mes achats
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}