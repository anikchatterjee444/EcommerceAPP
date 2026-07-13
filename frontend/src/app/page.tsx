import Link from "next/link";

export default function Home() {
  const cards = [
    { title: "Products", description: "Browse our catalog", href: "/products" },
    { title: "Cart", description: "View your cart", href: "/cart" },
    { title: "Orders", description: "Track your orders", href: "/orders" },
    { title: "Login", description: "Sign in to your account", href: "/login" },
  ];

  return (
    <div className="row g-4">
      {cards.map((card) => (
        <div key={card.href} className="col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{card.title}</h5>
              <p className="card-text text-muted">{card.description}</p>
              <Link href={card.href} className="btn btn-primary mt-auto">
                Go to {card.title}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
