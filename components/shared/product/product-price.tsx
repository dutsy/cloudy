"use client";

import { cn } from "@/lib/utils";

interface ProductPriceProps {
  value: number;
  className?: string;
}

const ProductPrice = ({ value, className }: ProductPriceProps) => {
  // Math.round() removes the decimals completely (e.g., 15.00 becomes 15)
  // If you always want to round down, you can use Math.floor(value) instead.
  const roundedValue = Math.round(value);

  return (
    <div className={cn("flex items-center", className)}>
      <span className="font-bold">&#8362;{roundedValue}</span>
    </div>
  );
};

export default ProductPrice;