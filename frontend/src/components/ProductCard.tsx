import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card h-100">
      {product.thumbnail && (
        <img
          src={product.thumbnail}
          className="card-img-top"
          alt={product.title}
          style={{ height: "200px", objectFit: "cover" }}
          loading="lazy"
        />
      )}
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary mb-2 align-self-start">
          {product.category}
        </span>
        <h5 className="card-title">{product.title}</h5>
        {product.rating !== null && (
          <p className="text-warning mb-1">
            {"★".repeat(Math.round(product.rating))}{" "}
            <span className="text-muted">({product.rating})</span>
          </p>
        )}
        <p className="text-muted small mb-2">
          Stock: {product.stock}
        </p>
        <p className="fw-bold mb-3">${product.price.toFixed(2)}</p>
        <Link
          href={`/products/${product.id}`}
          className="btn btn-outline-primary mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
