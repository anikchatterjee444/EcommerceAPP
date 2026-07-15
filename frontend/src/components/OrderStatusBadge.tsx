const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-warning text-dark" },
  COMPLETED: { label: "Completed", className: "bg-success" },
  CANCELLED: { label: "Cancelled", className: "bg-danger" },
};

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-secondary",
  };

  return (
    <span
      className={`badge ${config.className}`}
      style={{ fontSize: "0.75rem", padding: "0.35em 0.7em" }}
    >
      {config.label}
    </span>
  );
}
