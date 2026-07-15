interface LogoMarkProps {
  size?: number;
  className?: string;
}

export default function LogoMark({ size = 32, className = "" }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Cart body */}
      <path
        d="M6 8h3l1.5 15h13l2-10H11"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cart wheels */}
      <circle cx="14" cy="27" r="2.5" fill="#2563EB" />
      <circle cx="23" cy="27" r="2.5" fill="#2563EB" />
      {/* Lightning bolt */}
      <path
        d="M16 12l-2.5 6h5l-2.5 6"
        stroke="#7C3AED"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
