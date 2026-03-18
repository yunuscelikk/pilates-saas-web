"use client";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CreditCard, CalendarDays, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors = {
  active: "border-green-200 bg-green-50",
  expired: "border-gray-200 bg-gray-50",
  cancelled: "border-red-200 bg-red-50",
  frozen: "border-blue-200 bg-blue-50",
};

const statusLabels = {
  active: "Aktif",
  expired: "Süresi Dolmuş",
  cancelled: "İptal",
  frozen: "Dondurulmuş",
};

export default function MembershipCard({ membership }) {
  const plan = membership.MembershipPlan;

  return (
    <div className={cn("rounded-xl border p-4", statusColors[membership.status] || "border-gray-200 bg-white")}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{plan?.name}</h3>
          <span className="mt-0.5 inline-block text-xs font-medium text-gray-500">
            {statusLabels[membership.status]}
          </span>
        </div>
        <CreditCard className="h-5 w-5 text-gray-400" />
      </div>
      <div className="mt-3 space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>
            {format(new Date(membership.start_date), "d MMM yyyy", { locale: tr })}
            {membership.end_date && ` — ${format(new Date(membership.end_date), "d MMM yyyy", { locale: tr })}`}
          </span>
        </div>
        {plan?.plan_type === "class_pack" && membership.classes_remaining != null && (
          <div className="flex items-center gap-2">
            <Hash className="h-3.5 w-3.5" />
            <span>Kalan ders: <strong>{membership.classes_remaining}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
