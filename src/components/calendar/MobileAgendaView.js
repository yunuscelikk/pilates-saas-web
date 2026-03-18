"use client";

import React, { useMemo } from "react";
import { format, isSameDay, isToday } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

function getStatusDot(current, max) {
  if (max === 0) return "bg-gray-400";
  const ratio = current / max;
  if (ratio >= 1) return "bg-red-500";
  if (ratio >= 0.8) return "bg-amber-500";
  return "bg-emerald-500";
}

export default function MobileAgendaView({ days, sessions, onSessionClick }) {
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

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const daySessions = sessionsByDay.get(day.toDateString()) || [];
        const today = isToday(day);

        return (
          <div key={day.toDateString()}>
            {/* Day header */}
            <div
              className={cn(
                "flex items-center gap-2 px-1 py-2 sticky top-0 bg-gray-50 z-10",
                today && "text-brand",
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold",
                  today
                    ? "bg-brand text-white"
                    : "bg-white border border-gray-200 text-gray-700",
                )}
              >
                {format(day, "d")}
              </div>
              <div>
                <div
                  className={cn(
                    "text-sm font-semibold",
                    today ? "text-brand" : "text-gray-800",
                  )}
                >
                  {format(day, "EEEE", { locale: tr })}
                </div>
                <div className="text-xs text-gray-400">
                  {format(day, "d MMMM", { locale: tr })}
                </div>
              </div>
            </div>

            {/* Sessions */}
            {daySessions.length === 0 ? (
              <div className="ml-11 py-3 text-sm text-gray-400">
                Oturum yok
              </div>
            ) : (
              <div className="ml-11 space-y-2">
                {daySessions.map((session) => {
                  const current = session.current_capacity || 0;
                  const max = session.Class?.max_capacity || 0;
                  const startTime = session.start_time.slice(11, 16);
                  const endTime = session.end_time.slice(11, 16);

                  return (
                    <button
                      key={session.id}
                      className="w-full text-left bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow active:bg-gray-50"
                      onClick={() => onSessionClick?.(session)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "w-2 h-2 rounded-full shrink-0",
                                getStatusDot(current, max),
                              )}
                            />
                            <span className="text-sm font-semibold text-gray-900 truncate">
                              {session.Class?.name || "Sınıf"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {startTime} - {endTime}
                            </span>
                            {session.Trainer && (
                              <span className="flex items-center gap-1 truncate">
                                <User className="w-3 h-3" />
                                {session.Trainer.first_name}{" "}
                                {session.Trainer.last_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-500 shrink-0">
                          <Users className="w-3 h-3" />
                          {current}/{max}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
