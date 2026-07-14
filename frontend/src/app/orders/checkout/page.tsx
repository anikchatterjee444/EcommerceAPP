"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getCart } from "@/services/cart";
import { checkout } from "@/services/order";
import type { Cart } from "@/types/cart";
import ProtectedRoute from "@/components/ProtectedRoute";

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
      const message =
        err instanceof Error ? err.message : "Failed to place order";
      toast.error(message);
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="fs-1 mb-3">&#128722;</div>
        <h2>Your cart is empty.</h2>
        <p className="text-muted">Add some products before checking out.</p>
        <Link href="/products" className="btn btn-primary mt-2">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <Link href="/cart" className="btn btn-outline-secondary mb-3">
          &larr; Back to Cart
        </Link>
        <h1 className="mb-4">Checkout</h1>
        {cart.items.map((item) => (
          <div key={item.productId} className="card mb-3">
            <div className="row g-0">
              <div className="col-md-2 d-flex align-items-center justify-content-center p-2">
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="rounded"
                    style={{ objectFit: "contain", width: "120px", height: "120px" }}
                  />
                )}
              </div>
              <div className="col-md-10">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center h-100 gap-2">
                  <div>
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text text-muted mb-0">
                      Unit Price: ${item.price.toFixed(2)}
                    </p>
                    <p className="card-text text-muted mb-0">
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
        <div className="card sticky-top" style={{ top: "80px" }}>
          <div className="card-body">
            <h5 className="card-title mb-3">Order Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Items ({cart.totalItems})</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Total</span>
              <span className="fw-bold fs-5">${cart.totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-success btn-lg w-100"
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
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
