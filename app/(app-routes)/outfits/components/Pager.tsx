"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PagerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pager({ currentPage, totalPages, onPageChange }: PagerProps) {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 4) {
        // Show pages 2, 3, 4, 5 and ellipsis
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show ellipsis and last 5 pages
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show ellipsis, current page area, ellipsis
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-1 py-4 bg-primary z-50">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
        <ChevronLeft className="w-4 h-4 text-gray-600 -ml-2" />
      </button>

      {/* Page numbers */}
      {visiblePages.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="flex items-center justify-center w-10 h-10 text-gray-500 text-sm">
              ...
            </span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-colors ${
                currentPage === page
                  ? 'text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
              style={currentPage === page ? { backgroundColor: '#4A3427' } : {}}
            >
              {page}
            </button>
          )}
        </div>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
        <ChevronRight className="w-4 h-4 text-gray-600 -ml-2" />
      </button>
    </div>
  );
}
