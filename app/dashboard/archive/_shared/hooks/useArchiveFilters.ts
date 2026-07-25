"use client";

import { useSearchParams } from "next/navigation";

export const ARCHIVE_QUERY_NAME = "name";
export const ARCHIVE_QUERY_PARISH = "parish";

export function useArchiveFilters() {
  const searchParams = useSearchParams();
  return {
    name: searchParams.get(ARCHIVE_QUERY_NAME) ?? "",
    parishId: searchParams.get(ARCHIVE_QUERY_PARISH) ?? "",
  };
}
