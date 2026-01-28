import { useState, useCallback } from 'react';
import { QueryParams, PaginationMeta } from '../utils/types';

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination({ initialPage = 1, initialLimit = 10 }: UsePaginationProps = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const getQueryParams = useCallback((): QueryParams => {
    return {
      page,
      limit,
      ...(search && { search }),
    };
  }, [page, limit, search]);

  const goToPage = useCallback((newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  }, [meta]);

  const nextPage = useCallback(() => {
    if (meta && page < meta.totalPages) {
      setPage(page + 1);
    }
  }, [meta, page]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const updateSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset a la primera página al buscar
  }, []);

  const updateLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  return {
    page,
    limit,
    search,
    meta,
    setMeta,
    getQueryParams,
    goToPage,
    nextPage,
    prevPage,
    updateSearch,
    updateLimit,
  };
}
