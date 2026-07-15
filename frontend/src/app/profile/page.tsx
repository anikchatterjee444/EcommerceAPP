"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getOrders } from "@/services/order";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const orders = await getOrders();
        if (!cancelled) {
          setOrderCount(orders.length);
        }
      } catch {
        if (!cancelled) {
          setOrderCount(0);
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

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "?";

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 gap-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="text-muted small">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="row g-4 animate-fade-in">
      <div className="col-lg-8">
        <h1 className="mb-4">My Profile</h1>

        {/* Profile Header Card */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center gap-4">
              <div className="profile-avatar">
                {initials}
              </div>
              <div>
                <h4 className="mb-1">{user?.name || "User"}</h4>
                <p className="text-muted mb-0">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="card-title fw-semibold mb-3">
                  <i className="bi bi-person-lines-fill text-primary me-2"></i>
                  Account Information
                </h6>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">Name</span>
                    <span className="fw-medium">{user?.name || "N/A"}</span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">Email</span>
                    <span className="fw-medium">{user?.email}</span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">User ID</span>
                    <span className="fw-medium">{user?.id}</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span className="text-muted">Joined</span>
                    <span className="fw-medium">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="card-title fw-semibold mb-3">
                  <i className="bi bi-graph-up text-primary me-2"></i>
                  Recent Activity
                </h6>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex justify-content-between">
                    <span className="text-muted">Orders Placed</span>
                    <span className="fw-bold fs-5">
                      {orderCount !== null ? orderCount : "N/A"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-body d-flex align-items-center justify-content-between">
                <h6 className="card-title fw-semibold mb-0">
                  <i className="bi bi-shield-check text-success me-2"></i>
                  Authentication Status
                </h6>
                <span className="badge bg-success" style={{ fontSize: "0.8rem", padding: "0.4em 0.8em" }}>
                  Authenticated
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="order-summary-card sticky-top" style={{ top: "80px" }}>
          <div className="card-body d-flex flex-column gap-2">
            <Link
              href="/products"
              className="btn btn-primary w-100"
            >
              <i className="bi bi-bag me-1"></i> Continue Shopping
            </Link>
            <Link
              href="/orders"
              className="btn btn-outline-primary w-100"
            >
              <i className="bi bi-receipt me-1"></i> View Orders
            </Link>
            <button
              className="btn btn-outline-danger w-100"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
