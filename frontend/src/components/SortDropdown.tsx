"use client";

interface SortDropdownProps {
  sort: string;
  order: "asc" | "desc";
  onSortChange: (sort: string, order: "asc" | "desc") => void;
}

const SORT_OPTIONS = [
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "rating-asc", label: "Rating (Low to High)" },
  { value: "rating-desc", label: "Rating (High to Low)" },
];

export default function SortDropdown({
  sort,
  order,
  onSortChange,
}: SortDropdownProps) {
  const currentValue = `${sort}-${order}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSort, newOrder] = e.target.value.split("-");
    onSortChange(newSort, newOrder as "asc" | "desc");
  };

  return (
    <select className="form-select" value={currentValue} onChange={handleChange}>
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
