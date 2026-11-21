
import api from "./api";

export interface OrderItemData {
  productId: number;
  quantity: number;
}

export interface CreateOrderData {
  nom: string;
  telephone: string;
  adresse?: string;
  items: OrderItemData[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  prix: number | string;
  productId: number;
  product?: {
    id: number;
    nom: string;
    image?: string | null;
    description?: string;
    prix?: number | string;
  };
}

export type OrderStatus =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "EXPEDIEE"
  | "PARTIELLEMENT_LIVREE"
  | "LIVREE"
  | "ANNULEE";

export interface Order {
  id: number;
  total: number | string;
  statut: OrderStatus;
  userId: number;
  items: OrderItem[];
  sellerOrders?: SellerOrder[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SellerOrder {
  id: number;
  total: number | string;
  statut: OrderStatus;
  orderId: number;
  sellerId: number;
  items: OrderItem[];
  order?: Order;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateOrderStatusResponse {
  message: string;
  sellerOrder: SellerOrder;
  orderStatut: OrderStatus;
}

// Créer une commande
export async function createOrder(
  data: CreateOrderData
): Promise<Order> {
  const response = await api.post<Order>("/orders", data);
  return response.data;
}

// Récupérer toutes les commandes
export async function getOrders(): Promise<Order[]> {
  const response = await api.get<Order[]>("/orders");
  return response.data;
}

// Récupérer les commandes de la vendeuse
export async function getSellerOrders(): Promise<SellerOrder[]> {
  const response = await api.get<SellerOrder[]>("/orders/seller");
  return response.data;
}

// Récupérer une commande par son identifiant
export async function getOrder(id: number): Promise<Order> {
  const response = await api.get<Order>(`/orders/${id}`);
  return response.data;
}

export async function getGuestOrder(
  orderId: number,
  telephone: string,
): Promise<Order> {
  const response = await api.post<Order>('/orders/guest/lookup', {
    orderId,
    telephone,
  });

  return response.data;
}

// Modifier le statut d'une commande
export async function updateOrderStatus(
  id: number,
  statut: OrderStatus,
): Promise<UpdateOrderStatusResponse> {
  const response = await api.put<UpdateOrderStatusResponse>(
    `/orders/${id}/status`,
    { statut },
  );

  return response.data;
}
