import apiClient from "./api";
import type {
  Product,
  PaginatedProductsResponse,
  ProductQuery,
} from "@/types/product";

export async function getProducts(
  query: ProductQuery,
): Promise<PaginatedProductsResponse> {
  const params: Record<string, string | number> = {};

  if (query.page) params.page = query.page;
  if (query.limit) params.limit = query.limit;
  if (query.q) params.q = query.q;
  if (query.category) params.category = query.category;
  if (query.minPrice !== undefined) params.minPrice = query.minPrice;
  if (query.maxPrice !== undefined) params.maxPrice = query.maxPrice;
  if (query.sort) params.sort = query.sort;
  if (query.order) params.order = query.order;

  const response = await apiClient.get<PaginatedProductsResponse>(
    "/products",
    {
      params,
    },
  );

  return response.data;
}

export async function getProductById(id: number): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}