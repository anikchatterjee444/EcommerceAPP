import apiClient from "./api";

export interface CartItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
  thumbnail: string | null;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartMessageResponse {
  message: string;
}

export async function getCart(): Promise<Cart> {
  const response = await apiClient.get<Cart>("/cart");
  return response.data;
}

export async function addToCart(
  productId: number,
  quantity: number,
): Promise<CartMessageResponse> {
  const response = await apiClient.post<CartMessageResponse>("/cart/items", {
    productId,
    quantity,
  });
  return response.data;
}

export async function updateCartItem(
  productId: number,
  quantity: number,
): Promise<CartMessageResponse> {
  const response = await apiClient.patch<CartMessageResponse>(
    `/cart/items/${productId}`,
    { quantity },
  );
  return response.data;
}

export async function removeCartItem(
  productId: number,
): Promise<CartMessageResponse> {
  const response = await apiClient.delete<CartMessageResponse>(
    `/cart/items/${productId}`,
  );
  return response.data;
}
