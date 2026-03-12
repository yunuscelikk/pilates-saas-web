"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white shadow hover:bg-brand-dark",
        secondary: "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200",
        danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
        ghost: "text-gray-700 hover:bg-gray-100",
        outline:
          "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-10 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

const Button = forwardRef(function Button(
  {
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    disabled = false,
    children,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Comp>
  );
});

export { Button, buttonVariants };
export default Button;
