"use client";

import React, { useMemo, useCallback } from "react";
import { format, isSameDay, isToday } from "date-fns";
import { tr } from "date-fns/locale";
import SessionCard from "@/components/calendar/SessionCard";
import { cn } from "@/lib/utils";

const HOUR_START = 7;
const HOUR_END = 21;
const HOUR_HEIGHT = 80;
const HOURS = Array.from(
  { length: HOUR_END - HOUR_START },
  (_, i) => HOUR_START + i,
);

function getSessionPosition(session) {
  const start = new Date(session.start_time);
  const end = new Date(session.end_time);
  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();
  const top = ((startMinutes - HOUR_START * 60) / 60) * HOUR_HEIGHT;
  const height = Math.max(((endMinutes - startMinutes) / 60) * HOUR_HEIGHT, 44);
  return { top, height };
}

export default function CalendarGrid({
  days,
  sessions,
  onSessionClick,
  onSlotClick,
}) {
  const sessionsByDay = useMemo(() => {
    const map = new Map();
    days.forEach((day) => {
      const daySessions = sessions
        .filter((s) => isSameDay(new Date(s.start_time), day))
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      map.set(day.toDateString(), daySessions);
    });
    return map;
  }, [days, sessions]);

  const handleSlotClick = useCallback(
    (day, hour) => {
      if (!onSlotClick) return;
      const date = new Date(day);
      date.setHours(hour, 0, 0, 0);
      onSlotClick(date);
    },
    [onSlotClick],
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
      {/* Day headers - sticky */}
      <div className="grid grid-cols-[56px_repeat(7,minmax(120px,1fr))] border-b border-gray-200 bg-gray-50/80 sticky top-0 z-10 min-w-[900px]">
        <div className="border-r border-gray-200" />
        {days.map((day, i) => {
          const today = isToday(day);
          return (
            <div
              key={i}
              className={cn(
                "py-3 px-1 text-center border-r border-gray-100 last:border-r-0",
                today && "bg-primary-50/60",
              )}
            >
              <div
                className={cn(
                  "text-[11px] font-medium uppercase tracking-wider",
                  today ? "text-brand" : "text-gray-400",
                )}
              >
                {format(day, "EEE", { locale: tr })}
              </div>
              <div
                className={cn(
                  "mt-1 text-sm font-semibold leading-none",
                  today
                    ? "bg-brand text-white w-7 h-7 rounded-full inline-flex items-center justify-center"
                    : "text-gray-800",
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div className="overflow-y-auto max-h-[calc(100vh-260px)]">
        <div className="grid grid-cols-[56px_repeat(7,minmax(120px,1fr))] min-w-[900px]">
          {/* Time labels */}
          <div className="border-r border-gray-200">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="relative border-b border-gray-50"
                style={{ height: HOUR_HEIGHT }}
              >
                <span className="absolute -top-2.5 right-2.5 text-[11px] font-medium text-gray-400 select-none tabular-nums">
                  {String(hour).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* Day columns with sessions */}
          {days.map((day, dayIndex) => {
            const daySessions = sessionsByDay.get(day.toDateString()) || [];
            const today = isToday(day);

            return (
              <div
                key={dayIndex}
                className={cn(
                  "relative border-r border-gray-100 last:border-r-0",
                  today && "bg-primary-50/30",
                )}
              >
                {/* Hour grid lines (clickable) */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="border-b border-gray-50 cursor-pointer hover:bg-brand-light/30 transition-colors"
                    style={{ height: HOUR_HEIGHT }}
                    onClick={() => handleSlotClick(day, hour)}
                    title={`${String(hour).padStart(2, "0")}:00 - Oturum oluştur`}
                  />
                ))}

                {/* Sessions positioned by time */}
                {daySessions.map((session) => {
                  const { top, height } = getSessionPosition(session);
                  return (
                    <div
                      key={session.id}
                      className="absolute left-1 right-1 z-[5]"
                      style={{ top: top + 1, height: height - 2 }}
                    >
                      <SessionCard
                        session={session}
                        onClick={() => onSessionClick?.(session)}
                        compact={height < 48}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
