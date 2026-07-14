"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/services/order";
import type { Order } from "@/types/order";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getOrders();
        if (!cancelled) {
          setOrders(data);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load orders.");
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

  if (orders.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="fs-1 mb-3">&#128230;</div>
        <h2>No orders yet.</h2>
        <p className="text-muted">Your order history will appear here.</p>
        <Link href="/products" className="btn btn-primary mt-2">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">My Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="card mb-3">
          <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <h5 className="card-title mb-1">Order #{order.id}</h5>
              <p className="text-muted mb-1">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="mb-1">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="fw-bold fs-5">
                ${order.totalAmount.toFixed(2)}
              </span>
              <Link
                href={`/orders/${order.id}`}
                className="btn btn-outline-primary btn-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
