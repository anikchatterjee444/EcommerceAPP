export interface Product {
  id: number;
  dummyJsonId: number;
  title: string;
  description: string;
  category: string;
  brand: string | null;
  sku: string | null;
  price: number;
  discountPercentage: number | null;
  rating: number | null;
  stock: number;
  weight: number | null;
  warrantyInformation: string | null;
  shippingInformation: string | null;
  availabilityStatus: string | null;
  returnPolicy: string | null;
  minimumOrderQuantity: number | null;
  thumbnail: string | null;
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedProductsResponse {
  data: Product[];
  pagination: Pagination;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  order?: "asc" | "desc";
}