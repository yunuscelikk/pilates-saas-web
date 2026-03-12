"use client";

import { cn } from "@/lib/utils";

export function Table({ children, className, ...props }) {
  return (
    <div className="relative w-full overflow-auto rounded-lg border border-gray-200">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className, ...props }) {
  return (
    <thead
      className={cn("bg-gray-50/80 [&_tr]:border-b", className)}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, ...props }) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className, ...props }) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle text-xs font-medium uppercase tracking-wider text-gray-500 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className, ...props }) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-middle text-sm text-gray-700 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}
