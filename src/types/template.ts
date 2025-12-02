// Re-export des types Prisma pour les templates
// Utilise les types générés par Prisma pour garantir la cohérence

import { TemplateModel } from "@/generated/prisma/models/Template";
import {
  TemplateConfig,
  TemplateQueryInput,
  CreateTemplateInput,
  UpdateTemplateInput,
} from "@/server/modules/template/template.schema";

// Type principal du template (depuis Prisma)
export type Template = TemplateModel;

// Re-export des types du schema
export type {
  TemplateConfig,
  TemplateQueryInput,
  CreateTemplateInput,
  UpdateTemplateInput,
};

/**
 * Réponse de l'API pour la liste des templates
 */
export interface TemplatesResponse {
  data: Template[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Props pour le composant TemplateCard
 */
export interface TemplateCardProps {
  template: Template;
  isSelected?: boolean;
  onSelect?: (template: Template) => void;
  showActions?: boolean;
  className?: string;
}

/**
 * Props pour le composant TemplateList
 */
export interface TemplateListProps {
  templates?: Template[];
  selectedTemplateId?: string | null;
  onSelectTemplate?: (template: Template) => void;
  isLoading?: boolean;
  showSearch?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * Props pour le composant TemplatePreview
 */
export interface TemplatePreviewProps {
  template: Template;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Layout options pour les templates
 */
export type TemplateLayout = "classic" | "modern" | "minimal";

/**
 * Position du header dans le template
 */
export type HeaderPosition = "left" | "center" | "right";
