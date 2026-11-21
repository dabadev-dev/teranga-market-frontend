import { useEffect, useState } from "react";
import {
  Edit,
  Loader2,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type Category,
} from "../../services/categoryService";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();

      setCategories(data);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Impossible de récupérer les catégories.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setNom("");
    setDescription("");
    setEditingCategory(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setNom("");
    setDescription("");
    setEditingCategory(null);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (category: Category) => {
    setNom(category.nom);
    setDescription(category.description || "");
    setEditingCategory(category);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!nom.trim()) {
      setError("Le nom de la catégorie est obligatoire.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = {
        nom: nom.trim(),
        description: description.trim() || undefined,
      };

      if (editingCategory) {
        const updated = await updateCategory(
          editingCategory.id,
          data,
        );

        setCategories((current) =>
          current.map((category) =>
            category.id === updated.id
              ? updated
              : category,
          ),
        );
      } else {
        const created = await createCategory(data);

        setCategories((current) => [
          created,
          ...current,
        ]);
      }

      resetForm();
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Une erreur est survenue.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette catégorie ?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteCategory(id);

      setCategories((current) =>
        current.filter((category) => category.id !== id),
      );
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Impossible de supprimer cette catégorie.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-yellow-600">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold text-green-950">
              Gestion des catégories
            </h1>

            <p className="mt-2 text-gray-600">
              Organisez les produits de TerangaMarket.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-3 font-semibold text-white transition hover:bg-green-900"
          >
            <Plus size={18} />
            Nouvelle catégorie
          </button>
        </div>

        {/* ERREUR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* FORMULAIRE */}
        {showForm && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-green-950">
                  {editingCategory
                    ? "Modifier la catégorie"
                    : "Ajouter une catégorie"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingCategory
                    ? "Modifiez les informations de la catégorie."
                    : "Créez une nouvelle catégorie de produits."}
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 md:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Nom de la catégorie
                </label>

                <input
                  id="category-name"
                  type="text"
                  value={nom}
                  onChange={(event) =>
                    setNom(event.target.value)
                  }
                  placeholder="Ex : Céréales"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="category-description"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Description
                </label>

                <input
                  id="category-description"
                  type="text"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Ex : Produits céréaliers locaux"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500/20"
                />
              </div>

              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-3 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {editingCategory
                    ? "Enregistrer"
                    : "Créer la catégorie"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LISTE */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
              <Loader2
                size={20}
                className="animate-spin"
              />
              Chargement des catégories...
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <Package
                size={30}
                className="text-gray-400"
              />

              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                Aucune catégorie
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Commencez par créer une catégorie.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                        <Package
                          size={18}
                          className="text-green-800"
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {category.nom}
                        </h3>

                        {category.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(category)
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <Edit size={16} />
                      Modifier
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(category.id)
                      }
                      disabled={
                        deletingId === category.id
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === category.id ? (
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}