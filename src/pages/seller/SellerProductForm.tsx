import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Package } from "lucide-react";

import {
  createProduct,
  getProduct,
  updateProduct,
  type CreateProductData,
} from "../../services/productService";

interface Category {
  id: number;
  nom: string;
  description?: string;
}

const SellerProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState<CreateProductData>({
    nom: "",
    description: "",
    prix: 0,
    stock: 0,
    categoryId: undefined,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [imagePreview, setImagePreview] = useState("");
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  /*Récupération des catégories*/
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("https://teranga-market-backend-64wi.onrender.com/categories");

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des catégories");
        }

        const data = await response.json();

        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les catégories.");
      }
    };

    loadCategories();
  }, []);

  /*Récupération du produit en mode modification*/
  useEffect(() => {
    if (!id) {
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const product = await getProduct(Number(id));

        setForm({
          nom: product.nom,
          description: product.description || "",
          prix: Number(product.prix),
          stock: product.stock,
          categoryId: product.categoryId ?? undefined,
        });

        if (product.image) {
          const imageUrl = product.image.startsWith("/uploads/")
            ? `https://teranga-market-backend-64wi.onrender.com${product.image}`
            : product.image.startsWith("http")
              ? product.image
              : product.image.startsWith("/")
                ? product.image
                : `/images/${product.image}`;

          setImagePreview(imageUrl);
        }
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer le produit.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  /*Modification des champs*/
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "prix" || name === "stock"
          ? Number(value)
          : name === "categoryId"
            ? value
              ? Number(value)
              : undefined
            : value,
    }));
  };

  // Gestion de l'image
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Vérifier le type
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image.");
      return;
    }

    // Vérifier la taille : 5 Mo maximum
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setError("");
    setSelectedImage(file);

    // Aperçu local
    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  /*Envoi du formulaire*/
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!form.nom.trim()) {
        setError("Le nom du produit est obligatoire.");
        return;
      }

      if (form.prix <= 0) {
        setError("Le prix doit être supérieur à 0.");
        return;
      }

      if (form.stock < 0) {
        setError("Le stock ne peut pas être négatif.");
        return;
      }
      // Si une image a été sélectionnée, on l'upload

      if (isEditMode && id) {
        await updateProduct(Number(id), form, selectedImage);

        navigate("/dashboard/vendeuse/produits");
      } else {
        await createProduct(form, selectedImage);

        navigate("/dashboard/vendeuse/produits");
      }
    } catch (err) {
      console.error(err);

      setError(
        isEditMode
          ? "Impossible de modifier le produit."
          : "Impossible de créer le produit.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* Chargement*/
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F0]">
        <Loader2 size={40} className="animate-spin text-green-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Retour */}
        <Link
          to="/dashboard/vendeuse/produits"
          className="inline-flex items-center gap-2 text-sm font-medium text-green-800 hover:text-green-950"
        >
          <ArrowLeft size={18} />
          Retour à mes produits
        </Link>

        {/* Titre */}
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-800">
              <Package size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? "Modifier le produit" : "Ajouter un produit"}
              </h1>

              <p className="mt-1 text-gray-600">
                {isEditMode
                  ? "Modifiez les informations de votre produit."
                  : "Ajoutez un nouveau produit à votre boutique."}
              </p>
            </div>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Informations du produit
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Nom */}
              <div className="md:col-span-2">
                <label
                  htmlFor="nom"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nom du produit *
                </label>

                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Ex : Mil local"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Catégorie */}
              <div>
                <label
                  htmlFor="categoryId"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Catégorie
                </label>

                <select
                  id="categoryId"
                  name="categoryId"
                  value={form.categoryId ?? ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Sélectionner une catégorie</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prix */}
              <div>
                <label
                  htmlFor="prix"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Prix (FCFA) *
                </label>

                <input
                  id="prix"
                  name="prix"
                  type="number"
                  min="0"
                  step="1"
                  value={form.prix}
                  onChange={handleChange}
                  placeholder="5000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Stock *
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="20"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Image du produit
                </label>

                <input
                  ref={imageInputRef}
                  id="image"
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition hover:border-green-700 hover:bg-green-50"
                >
                  <div>
                    <Package size={32} className="mx-auto text-green-800" />

                    <p className="mt-3 font-semibold text-gray-800">
                      Ajouter une image
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      PNG, JPG ou WEBP — 5 Mo maximum
                    </p>
                  </div>
                </button>

                {imagePreview && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Aperçu
                    </p>

                    <div className="relative h-48 w-48 overflow-hidden rounded-xl border bg-gray-100">
                      <img
                        src={imagePreview}
                        alt="Aperçu du produit"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Décrivez votre produit..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/dashboard/vendeuse/produits"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Annuler
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-900 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {isEditMode
                    ? "Enregistrer les modifications"
                    : "Ajouter le produit"}
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SellerProductForm;
