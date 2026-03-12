"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  { label, error, description, className, ...props },
  ref,
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {description && <p className="text-xs text-gray-500">{description}</p>}
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
});

export default Textarea;
