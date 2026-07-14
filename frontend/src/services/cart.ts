import apiClient from "./api";

export interface CartResponse {
  message: string;
}

export async function addToCart(
  productId: number,
  quantity: number,
): Promise<CartResponse> {
  const response = await apiClient.post<CartResponse>("/cart/items", {
    productId,
    quantity,
  });
  return response.data;
}
