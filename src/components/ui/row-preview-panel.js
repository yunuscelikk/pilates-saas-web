"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function RowPreviewPanel({
  open,
  onOpenChange,
  title,
  children,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-md">
        <div className="px-6 pt-6 pb-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="px-6 py-4 space-y-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

export function PreviewField({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900">{value || "—"}</dd>
    </div>
  );
}
