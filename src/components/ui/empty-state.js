import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  children,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      {title && (
        <h3 className="mt-4 text-sm font-semibold text-gray-900">{title}</h3>
      )}
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
