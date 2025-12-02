"use server";

import { prepareDataApi } from "@/lib/utils";
import { api } from "@/server/config/axios";
import { TemplateQueryInput } from "@/server/modules/template/template.schema";
import { getToken } from "./session.service";

/**
 * Récupérer la liste des templates avec pagination et filtres
 */
export async function getTemplates(query?: TemplateQueryInput) {
  const { token } = await getToken();

  const params = new URLSearchParams();
  if (query?.search) params.append("search", query.search);
  if (query?.limit) params.append("limit", query.limit.toString());
  if (query?.offset) params.append("offset", query.offset.toString());

  const queryString = params.toString();
  const endpoint = `/templates${queryString ? `?${queryString}` : ""}`;

  const result = await api.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const status = result.status;
  const data = result.data?.data;
  const error = result.data?.error;

  return prepareDataApi(status, data, error);
}

/**
 * Récupérer un template par son ID
 */
export async function getTemplateById(templateId: string) {
  const { token } = await getToken();

  const endpoint = `/templates/${templateId}`;

  const result = await api.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const status = result.status;
  const data = result.data?.data;
  const error = result.data?.error;

  return prepareDataApi(status, data, error);
}
