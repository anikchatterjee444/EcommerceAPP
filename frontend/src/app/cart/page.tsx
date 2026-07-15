"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getCart, updateCartItem, removeCartItem } from "@/services/cart";
import type { Cart } from "@/types/cart";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}

function CartContent() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch {
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getCart();
        if (!cancelled) {
          setCart(data);
        }
      } catch {
        if (!cancelled) {
          toast.error("Failed to load cart");
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
  }, []);

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    setUpdatingId(productId);
    try {
      await updateCartItem(productId, newQuantity);
      await fetchCart();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update cart";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId: number, title: string) => {
    setRemovingId(productId);
    try {
      await removeCartItem(productId);
      toast.success(`"${title}" removed from cart`);
      await fetchCart();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to remove item";
      toast.error(message);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 gap-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="text-muted small">Loading cart...</span>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="empty-state animate-fade-in">
        <div className="empty-state-icon">
          <i className="bi bi-cart-x"></i>
        </div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started.</p>
        <Link href="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const isBusy = (id: number) => updatingId === id || removingId === id;

  return (
    <div className="row g-4 animate-fade-in">
      <div className="col-lg-8">
        <h1 className="mb-4">Shopping Cart ({cart.totalItems})</h1>
        {cart.items.map((item) => {
          const busy = isBusy(item.productId);
          return (
            <div key={item.productId} className="cart-item mb-3">
              <div className="row g-0">
                <div className="col-md-3">
                  <Link href={`/products/${item.productId}`}>
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="cart-item-image rounded-start"
                      />
                    ) : (
                      <div className="cart-item-image rounded-start d-flex align-items-center justify-content-center bg-light">
                        <i className="bi bi-image text-muted"></i>
                      </div>
                    )}
                  </Link>
                </div>
                <div className="col-md-9">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center h-100 gap-2">
                    <div>
                      <h6 className="card-title mb-1">
                        <Link
                          href={`/products/${item.productId}`}
                          className="text-decoration-none text-dark"
                        >
                          {item.title}
                        </Link>
                      </h6>
                      <p className="card-text text-muted small mb-0">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="quantity-selector">
                        <button
                          className="btn"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={busy || item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span className="quantity-value">
                          {busy ? "..." : item.quantity}
                        </span>
                        <button
                          className="btn"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={busy}
                          aria-label="Increase quantity"
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                      <span className="fw-bold" style={{ minWidth: "80px" }}>
                        ${item.subtotal.toFixed(2)}
                      </span>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(item.productId, item.title)}
                        disabled={busy}
                      >
                        {removingId === item.productId ? (
                          <span className="spinner-border spinner-border-sm" role="status" />
                        ) : (
                          <>
                            <i className="bi bi-trash me-1"></i>Remove
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="col-lg-4">
        <div className="order-summary-card sticky-top" style={{ top: "80px" }}>
          <div className="card-body">
            <h5 className="card-title mb-3">Order Summary</h5>
            <div className="summary-row">
              <span>Items ({cart.totalItems})</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="text-success fw-semibold">Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-success btn-lg w-100 mt-3"
              onClick={() => router.push("/orders/checkout")}
            >
              Checkout
            </button>
            <Link
              href="/products"
              className="btn btn-outline-secondary w-100 mt-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
