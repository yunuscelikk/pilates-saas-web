"use client";

import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export default function Avatar({ name, className, size = "md" }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-brand-light font-medium text-primary-800",
        sizes[size],
        className,
      )}
    >
      {initials || <User className="h-4 w-4" />}
    </div>
  );
}
