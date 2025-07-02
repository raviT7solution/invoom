import { useState } from "react";

export const useTableState = <T, P extends { page: number; perPage: number }>(
  initialFilters: T,
  initialPagination: P,
) => {
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState(initialPagination);

  const updateFilters = (i: Partial<T>) => {
    setFilters((j) => ({ ...j, ...i }));
    setPagination((j) => ({ ...j, page: 1 }));
  };

  return {
    filters,
    pagination,
    setFilters: updateFilters,
    setPagination,
  };
};
