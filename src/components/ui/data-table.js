"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import DataTablePagination from "@/components/ui/data-table-pagination";
import Checkbox from "@/components/ui/checkbox";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Creates a selection column definition for row selection.
 */
export function getSelectionColumn() {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tümünü seç"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Satırı seç"
      />
    ),
    enableSorting: false,
    size: 40,
  };
}

/**
 * DataTable — reusable TanStack Table wrapper.
 *
 * @param {object} props
 * @param {import("@tanstack/react-table").ColumnDef[]} props.columns
 * @param {any[]} props.data
 * @param {object} [props.meta] — server pagination meta ({ page, totalPages, total, hasNextPage, hasPrevPage })
 * @param {(page: number) => void} [props.onPageChange]
 * @param {boolean} [props.isLoading]
 * @param {object} [props.emptyState] — { icon, title, description, children }
 * @param {boolean} [props.enableRowSelection]
 * @param {object} [props.rowSelection] — controlled row selection state
 * @param {(state: object) => void} [props.onRowSelectionChange]
 * @param {(row: any) => string} [props.getRowId]
 */
export default function DataTable({
  columns,
  data,
  meta,
  onPageChange,
  isLoading,
  emptyState,
  enableRowSelection = false,
  rowSelection = {},
  onRowSelectionChange,
  getRowId,
}) {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection,
    getRowId,
    manualPagination: true,
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <TableSkeleton rows={5} cols={columns.length} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    if (emptyState) {
      return (
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
        >
          {emptyState.children}
        </EmptyState>
      );
    }
    return null;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={
                    header.column.getSize() !== 150
                      ? { width: header.column.getSize() }
                      : undefined
                  }
                  className={cn(
                    header.column.getCanSort() && "cursor-pointer select-none",
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getCanSort() && (
                        <span className="ml-1 text-gray-400">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {meta && onPageChange && (
        <DataTablePagination
          meta={meta}
          onPageChange={onPageChange}
          selectedCount={
            enableRowSelection
              ? table.getFilteredSelectedRowModel().rows.length
              : 0
          }
          totalCount={table.getFilteredRowModel().rows.length}
        />
      )}
    </div>
  );
}
