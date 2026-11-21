
import api from "./api";

export interface Product {
  id: number;
  nom: string;
  description?: string;
  prix: number | string;
  stock: number;
  image?: string | null;
  userId: number;
  categoryId?: number | null;

  category?: {
    id: number;
    nom: string;
    description?: string;
  };
}

export interface CreateProductData {
  nom: string;
  description: string;
  prix: number;
  stock: number;
  categoryId?: number;
}

export type UpdateProductData = Partial<CreateProductData>;

function createProductFormData(
  data: CreateProductData | UpdateProductData,
  imageFile?: File | null,
): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, String(value));
    }
  });

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formData;
}

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>("/products");
  return response.data;
}

export async function getProduct(id: number): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}

export async function getMyProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>("/products/mine");
  return response.data;
}

export async function createProduct(
  data: CreateProductData,
  imageFile?: File | null,
): Promise<Product> {
  const formData = createProductFormData(data, imageFile);

  const response = await api.post<Product>("/products", formData);

  return response.data;
}

export async function updateProduct(
  id: number,
  data: UpdateProductData,
  imageFile?: File | null,
): Promise<Product> {
  const formData = createProductFormData(data, imageFile);

  const response = await api.put<Product>(`/products/${id}`, formData);

  return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
