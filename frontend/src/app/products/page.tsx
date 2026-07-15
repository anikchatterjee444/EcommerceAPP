"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/product";
import type { Product, Pagination } from "@/types/product";
import ProductGrid from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import SortDropdown from "@/components/SortDropdown";
import PaginationControls from "@/components/Pagination";

const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
];

const PRODUCTS_PER_PAGE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: PRODUCTS_PER_PAGE,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await getProducts({
          page,
          limit: PRODUCTS_PER_PAGE,
          q: search || undefined,
          category: category || undefined,
          sort,
          order,
        });
        if (!cancelled) {
          setProducts(response.data);
          setPagination(response.pagination);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load products. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [page, search, category, sort, order]);

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  const handleSortChange = (newSort: string, newOrder: "asc" | "desc") => {
    setSort(newSort);
    setOrder(newOrder);
    setPage(1);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="mb-4">Products</h1>

      <div className="filter-toolbar">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="col-md-3">
            <CategoryFilter
              categories={CATEGORIES}
              selected={category}
              onChange={handleCategoryChange}
            />
          </div>
          <div className="col-md-3">
            <SortDropdown
              sort={sort}
              order={order}
              onSortChange={handleSortChange}
            />
          </div>
          <div className="col-md-2 text-end">
            <span className="text-muted small">
              {pagination.total} products
            </span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="d-flex flex-column justify-content-center align-items-center py-5 gap-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted small">Loading products...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-search"></i>
          </div>
          <h2>No products found</h2>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <ProductGrid products={products} />
          <div className="mt-4">
            <PaginationControls
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
