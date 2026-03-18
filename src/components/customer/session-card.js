"use client";

import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SessionCard({ session, onBook }) {
  const startTime = new Date(session.start_time);
  const endTime = new Date(session.end_time);
  const cls = session.Class;
  const trainer = session.Trainer;
  const capacity = cls?.max_capacity || 0;
  const current = session.current_capacity || 0;
  const isFull = current >= capacity;

  return (
    <button
      onClick={() => onBook?.(session)}
      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{cls?.name}</h3>
          {trainer && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
              <User className="h-3.5 w-3.5" />
              {trainer.first_name} {trainer.last_name}
            </p>
          )}
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            isFull
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600",
          )}
        >
          <Users className="mr-1 inline h-3 w-3" />
          {current}/{capacity}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
        </span>
        {cls?.duration_minutes && (
          <span className="text-gray-400">{cls.duration_minutes} dk</span>
        )}
      </div>
    </button>
  );
}
