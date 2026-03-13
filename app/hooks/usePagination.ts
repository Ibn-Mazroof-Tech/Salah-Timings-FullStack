"use client";

import { useMemo } from "react";

export function usePagination<T>(items: T[], page: number, pageSize: number) {
  return useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const clampedPage = Math.min(page, totalPages);
    const start = (clampedPage - 1) * pageSize;
    return {
      totalPages,
      clampedPage,
      list: items.slice(start, start + pageSize)
    };
  }, [items, page, pageSize]);
}
