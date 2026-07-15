"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getProducts } from "@/services/product";
import type { Product } from "@/types/product";
import LogoMark from "@/components/LogoMark";

const features = [
  {
    icon: "bi-shield-lock",
    title: "Secure Authentication",
    description: "JWT-based authentication with encrypted passwords and secure token management.",
  },
  {
    icon: "bi-box-seam",
    title: "Inventory Management",
    description: "Real-time stock tracking with automatic decrement on order placement.",
  },
  {
    icon: "bi-lightning-charge",
    title: "Fast Checkout",
    description: "Streamlined checkout process with instant order confirmation.",
  },
  {
    icon: "bi-receipt",
    title: "Order History",
    description: "Complete order tracking with detailed status and item information.",
  },
];

const techStack = [
  { name: "Next.js", color: "#000000" },
  { name: "NestJS", color: "#E0234E" },
  { name: "Prisma", color: "#2D3748" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Bootstrap", color: "#7952B3" },
  { name: "JWT", color: "#D63AFF" },
  { name: "Docker", color: "#2496ED" },
];

const stats = [
  { value: "200+", label: "Products" },
  { value: "JWT", label: "Authentication" },
  { value: "Real-time", label: "Stock Validation" },
  { value: "Full", label: "Order Management" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await getProducts({ limit: 4 });
        if (!cancelled) {
          setProducts(res.data);
        }
      } catch {
        // silently ignore
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="hero-section">
        <div className="container">
          <div className="d-flex justify-content-center mb-4">
            <LogoMark size={64} />
          </div>
          <h1 className="display-4 fw-bold mb-3">
            <span style={{ color: "var(--primary)" }}>Shop</span>
            <span style={{ color: "var(--purple)" }}>IT</span>
          </h1>
          <p className="lead mb-4" style={{ fontStyle: "italic", color: "var(--text-muted)" }}>
            Smart Shopping, Simplified
          </p>
          <p className="lead">
            A modern e-commerce platform built with Next.js, NestJS,
            Prisma, and PostgreSQL &mdash; featuring JWT authentication,
            real-time inventory management, and a streamlined checkout flow.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link href="/products" className="btn btn-primary btn-lg px-4">
              Shop Now
            </Link>
            {isAuthenticated && (
              <Link href="/orders" className="btn btn-outline-secondary btn-lg px-4">
                View Orders
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="mb-5">
          <h2 className="section-heading">Featured Products</h2>
          <div className="row g-4">
            {products.map((product) => (
              <div key={product.id} className="col-sm-6 col-lg-3">
                <div className="product-card h-100">
                  <div className="card-img-top-wrapper">
                    {product.thumbnail && (
                      <img
                        src={product.thumbnail}
                        className="card-img-top"
                        alt={product.title}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="card-body">
                    <span className="badge bg-secondary mb-2 align-self-start">
                      {product.category}
                    </span>
                    <h6 className="card-title">{product.title}</h6>
                    {product.rating !== null && (
                      <p className="product-rating small mb-1">
                        <span className="text-warning">
                          {"★".repeat(Math.round(product.rating))}
                        </span>{" "}
                        <span className="text-muted">({product.rating})</span>
                      </p>
                    )}
                    <p className="product-price mb-3">${product.price.toFixed(2)}</p>
                    <Link
                      href={`/products/${product.id}`}
                      className="btn btn-outline-primary w-100"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link href="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="mb-5 py-5 bg-light rounded-3">
        <h2 className="section-heading">Why Choose ShopIT</h2>
        <div className="row g-4">
          {features.map((f) => (
            <div key={f.title} className="col-sm-6 col-lg-3">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="feature-icon">
                    <i className={`bi ${f.icon}`} />
                  </div>
                  <h5 className="card-title">{f.title}</h5>
                  <p className="card-text text-muted">{f.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-5">
        <h2 className="section-heading">Tech Stack</h2>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {techStack.map((t) => (
            <span
              key={t.name}
              className="badge fs-6 px-3 py-2"
              style={{ backgroundColor: t.color }}
            >
              {t.name}
            </span>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="mb-5 py-5 bg-dark text-white rounded-3">
        <div className="row g-4 text-center">
          {stats.map((s) => (
            <div key={s.label} className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section mb-5">
        <h2 className="mb-3 fw-bold">Ready to Start Shopping?</h2>
        <p className="text-muted mb-4">
          Browse our catalog of products and enjoy a seamless shopping experience with ShopIT.
        </p>
        <Link href="/products" className="btn btn-primary btn-lg px-5">
          Explore Products
        </Link>
      </section>
    </div>
  );
}
