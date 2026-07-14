export interface OrderItem {
  quantity: number;
  price: number;
  product: {
    id: number;
    title: string;
    thumbnail: string | null;
  };
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}
