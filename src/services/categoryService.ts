import api from "./api";

export interface Category {
  id: number;
  nom: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryData {
  nom: string;
  description?: string;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories");

  return response.data;
}

export async function getCategory(
  id: number,
): Promise<Category> {
  const response = await api.get<Category>(
    `/categories/${id}`,
  );

  return response.data;
}

export async function createCategory(
  data: CategoryData,
): Promise<Category> {
  const response = await api.post<Category>(
    "/categories",
    data,
  );

  return response.data;
}

export async function updateCategory(
  id: number,
  data: Partial<CategoryData>,
): Promise<Category> {
  const response = await api.put<Category>(
    `/categories/${id}`,
    data,
  );

  return response.data;
}

export async function deleteCategory(
  id: number,
): Promise<void> {
  await api.delete(`/categories/${id}`);
}