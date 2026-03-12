"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const ToggleSwitch = forwardRef(function ToggleSwitch(
  { label, name, disabled = false, className, ...props },
  ref,
) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <div className="relative inline-flex">
        <input
          type="checkbox"
          ref={ref}
          name={name}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div className="h-5 w-9 rounded-full bg-gray-200 transition-colors peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2" />
        <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
    </label>
  );
});

export default ToggleSwitch;
