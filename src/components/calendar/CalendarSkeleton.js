"use client";

import React from "react";

const HOURS = 14;
const ROW_H = 80;

export default function CalendarSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse">
      {/* Day headers */}
      <div className="grid grid-cols-[56px_repeat(7,minmax(120px,1fr))] border-b border-gray-200 bg-gray-50/80 min-w-[900px]">
        <div className="border-r border-gray-200 h-16" />
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className="py-3 px-1 flex flex-col items-center gap-1.5 border-r border-gray-100 last:border-r-0"
          >
            <div className="h-3 w-8 bg-gray-200 rounded" />
            <div className="h-5 w-5 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>

      {/* Grid body */}
      <div className="grid grid-cols-[56px_repeat(7,minmax(120px,1fr))] max-h-[calc(100vh-260px)] overflow-hidden min-w-[900px]">
        <div className="border-r border-gray-200">
          {Array.from({ length: HOURS }, (_, i) => (
            <div key={i} className="border-b border-gray-50 relative" style={{ height: ROW_H }}>
              <div className="absolute -top-2 right-2 h-3 w-10 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
        {Array.from({ length: 7 }, (_, col) => (
          <div key={col} className="border-r border-gray-100 last:border-r-0 relative">
            {Array.from({ length: HOURS }, (_, row) => (
              <div key={row} className="border-b border-gray-50" style={{ height: ROW_H }} />
            ))}
            {col % 2 === 0 && (
              <div
                className="absolute left-1 right-1 rounded-lg bg-gray-100"
                style={{ top: ROW_H * 2 + 4, height: ROW_H - 6 }}
              />
            )}
            {col % 3 === 1 && (
              <div
                className="absolute left-1 right-1 rounded-lg bg-gray-100"
                style={{ top: ROW_H * 4 + 4, height: ROW_H - 6 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
