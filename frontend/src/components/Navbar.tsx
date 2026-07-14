"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading, logout } = useAuth();

  const isActive = (path: string) =>
    pathname === path ? "nav-link active" : "nav-link";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">
          E-Commerce
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={isActive("/products")} href="/products">
                Products
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className={isActive("/cart")} href="/cart">
                    Cart
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={isActive("/orders")} href="/orders">
                    Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={isActive("/profile")} href="/profile">
                    Profile
                  </Link>
                </li>
              </>
            )}
            {!loading &&
              (isAuthenticated ? (
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className={isActive("/login")} href="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={isActive("/register")}
                      href="/register"
                    >
                      Register
                    </Link>
                  </li>
                </>
              ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
