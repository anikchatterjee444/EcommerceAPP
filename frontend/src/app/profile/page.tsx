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
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <h1 className="mb-4">My Profile</h1>

        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center gap-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: "80px",
                  height: "80px",
                  fontSize: "2rem",
                  backgroundColor: "#0d6efd",
                }}
              >
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
                <h5 className="card-title">Account Information</h5>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <strong>Name:</strong> {user?.name || "N/A"}
                  </li>
                  <li className="mb-2">
                    <strong>Email:</strong> {user?.email}
                  </li>
                  <li className="mb-2">
                    <strong>User ID:</strong> {user?.id}
                  </li>
                  <li>
                    <strong>Joined:</strong>{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Recent Activity</h5>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <strong>Orders Placed:</strong>{" "}
                    {orderCount !== null ? orderCount : "N/A"}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Authentication Status</h5>
                <span className="badge bg-success fs-6">
                  Authenticated
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card sticky-top" style={{ top: "80px" }}>
          <div className="card-body d-flex flex-column gap-2">
            <Link
              href="/products"
              className="btn btn-primary w-100"
            >
              Continue Shopping
            </Link>
            <Link
              href="/orders"
              className="btn btn-outline-primary w-100"
            >
              View Orders
            </Link>
            <button
              className="btn btn-outline-danger w-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
