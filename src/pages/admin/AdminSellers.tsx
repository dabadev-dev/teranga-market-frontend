import { useEffect, useState } from "react";
import {
  Check,
  X,
  Clock,
  UserCheck,
} from "lucide-react";

import {
  getUsers,
  updateUserStatus,
  type User,
} from "../../services/userService";

const AdminSellers = () => {
  const [sellers, setSellers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadSellers = async () => {
    try {
      const users = await getUsers();

      setSellers(
        users.filter((user) => user.role === "VENDEUSE"),
      );
    } catch (error) {
      console.error(
        "Erreur lors du chargement des vendeuses :",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleStatus = async (
    id: number,
    statut: "APPROUVEE" | "REFUSEE",
  ) => {
    try {
      setProcessingId(id);

      await updateUserStatus(id, statut);

      setSellers((current) =>
        current.map((seller) =>
          seller.id === id
            ? { ...seller, statut }
            : seller,
        ),
      );
    } catch (error) {
      console.error(
        "Erreur lors de la modification du statut :",
        error,
      );

      alert("Une erreur est survenue.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]">
        <p className="text-gray-500">
          Chargement des vendeuses...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <div className="bg-green-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-yellow-400 text-sm font-medium">
            TerangaMarket
          </p>

          <h1 className="text-2xl md:text-3xl font-bold mt-1">
            Gestion des vendeuses
          </h1>

          <p className="text-green-100 mt-2">
            Validez les vendeuses qui souhaitent rejoindre la
            marketplace.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {sellers.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <UserCheck
              size={42}
              className="mx-auto text-gray-400 mb-4"
            />

            <h2 className="font-bold text-lg">
              Aucune vendeuse
            </h2>

            <p className="text-gray-500 mt-2">
              Aucune vendeuse n'est actuellement enregistrée.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                        <UserCheck
                          size={21}
                          className="text-green-800"
                        />
                      </div>

                      <div>
                        <h2 className="font-bold text-gray-900">
                          {seller.nom}
                        </h2>

                        <p className="text-sm text-gray-500">
                          {seller.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                      {seller.telephone && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          {seller.telephone}
                        </span>
                      )}

                      {seller.adresse && (
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          {seller.adresse}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {seller.statut === "EN_ATTENTE" && (
                      <>
                        <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full text-sm font-medium">
                          <Clock size={16} />
                          En attente
                        </span>

                        <button
                          type="button"
                          disabled={processingId === seller.id}
                          onClick={() =>
                            handleStatus(
                              seller.id,
                              "APPROUVEE",
                            )
                          }
                          className="inline-flex items-center gap-2 bg-green-800 hover:bg-green-900 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                          <Check size={17} />
                          Approuver
                        </button>

                        <button
                          type="button"
                          disabled={processingId === seller.id}
                          onClick={() =>
                            handleStatus(
                              seller.id,
                              "REFUSEE",
                            )
                          }
                          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                          <X size={17} />
                          Refuser
                        </button>
                      </>
                    )}

                    {seller.statut === "APPROUVEE" && (
                      <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                        <Check size={16} />
                        Approuvée
                      </span>
                    )}

                    {seller.statut === "REFUSEE" && (
                      <span className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                        <X size={16} />
                        Refusée
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSellers;