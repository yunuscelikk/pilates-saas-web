"use client";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  confirmed: { label: "Onaylandı", color: "bg-green-50 text-green-600", icon: CheckCircle },
  waitlisted: { label: "Bekleme Listesi", color: "bg-yellow-50 text-yellow-600", icon: AlertCircle },
  cancelled: { label: "İptal", color: "bg-red-50 text-red-600", icon: X },
  no_show: { label: "Katılmadı", color: "bg-gray-50 text-gray-600", icon: X },
};

export default function BookingCard({ booking, onCancel, showCancel = false }) {
  const session = booking.ClassSession;
  const cls = session?.Class;
  const trainer = session?.Trainer;
  const startTime = session ? new Date(session.start_time) : null;
  const status = statusConfig[booking.status] || statusConfig.confirmed;
  const StatusIcon = status.icon;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{cls?.name}</h3>
          {trainer && (
            <p className="mt-0.5 text-sm text-gray-500">
              {trainer.first_name} {trainer.last_name}
            </p>
          )}
        </div>
        <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", status.color)}>
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </span>
      </div>
      {startTime && (
        <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
          <Clock className="h-3.5 w-3.5" />
          {format(startTime, "d MMM yyyy, HH:mm", { locale: tr })}
        </div>
      )}
      {showCancel && booking.status === "confirmed" && (
        <button
          onClick={() => onCancel?.(booking.id)}
          className="mt-3 w-full rounded-lg border border-red-200 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Rezervasyonu İptal Et
        </button>
      )}
    </div>
  );
}
