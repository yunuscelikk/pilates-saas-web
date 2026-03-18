"use client";

import React from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";

export default function WeekNavigator({
  weekStart,
  weekEnd,
  onPrev,
  onNext,
  onToday,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-lg border border-gray-200 bg-white shadow-sm">
        <button
          className="p-2 hover:bg-gray-50 transition-colors rounded-l-lg border-r border-gray-200"
          onClick={onPrev}
          aria-label="Önceki hafta"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={onToday}
        >
          Bugün
        </button>
        <button
          className="p-2 hover:bg-gray-50 transition-colors rounded-r-lg border-l border-gray-200"
          onClick={onNext}
          aria-label="Sonraki hafta"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <h2 className="text-base font-semibold text-gray-800">
        {format(weekStart, "d MMM", { locale: tr })}
        {" – "}
        {format(weekEnd, "d MMM yyyy", { locale: tr })}
      </h2>
    </div>
  );
}
