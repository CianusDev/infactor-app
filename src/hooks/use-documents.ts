"use client";

import { useState, useEffect, useCallback } from "react";
import { getDocuments } from "@/services/document.service";
import {
  DocumentQueryInput,
  DocumentSortBy,
  SortOrder,
  DocumentWithItems,
  DocumentsResponse,
} from "@/types/document";
import { toast } from "sonner";

export interface UseDocumentsOptions {
  initialQuery?: DocumentQueryInput;
  autoFetch?: boolean;
}

export interface UseDocumentsReturn {
  documents: DocumentWithItems[];
  total: number;
  limit: number;
  offset: number;
  isLoading: boolean;
  error: string | null;
  query: DocumentQueryInput;
  setQuery: (query: DocumentQueryInput) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setSortBy: (sortBy: DocumentSortBy | undefined) => void;
  setSortOrder: (sortOrder: SortOrder | undefined) => void;
  refetch: () => Promise<void>;
}

export function useDocuments(
  options: UseDocumentsOptions = {},
): UseDocumentsReturn {
  const { initialQuery = {}, autoFetch = true } = options;

  const [documents, setDocuments] = useState<DocumentWithItems[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(initialQuery.limit || 20);
  const [offset, setOffset] = useState(initialQuery.offset || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQueryState] = useState<DocumentQueryInput>(initialQuery);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getDocuments(query);

      if (result.success && result.data) {
        const data = result.data as DocumentsResponse;
        setDocuments(data.data || []);
        setTotal(data.total || 0);
        setLimit(data.limit || 20);
        setOffset(data.offset || 0);
      } else {
        const errorMessage =
          result.message || "Erreur lors de la récupération des documents";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = "Une erreur inattendue s'est produite";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("useDocuments error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (autoFetch) {
      fetchDocuments();
    }
  }, [autoFetch, fetchDocuments]);

  const setQuery = useCallback((newQuery: DocumentQueryInput) => {
    setQueryState(newQuery);
  }, []);

  const setSearch = useCallback((search: string) => {
    setQueryState((prev) => ({
      ...prev,
      search: search || undefined,
      offset: 0,
    }));
  }, []);

  const setPage = useCallback(
    (page: number) => {
      const newOffset = (page - 1) * limit;
      setQueryState((prev) => ({ ...prev, offset: newOffset }));
    },
    [limit],
  );

  const setSortBy = useCallback((sortBy: DocumentSortBy | undefined) => {
    setQueryState((prev) => ({ ...prev, sortBy }));
  }, []);

  const setSortOrder = useCallback((sortOrder: SortOrder | undefined) => {
    setQueryState((prev) => ({ ...prev, sortOrder }));
  }, []);

  const refetch = useCallback(async () => {
    await fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    total,
    limit,
    offset,
    isLoading,
    error,
    query,
    setQuery,
    setSearch,
    setPage,
    setSortBy,
    setSortOrder,
    refetch,
  };
}
