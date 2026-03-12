"use client";

import Button from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * DataTablePagination — works with server-side API meta.
 *
 * @param {object} props
 * @param {object} props.meta — { page, totalPages, total, hasNextPage, hasPrevPage, limit }
 * @param {(page: number) => void} props.onPageChange
 * @param {number} [props.selectedCount]
 * @param {number} [props.totalCount]
 */
export default function DataTablePagination({
  meta,
  onPageChange,
  selectedCount = 0,
  totalCount = 0,
}) {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages, total, hasPrevPage, hasNextPage } = meta;
  const limit = meta.limit || 20;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-gray-500">
        {selectedCount > 0 ? (
          <span>
            <span className="font-medium text-gray-900">{selectedCount}</span> /{" "}
            {totalCount} satır seçili
          </span>
        ) : (
          <span>
            Toplam <span className="font-medium text-gray-900">{total}</span>{" "}
            kayıttan{" "}
            <span className="font-medium text-gray-900">
              {from}-{to}
            </span>{" "}
            gösteriliyor
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          className="h-8 w-8"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-3 text-sm text-gray-700">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className="h-8 w-8"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
