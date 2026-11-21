import api from "./api";

export interface User {
  id: number;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  role: "CLIENT" | "VENDEUSE" | "ADMIN";
  statut: "EN_ATTENTE" | "APPROUVEE" | "REFUSEE";
  createdAt?: string;
  updatedAt?: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/users");
  return response.data;
}

export async function updateUserStatus(
  id: number,
  statut: User["statut"],
): Promise<User> {
  const response = await api.patch<User>(`/users/${id}/status`, {
    statut,
  });

  return response.data;
}

export async function updateUserRole(
  id: number,
  role: User["role"],
): Promise<User> {
  const response = await api.patch<User>(`/users/${id}/role`, {
    role,
  });

  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}