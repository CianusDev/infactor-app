"use server";

import { prepareDataApi } from "@/lib/utils";
import { api } from "@/server/config/axios";
import {
  CreateDocumentInput,
  UpdateDocumentInput,
  DocumentQueryInput,
} from "@/types/document";

/**
 * Récupérer la liste des documents avec pagination et filtres
 */
export async function getDocuments(query?: DocumentQueryInput) {
  const params = new URLSearchParams();
  if (query?.search) params.append("search", query.search);
  if (query?.limit) params.append("limit", query.limit.toString());
  if (query?.offset) params.append("offset", query.offset.toString());
  if (query?.sortBy) params.append("sortBy", query.sortBy);
  if (query?.sortOrder) params.append("sortOrder", query.sortOrder);

  const queryString = params.toString();
  const endpoint = `/documents${queryString ? `?${queryString}` : ""}`;

  const result = await api.get(endpoint);

  const status = result.status;
  const data = result.data?.data;
  const error = result.data?.error;

  return prepareDataApi(status, data, error);
}

/**
 * Récupérer un document par son ID
 */
export async function getDocumentById(documentId: string) {
  const endpoint = `/documents/${documentId}`;

  const result = await api.get(endpoint);

  const status = result.status;
  const data = result.data?.data;
  const error = result.data?.error;

  return prepareDataApi(status, data, error);
}

/**
 * Créer un nouveau document
 */
export async function createDocument(payload: CreateDocumentInput) {
  const endpoint = "/documents";

  const result = await api.post(endpoint, payload);

  const status = result.status;
  const data = result.data?.data;
  const error = result.data?.error;

  return prepareDataApi(status, data, error);
}

/**
 * Mettre à jour un document
 */
export async function updateDocument(
  documentId: string,
  payload: UpdateDocumentInput,
) {
  const endpoint = `/documents/${documentId}`;

  const result = await api.put(endpoint, payload);

  const status = result.status;
  const data = result.data?.data;
  const error = result.data?.error;

  return prepareDataApi(status, data, error);
}

/**
 * Supprimer un document
 */
export async function deleteDocument(documentId: string) {
  const endpoint = `/documents/${documentId}`;

  const result = await api.delete(endpoint);

  const status = result.status;
  const data = result.data;
  const error = result.data?.error;

  return prepareDataApi(status, data, error);
}

/**
 * Dupliquer un document
 */
export async function duplicateDocument(documentId: string, newName?: string) {
  const endpoint = `/documents/${documentId}/duplicate`;

  const result = await api.post(endpoint, newName ? { name: newName } : {});

  const status = result.status;
  const data = result.data?.data;
  const error = result.data?.error;

  return prepareDataApi(status, data, error);
}
