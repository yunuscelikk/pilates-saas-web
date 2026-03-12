"use client";

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        success: "border-green-200 bg-green-50 text-green-700",
        danger: "border-red-200 bg-red-50 text-red-700",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
        info: "border-primary-200 bg-brand-light text-primary-800",
        default: "border-gray-200 bg-gray-50 text-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export default function Badge({ children, variant, className }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}

export { badgeVariants };
