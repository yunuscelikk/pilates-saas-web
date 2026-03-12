"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./button";

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages, hasNextPage, hasPrevPage, total } = meta;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-sm text-gray-500">
        Toplam <span className="font-medium text-gray-700">{total}</span> kayıt
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-[80px] text-center text-sm font-medium text-gray-700">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
