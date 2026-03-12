"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Select = forwardRef(function Select(
  { label, error, className, id, children, description, ...props },
  ref,
) {
  const selectId = id || props.name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-300 focus-visible:ring-red-500"
            : "border-gray-300 focus-visible:ring-brand",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
});

export default Select;
