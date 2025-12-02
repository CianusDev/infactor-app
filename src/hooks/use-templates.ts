"use client";

import { useState, useEffect, useCallback } from "react";
import { getTemplates, getTemplateById } from "@/services/template.service";
import { TemplateQueryInput } from "@/server/modules/template/template.schema";
import { Template, TemplatesResponse } from "@/types/template";
import { toast } from "sonner";

// ============================================
// TYPES
// ============================================

export interface UseTemplatesOptions {
  initialQuery?: TemplateQueryInput;
  autoFetch?: boolean;
}

export interface UseTemplatesReturn {
  templates: Template[];
  total: number;
  limit: number;
  offset: number;
  isLoading: boolean;
  error: string | null;
  query: TemplateQueryInput;
  setQuery: (query: TemplateQueryInput) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
  getDefaultTemplate: () => Template | undefined;
}

// ============================================
// HOOK: useTemplates
// ============================================

export function useTemplates(
  options: UseTemplatesOptions = {},
): UseTemplatesReturn {
  const { initialQuery = {}, autoFetch = true } = options;

  const [templates, setTemplates] = useState<Template[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(initialQuery.limit || 20);
  const [offset, setOffset] = useState(initialQuery.offset || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQueryState] = useState<TemplateQueryInput>(initialQuery);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getTemplates(query);

      if (result.success && result.data) {
        const data = result.data as TemplatesResponse;
        setTemplates(data.data || []);
        setTotal(data.total || 0);
        setLimit(data.limit || 20);
        setOffset(data.offset || 0);
      } else {
        const errorMessage =
          result.message || "Erreur lors de la récupération des modèles";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = "Une erreur inattendue s'est produite";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("useTemplates error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (autoFetch) {
      fetchTemplates();
    }
  }, [autoFetch, fetchTemplates]);

  const setQuery = useCallback((newQuery: TemplateQueryInput) => {
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

  const refetch = useCallback(async () => {
    await fetchTemplates();
  }, [fetchTemplates]);

  const getDefaultTemplate = useCallback(() => {
    return templates.find((t) => t.isDefault);
  }, [templates]);

  return {
    templates,
    total,
    limit,
    offset,
    isLoading,
    error,
    query,
    setQuery,
    setSearch,
    setPage,
    refetch,
    getDefaultTemplate,
  };
}

// ============================================
// HOOK: useTemplate (single template)
// ============================================

export interface UseTemplateOptions {
  templateId?: string;
  autoFetch?: boolean;
}

export interface UseTemplateReturn {
  template: Template | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTemplate(
  options: UseTemplateOptions = {},
): UseTemplateReturn {
  const { templateId, autoFetch = true } = options;

  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplate = useCallback(async () => {
    if (!templateId) {
      setTemplate(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getTemplateById(templateId);

      if (result.success && result.data) {
        setTemplate(result.data as Template);
      } else {
        const errorMessage =
          result.message || "Erreur lors de la récupération du modèle";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = "Une erreur inattendue s'est produite";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("useTemplate error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    if (autoFetch && templateId) {
      fetchTemplate();
    }
  }, [autoFetch, templateId, fetchTemplate]);

  const refetch = useCallback(async () => {
    await fetchTemplate();
  }, [fetchTemplate]);

  return {
    template,
    isLoading,
    error,
    refetch,
  };
}
