import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  pageCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

export function DataTable<T>({ 
  data, 
  columns, 
  isLoading, 
  pageCount = 1, 
  currentPage = 1, 
  onPageChange,
  emptyStateTitle = "No results found",
  emptyStateDescription = "Try adjusting your filters or search query."
}: DataTableProps<T>) {

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-[#1a1d2e] rounded-xl border border-white/5 shadow-xl backdrop-blur-sm">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#1a1d2e] rounded-xl border border-white/5 shadow-xl backdrop-blur-sm p-8">
        <EmptyState title={emptyStateTitle} subtitle={emptyStateDescription} />
      </div>
    );
  }

  return (
    <div className="bg-[#1a1d2e] rounded-xl border border-white/5 shadow-xl overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-black/20 border-b border-white/5 hover:bg-black/20">
            <TableRow className="hover:bg-transparent border-white/5">
              {columns.map((col, i) => (
                <TableHead key={i} className="text-xs font-medium text-gray-400 uppercase tracking-wider py-4">
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className="border-white/5 hover:bg-white/[0.02] transition-colors group"
              >
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} className="py-4 align-middle">
                    {col.cell ? col.cell(row) : String(col.accessorKey ? row[col.accessorKey] : '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-black/10">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {pageCount}
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => onPageChange?.(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronsLeft size={16} />
            </button>
            <button 
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => onPageChange?.(pageCount)}
              disabled={currentPage === pageCount}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
