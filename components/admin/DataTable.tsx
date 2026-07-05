"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  isLoading?: boolean;
  emptyStateText?: string;
  bulkActionTrigger?: (selectedRows: T[]) => React.ReactNode;
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchKey,
  isLoading = false,
  emptyStateText = "No records found.",
  bulkActionTrigger,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Handle Select All Checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(currentPageItems.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Handle Single Checkbox
  const handleSelectRow = (id: string, checked: boolean) => {
    const updated = new Set(selectedIds);
    if (checked) {
      updated.add(id);
    } else {
      updated.delete(id);
    }
    setSelectedIds(updated);
  };

  // Filter Data
  const filteredData = React.useMemo(() => {
    if (!searchTerm || !searchKey) return data;
    return data.filter((item) => {
      const val = item[searchKey];
      if (val === undefined || val === null) return false;
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchKey]);

  // Sort Data
  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginate Data
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const currentPageItems = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key: keyof T | string, sortable?: boolean) => {
    if (!sortable) return;

    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Get selected objects
  const selectedRows = data.filter((item) => selectedIds.has(item.id));

  return (
    <div className="space-y-4">
      {/* Header controls: Search & Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {searchKey ? (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
                setSelectedIds(new Set());
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-sage-200 bg-white text-sm text-sage-900 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
            />
          </div>
        ) : (
          <div />
        )}

        {selectedIds.size > 0 && bulkActionTrigger && (
          <div className="w-full sm:w-auto">
            {bulkActionTrigger(selectedRows)}
          </div>
        )}
      </div>

      {/* Table Frame */}
      <div className="w-full overflow-x-auto rounded-2xl border border-sage-100 bg-white shadow-sm shadow-sage-950/5">
        <table className="w-full border-collapse text-left text-sm text-sage-600">
          <thead className="bg-sage-50 border-b border-sage-100 text-xs font-bold uppercase tracking-wider text-sage-700">
            <tr>
              {/* Checkbox Header */}
              {bulkActionTrigger && (
                <th className="py-4 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={
                      currentPageItems.length > 0 &&
                      currentPageItems.every((item) => selectedIds.has(item.id))
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                  />
                </th>
              )}

              {/* Columns headers */}
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(column.accessorKey, column.sortable)}
                  className={cn(
                    "py-4 px-6 select-none",
                    column.sortable && "cursor-pointer hover:bg-sage-100/50 transition-colors"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{column.header}</span>
                    {column.sortable && sortKey === column.accessorKey && (
                      <span>
                        {sortDirection === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5 text-sage-500" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-sage-500" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-sage-50">
            {isLoading ? (
              // Loading State Skeletons
              Array.from({ length: itemsPerPage }).map((_, rIdx) => (
                <tr key={rIdx}>
                  {bulkActionTrigger && <td className="py-4 px-6"><div className="h-4 w-4 bg-sage-100 rounded animate-pulse" /></td>}
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-6">
                      <div className="h-4 bg-sage-100 rounded animate-pulse w-full max-w-[120px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : currentPageItems.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length + (bulkActionTrigger ? 1 : 0)} className="py-12 text-center text-sage-400">
                  {emptyStateText}
                </td>
              </tr>
            ) : (
              // Data Rows
              currentPageItems.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "hover:bg-sage-50/30 transition-colors",
                    selectedIds.has(row.id) && "bg-sage-50/50"
                  )}
                >
                  {/* Select Row Checkbox */}
                  {bulkActionTrigger && (
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                        className="h-4 w-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                      />
                    </td>
                  )}

                  {/* Render Cells */}
                  {columns.map((column, cIdx) => {
                    const cellVal = (row as any)[column.accessorKey];
                    return (
                      <td key={cIdx} className="py-4 px-6 text-sage-900 font-medium">
                        {column.cell ? column.cell(row) : String(cellVal ?? "")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {!isLoading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between px-2">
          {/* Row selection status */}
          <div className="text-xs text-sage-500 font-medium">
            {bulkActionTrigger && selectedIds.size > 0 ? (
              <span>Selected {selectedIds.size} of {totalItems} rows</span>
            ) : (
              <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} records</span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-sage-500 font-medium">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                  setSelectedIds(new Set());
                }}
                className="text-xs font-semibold text-sage-700 bg-white border border-sage-200 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-sage-500"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-sage-200 text-sage-600 hover:bg-sage-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-sage-700 select-none">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-sage-200 text-sage-600 hover:bg-sage-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
