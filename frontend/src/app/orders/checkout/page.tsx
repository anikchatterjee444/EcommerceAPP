"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getCart } from "@/services/cart";
import { checkout } from "@/services/order";
import type { Cart } from "@/types/cart";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

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

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await checkout();
      toast.success("Order placed successfully.");
      setTimeout(() => {
        router.push("/orders");
      }, 1000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          router.push("/login");
          return;
        }
        const message =
          err.response?.data?.message || "Failed to place order";
        toast.error(message);
      } else {
        toast.error("Failed to place order");
      }
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 gap-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="text-muted small">Loading checkout...</span>
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
        <p>Add some products before checking out.</p>
        <Link href="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="row g-4 animate-fade-in">
      <div className="col-lg-8">
        <Link
          href="/cart"
          className="btn btn-outline-secondary mb-3"
        >
          <i className="bi bi-arrow-left me-1"></i> Back to Cart
        </Link>
        <h1 className="mb-4">Checkout</h1>
        {cart.items.map((item) => (
          <div key={item.productId} className="cart-item mb-3">
            <div className="row g-0">
              <div className="col-md-2 d-flex align-items-center justify-content-center p-2">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="rounded"
                    style={{ objectFit: "contain", width: "100px", height: "100px" }}
                  />
                ) : (
                  <div
                    className="rounded d-flex align-items-center justify-content-center bg-light"
                    style={{ width: "100px", height: "100px" }}
                  >
                    <i className="bi bi-image text-muted"></i>
                  </div>
                )}
              </div>
              <div className="col-md-10">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center h-100 gap-2">
                  <div>
                    <h6 className="card-title mb-1">{item.title}</h6>
                    <p className="card-text text-muted small mb-0">
                      Unit Price: ${item.price.toFixed(2)}
                    </p>
                    <p className="card-text text-muted small mb-0">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <span className="fw-bold" style={{ minWidth: "80px" }}>
                    ${item.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
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
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Placing Order...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-1"></i> Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
