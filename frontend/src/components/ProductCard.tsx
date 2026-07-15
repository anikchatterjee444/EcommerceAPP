import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

function getStockInfo(stock: number) {
  if (stock === 0) return { label: "Out of Stock", className: "out-of-stock" };
  if (stock <= 5) return { label: `Only ${stock} left`, className: "low-stock" };
  return { label: `${stock} in stock`, className: "in-stock" };
}

export default function ProductCard({ product }: ProductCardProps) {
  const stockInfo = getStockInfo(product.stock);

  return (
    <div className="product-card">
      <div className="card-img-top-wrapper">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            className="card-img-top"
            alt={product.title}
            loading="lazy"
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center bg-light"
            style={{ height: "220px" }}
          >
            <i className="bi bi-image text-muted" style={{ fontSize: "2rem" }}></i>
          </div>
        )}
      </div>
      <div className="card-body">
        <span className="badge bg-secondary mb-2 align-self-start">
          {product.category}
        </span>
        <h5 className="card-title">{product.title}</h5>
        {product.rating !== null && (
          <p className="product-rating mb-1">
            <span className="text-warning">
              {"★".repeat(Math.round(product.rating))}
            </span>{" "}
            <span className="text-muted">({product.rating})</span>
          </p>
        )}
        <p className={`product-stock ${stockInfo.className} mb-2`}>
          {stockInfo.label}
        </p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <Link
          href={`/products/${product.id}`}
          className="btn btn-outline-primary w-100"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
