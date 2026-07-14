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
        <h2>Your cart is empty</h2>
        <p className="text-muted">Add some products to get started.</p>
        <Link href="/products" className="btn btn-primary mt-2">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const isBusy = (id: number) => updatingId === id || removingId === id;

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <h1 className="mb-4">Shopping Cart ({cart.totalItems})</h1>
        {cart.items.map((item) => {
          const busy = isBusy(item.productId);
          return (
            <div key={item.productId} className="card mb-3">
              <div className="row g-0">
                <div className="col-md-3">
                  <Link href={`/products/${item.productId}`}>
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="img-fluid rounded-start"
                        style={{ objectFit: "cover", height: "150px", width: "100%" }}
                      />
                    )}
                  </Link>
                </div>
                <div className="col-md-9">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center h-100 gap-2">
                    <div>
                      <h5 className="card-title mb-1">
                        <Link
                          href={`/products/${item.productId}`}
                          className="text-decoration-none"
                        >
                          {item.title}
                        </Link>
                      </h5>
                      <p className="card-text text-muted mb-0">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="input-group" style={{ width: "130px" }}>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          style={{ minWidth: "40px" }}
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          disabled={busy || item.quantity <= 1}
                        >
                          {updatingId === item.productId ? "..." : "-"}
                        </button>
                        <span className="form-control text-center form-control-sm">
                          {busy ? "..." : item.quantity}
                        </span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          style={{ minWidth: "40px" }}
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          disabled={busy}
                        >
                          {updatingId === item.productId ? "..." : "+"}
                        </button>
                      </div>
                      <span className="fw-bold" style={{ minWidth: "80px" }}>
                        ${item.subtotal.toFixed(2)}
                      </span>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemove(item.productId, item.title)}
                        disabled={busy}
                      >
                        {removingId === item.productId ? (
                          <span className="spinner-border spinner-border-sm" role="status" />
                        ) : (
                          "Remove"
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
