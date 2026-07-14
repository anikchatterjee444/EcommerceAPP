"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getProductById } from "@/services/product";
import { addToCart } from "@/services/cart";
import type { Product } from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

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
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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
    <div className="row g-4">
      <div className="col-lg-5">
        <div className="card shadow d-flex justify-content-center align-items-center" style={{ minHeight: "500px" }}>
          {product.thumbnail && (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="rounded"
              style={{ objectFit: "contain", height: "500px", width: "100%" }}
            />
          )}
        </div>
      </div>

      <div className="col-lg-7">
        <h1 className="mb-2">{product.title}</h1>

        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="badge bg-secondary">{product.category}</span>
          {product.brand && (
            <span className="text-muted">by {product.brand}</span>
          )}
        </div>

        {product.rating !== null && (
          <p className="fs-5 mb-3">
            <span className="text-warning">{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}</span>
            <span className="text-muted ms-2">{product.rating} / 5</span>
          </p>
        )}

        <div className="mb-3">
          {discountedPrice !== null ? (
            <>
              <span className="text-decoration-line-through text-muted me-2">
                ${product.price.toFixed(2)}
              </span>
              <span className="fs-2 fw-bold text-success">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="badge bg-danger ms-2">
                -{product.discountPercentage}%
              </span>
            </>
          ) : (
            <span className="fs-2 fw-bold">${product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="mb-2">
          <span className="fw-bold d-block">Stock</span>
          {outOfStock ? (
            <span className="text-danger fw-bold">Out of Stock</span>
          ) : (
            <span className="text-success fw-bold">
              {product.stock} Available
            </span>
          )}
        </div>

        {product.availabilityStatus && (
          <p className="text-muted mb-2">Status: {product.availabilityStatus}</p>
        )}
        {product.shippingInformation && (
          <p className="text-muted mb-2">
            Shipping: {product.shippingInformation}
          </p>
        )}
        {product.warrantyInformation && (
          <p className="text-muted mb-2">
            Warranty: {product.warrantyInformation}
          </p>
        )}
        {product.returnPolicy && (
          <p className="text-muted mb-3">Return Policy: {product.returnPolicy}</p>
        )}

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Description</h5>
            <p className="card-text">{product.description}</p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 mb-4">
          <span className="fw-bold">Quantity:</span>
          <div className="input-group" style={{ width: "160px" }}>
            <button
              className="btn btn-outline-secondary"
              style={{ minWidth: "45px" }}
              onClick={() => setQuantity((q) => q - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="form-control text-center">{quantity}</span>
            <button
              className="btn btn-outline-secondary"
              style={{ minWidth: "45px" }}
              onClick={() => setQuantity((q) => q + 1)}
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
        </div>

        <button
          className="btn btn-success btn-lg w-100 mt-4"
          disabled={outOfStock || adding}
          onClick={handleAddToCart}
        >
          {outOfStock ? "Out of Stock" : adding ? "Adding..." : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}
