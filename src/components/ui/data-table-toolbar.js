"use client";

import Button from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * DataTableToolbar — search, filters, and bulk actions.
 *
 * @param {object} props
 * @param {string} [props.searchValue]
 * @param {(value: string) => void} [props.onSearchChange]
 * @param {(e: Event) => void} [props.onSearchSubmit]
 * @param {string} [props.searchPlaceholder]
 * @param {React.ReactNode} [props.filters] — additional filter elements (selects, date inputs)
 * @param {number} [props.selectedCount] — number of selected rows
 * @param {React.ReactNode} [props.bulkActions] — actions to show when rows are selected
 * @param {() => void} [props.onClearSelection]
 */
export default function DataTableToolbar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = "Ara...",
  filters,
  selectedCount = 0,
  bulkActions,
  onClearSelection,
}) {
  if (selectedCount > 0 && bulkActions) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-primary-200 bg-brand-light px-4 py-2.5">
        <span className="text-sm font-medium text-primary-800">
          {selectedCount} satır seçili
        </span>
        <div className="flex items-center gap-2">
          {bulkActions}
          {onClearSelection && (
            <Button variant="ghost" size="sm" onClick={onClearSelection}>
              <X className="h-4 w-4" />
              Seçimi Temizle
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {onSearchSubmit && (
        <form onSubmit={onSearchSubmit} className="flex gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <Button type="submit" variant="secondary">
            Ara
          </Button>
        </form>
      )}
      {filters && (
        <div className="flex flex-wrap items-center gap-2">{filters}</div>
      )}
    </div>
  );
}
