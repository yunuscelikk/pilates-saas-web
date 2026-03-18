"use client";

import { format, addDays, isSameDay } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function DaySelector({ selectedDate, onSelect, days = 8 }) {
  const today = new Date();
  const dateList = Array.from({ length: days }, (_, i) => addDays(today, i));

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {dateList.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, today);
        return (
          <button
            key={date.toISOString()}
            onClick={() => onSelect(date)}
            className={cn(
              "flex min-w-[4rem] flex-col items-center rounded-xl px-3 py-2 text-sm transition-colors",
              isSelected
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            <span className="text-xs font-medium uppercase">
              {isToday ? "Bugün" : format(date, "EEE", { locale: tr })}
            </span>
            <span className="text-lg font-semibold">{format(date, "d")}</span>
            <span className="text-xs">{format(date, "MMM", { locale: tr })}</span>
          </button>
        );
      })}
    </div>
  );
}
