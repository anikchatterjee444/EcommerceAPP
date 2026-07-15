"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/services/order";
import type { Order } from "@/types/order";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  );
}

function OrderDetailContent() {
  const params = useParams();
  const id = Number(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      try {
        const data = await getOrderById(id);
        if (!cancelled) {
          setOrder(data);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load order.");
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
        <span className="text-muted small">Loading order details...</span>
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

  if (!order) return null;

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="row g-4 animate-fade-in">
      <div className="col-lg-8">
        <Link
          href="/orders"
          className="btn btn-outline-secondary mb-3"
        >
          <i className="bi bi-arrow-left me-1"></i> Back to Orders
        </Link>
        <h1 className="mb-2">Order #{order.id}</h1>
        <p className="text-muted mb-4">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" "}
          <OrderStatusBadge status={order.status} />
        </p>

        {order.items.map((item, index) => (
          <div key={index} className="cart-item mb-3">
            <div className="row g-0">
              <div className="col-md-2 d-flex align-items-center justify-content-center p-2">
                {item.product.thumbnail ? (
                  <Link href={`/products/${item.product.id}`}>
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      className="rounded"
                      style={{ objectFit: "contain", width: "100px", height: "100px" }}
                    />
                  </Link>
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
                    <h6 className="card-title mb-1">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="text-decoration-none text-dark"
                      >
                        {item.product.title}
                      </Link>
                    </h6>
                    <p className="card-text text-muted small mb-0">
                      Unit Price: ${item.price.toFixed(2)}
                    </p>
                    <p className="card-text text-muted small mb-0">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <span className="fw-bold" style={{ minWidth: "80px" }}>
                    ${(item.price * item.quantity).toFixed(2)}
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
              <span>Items ({order.items.length})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="text-success fw-semibold">Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
