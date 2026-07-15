interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const heights = { sm: 32, md: 40, lg: 48 };
  const h = heights[size];

  return (
    <span className={`d-inline-flex align-items-center ${className}`} style={{ height: h }}>
      <svg
        viewBox="0 0 200 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: h, width: "auto" }}
        aria-hidden="true"
      >
        {/* Cart body */}
        <path
          d="M8 12h4l2 20h18l3-14H14"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Cart wheels */}
        <circle cx="18" cy="38" r="3" fill="#2563EB" />
        <circle cx="31" cy="38" r="3" fill="#2563EB" />
        {/* Lightning bolt inside cart */}
        <path
          d="M22 18l-3 7h6l-3 7"
          stroke="#7C3AED"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* ShopIT text */}
        <text
          x="42"
          y="32"
          fontFamily="Segoe UI, system-ui, -apple-system, sans-serif"
          fontSize="26"
          fontWeight="700"
          letterSpacing="-0.5"
        >
          <tspan fill="#2563EB">Shop</tspan>
          <tspan fill="#7C3AED">IT</tspan>
        </text>
      </svg>
    </span>
  );
}
