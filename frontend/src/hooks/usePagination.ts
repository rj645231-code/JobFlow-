import { useState } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
}

export function usePagination({ initialPage = 1, initialPageSize = 20 }: UsePaginationProps = {}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const next = () => setPage((prev) => prev + 1);
  const prev = () => setPage((prev) => Math.max(1, prev - 1));
  const goToPage = (pageNumber: number) => setPage(Math.max(1, pageNumber));
  const changePageSize = (size: number) => {
    setPageSize(size);
    setPage(1); // Reset to first page when changing page size
  };

  return {
    page,
    pageSize,
    next,
    prev,
    goToPage,
    changePageSize,
    setPage,
  };
}
