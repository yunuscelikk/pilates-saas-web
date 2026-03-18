"use client";

import React from "react";
import { cn } from "@/lib/utils";

function getCapacityInfo(current, max) {
  if (max === 0) return { color: "gray", ratio: 0 };
  const ratio = current / max;
  if (ratio >= 1) return { color: "red", ratio: Math.min(ratio, 1) };
  if (ratio >= 0.8) return { color: "orange", ratio };
  return { color: "green", ratio };
}

const colorStyles = {
  green: {
    card: "bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/80",
    accent: "bg-emerald-500",
    bar: "bg-emerald-500",
    badge: "text-emerald-700",
  },
  orange: {
    card: "bg-amber-50/80 border-amber-200 hover:bg-amber-100/80",
    accent: "bg-amber-500",
    bar: "bg-amber-500",
    badge: "text-amber-700",
  },
  red: {
    card: "bg-red-50/80 border-red-200 hover:bg-red-100/80",
    accent: "bg-red-500",
    bar: "bg-red-500",
    badge: "text-red-700",
  },
  gray: {
    card: "bg-gray-50/80 border-gray-200 hover:bg-gray-100/80",
    accent: "bg-gray-400",
    bar: "bg-gray-400",
    badge: "text-gray-500",
  },
};

export default function SessionCard({ session, onClick, compact = false }) {
  const current = session.current_capacity || 0;
  const max = session.Class?.max_capacity || 0;
  const { color, ratio } = getCapacityInfo(current, max);
  const styles = colorStyles[color];

  const startTime = session.start_time.slice(11, 16);
  const endTime = session.end_time.slice(11, 16);
  const trainerName = session.Trainer
    ? `${session.Trainer.first_name} ${session.Trainer.last_name}`
    : null;

  return (
    <button
      className={cn(
        "w-full h-full flex items-stretch rounded-lg border overflow-hidden text-left transition-all",
        "hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/40",
        styles.card,
      )}
      onClick={onClick}
      aria-label={`${session.Class?.name || "Sınıf"} ${startTime}-${endTime}`}
    >
      {/* Left color accent */}
      <div className={cn("w-1 shrink-0", styles.accent)} />

      {/* Content */}
      <div className="flex flex-col py-1.5 px-2 min-w-0 flex-1 overflow-hidden">
        {/* Row 1: Class name (always visible, wraps if needed) */}
        <div className="text-[13px] font-bold text-gray-900 leading-tight line-clamp-2">
          {session.Class?.name || "Sınıf"}
        </div>

        {/* Row 2: Time + capacity inline */}
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <span className="text-[11px] font-medium text-gray-600 whitespace-nowrap">
            {startTime} – {endTime}
          </span>
          <span
            className={cn(
              "text-[11px] font-semibold whitespace-nowrap tabular-nums",
              styles.badge,
            )}
          >
            {current}/{max}
          </span>
        </div>

        {/* Row 3: Trainer (only if not compact and name exists) */}
        {!compact && trainerName && (
          <div className="text-[11px] text-gray-500 leading-tight mt-0.5 line-clamp-1">
            {trainerName}
          </div>
        )}

        {/* Row 4: Capacity bar (only if not compact) */}
        {!compact && (
          <div className="mt-auto pt-1">
            <div className="w-full h-1 rounded-full bg-gray-200/60 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", styles.bar)}
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
