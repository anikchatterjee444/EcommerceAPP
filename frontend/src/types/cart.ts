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
