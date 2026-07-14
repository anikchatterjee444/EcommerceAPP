import apiClient from "./api";
import type { Order } from "@/types/order";

export async function checkout(): Promise<Order> {
  const response = await apiClient.post<Order>("/orders/checkout");
  return response.data;
}

export async function getOrders(): Promise<Order[]> {
  const response = await apiClient.get<Order[]>("/orders");
  return response.data;
}

export async function getOrderById(id: number): Promise<Order> {
  const response = await apiClient.get<Order>(`/orders/${id}`);
  return response.data;
}
