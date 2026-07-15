"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getProductById } from "@/services/product";
import { addToCart } from "@/services/cart";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { Product } from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { requireAuth } = useRequireAuth();

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        if (!cancelled) {
          setProduct(data);
        }
      } catch {
        if (!cancelled) {
          setError("Product not found.");
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
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 gap-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="text-muted small">Loading product...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!product) return null;

  const outOfStock = product.stock === 0;
  const discountedPrice =
    product.discountPercentage && product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  const handleAddToCart = async () => {
    if (!requireAuth()) return;

    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success("Product added to cart");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to add product to cart";
      toast.error(message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="row g-4 animate-fade-in">
      {/* Product Image */}
      <div className="col-lg-5">
        <div
          className="card shadow-sm d-flex justify-content-center align-items-center overflow-hidden"
          style={{ minHeight: "400px" }}
        >
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="rounded"
              style={{ objectFit: "contain", height: "400px", width: "100%" }}
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center text-muted">
              <i className="bi bi-image" style={{ fontSize: "3rem" }}></i>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="col-lg-7">
        <span className="badge bg-secondary mb-2">{product.category}</span>
        <h1 className="mb-2" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
          {product.title}
        </h1>

        {product.brand && (
          <p className="text-muted mb-2">by {product.brand}</p>
        )}

        {product.rating !== null && (
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="text-warning">
              {"★".repeat(Math.round(product.rating))}
              {"☆".repeat(5 - Math.round(product.rating))}
            </span>
            <span className="text-muted">{product.rating} / 5</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3">
          {discountedPrice !== null ? (
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="text-decoration-line-through text-muted">
                ${product.price.toFixed(2)}
              </span>
              <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--success)" }}>
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="badge bg-danger">
                -{product.discountPercentage}%
              </span>
            </div>
          ) : (
            <span style={{ fontSize: "1.75rem", fontWeight: 700 }}>
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="mb-3">
          {outOfStock ? (
            <span className="badge bg-danger" style={{ fontSize: "0.8rem" }}>
              Out of Stock
            </span>
          ) : (
            <span className="badge bg-success" style={{ fontSize: "0.8rem" }}>
              {product.stock} Available
            </span>
          )}
        </div>

        {/* Info rows */}
        <div className="card mb-4 border-0 bg-light">
          <div className="card-body py-3">
            {product.availabilityStatus && (
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-check-circle text-success"></i>
                <span className="small">{product.availabilityStatus}</span>
              </div>
            )}
            {product.shippingInformation && (
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-truck text-primary"></i>
                <span className="small">{product.shippingInformation}</span>
              </div>
            )}
            {product.warrantyInformation && (
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-shield-check text-info"></i>
                <span className="small">{product.warrantyInformation}</span>
              </div>
            )}
            {product.returnPolicy && (
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-arrow-return-left text-warning"></i>
                <span className="small">{product.returnPolicy}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="card-title fw-semibold mb-2">Description</h6>
            <p className="card-text text-muted mb-0">{product.description}</p>
          </div>
        </div>

        {/* Quantity + Add to Cart */}
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center gap-3">
            <span className="fw-semibold">Quantity:</span>
            <div className="quantity-selector">
              <button
                className="btn"
                onClick={() => setQuantity((q) => q - 1)}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <i className="bi bi-dash"></i>
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                className="btn"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>

          <button
            className="btn btn-success btn-lg w-100"
            disabled={outOfStock || adding}
            onClick={handleAddToCart}
          >
            {outOfStock ? (
              <>
                <i className="bi bi-x-circle me-1"></i> Out of Stock
              </>
            ) : adding ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" />
                Adding...
              </>
            ) : (
              <>
                <i className="bi bi-cart-plus me-1"></i> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
