import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  email: string;
  password: string;
  telephone?: string;
  adresse?: string;
  role?: string;
}

export interface AuthUser {
  id: number;
  nom: string;
  email: string;
  role: string;
  statut?: string;
  telephone?: string;
  adresse?: string;
}

export interface LoginResponse {
  access_token: string;
  user?: AuthUser;
}

export async function login(
  data: LoginData
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );

  return response.data;
}

export async function register(
  data: RegisterData
) {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
}

export async function getProfile(): Promise<AuthUser> {
  const response = await api.get<AuthUser>(
    "/auth/profile"
  );

  return response.data;
}