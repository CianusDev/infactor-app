// Types pour les documents - définis manuellement pour éviter les imports Prisma côté client

/**
 * Configuration de style personnalisé pour un document
 */
export interface StyleConfig {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  fontSize?: number;
  layout?: "classic" | "modern" | "minimal";
  showLogo?: boolean;
  showWatermark?: boolean;
  headerPosition?: "left" | "center" | "right";
  footerText?: string;
}

/**
 * Type pour une ligne de document
 */
export interface DocumentItem {
  id: string;
  documentId: string;
  description: string;
  quantity: number | string;
  unitPrice: number | string;
  total: number | string;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Type pour un document
 */
export interface Document {
  id: string;
  userId: string;
  name: string;

  // Template et style
  templateId?: string | null;
  styleConfig?: StyleConfig | null;

  // Informations émetteur (entreprise/freelance)
  companyName?: string | null;
  companyAddress?: string | null;
  companyCity?: string | null;
  companyPostalCode?: string | null;
  companyCountry?: string | null;
  companyPhone?: string | null;
  companyEmail?: string | null;
  companySiret?: string | null;
  companyVatNumber?: string | null;
  companyLogo?: string | null;

  // Informations client
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  clientAddress?: string | null;
  clientCity?: string | null;
  clientPostalCode?: string | null;
  clientCountry?: string | null;
  clientSiret?: string | null;
  clientVatNumber?: string | null;

  // Informations facture
  invoiceNumber?: string | null;
  issueDate: Date | string;
  dueDate?: Date | string | null;

  // Montants
  subtotal: number | string;
  taxRate?: number | string | null;
  taxAmount?: number | string | null;
  discount?: number | string | null;
  total: number | string;
  currency: string;

  // Notes et conditions
  notes?: string | null;
  terms?: string | null;

  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Document avec ses lignes (items) et template
 */
export interface DocumentWithItems extends Document {
  items: DocumentItem[];
  template?: {
    id: string;
    name: string;
    description?: string | null;
    preview?: string | null;
    isDefault: boolean;
    config: Record<string, unknown>;
  } | null;
}

/**
 * Réponse de l'API pour la liste des documents
 */
export interface DocumentsResponse {
  data: DocumentWithItems[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Options de tri pour les documents
 */
export type DocumentSortBy = "createdAt" | "updatedAt" | "name";

export type SortOrder = "asc" | "desc";

/**
 * Filtres actifs pour la liste des documents
 */
export interface DocumentFilters {
  search?: string;
  sortBy?: DocumentSortBy;
  sortOrder?: SortOrder;
}

/**
 * État de pagination
 */
export interface PaginationState {
  limit: number;
  offset: number;
  total: number;
}

/**
 * Input pour une ligne de document
 */
export interface DocumentItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  total?: number;
  order?: number;
}

/**
 * Input pour mise à jour d'une ligne de document
 */
export interface UpdateDocumentItemInput extends Partial<DocumentItemInput> {
  id?: string;
}

/**
 * Input pour créer un document
 */
export interface CreateDocumentInput {
  name: string;

  // Template et style
  templateId?: string | null;
  styleConfig?: StyleConfig | null;

  // Infos émetteur
  companyName?: string | null;
  companyAddress?: string | null;
  companyCity?: string | null;
  companyPostalCode?: string | null;
  companyCountry?: string | null;
  companyPhone?: string | null;
  companyEmail?: string | null;
  companySiret?: string | null;
  companyVatNumber?: string | null;
  companyLogo?: string | null;

  // Infos client
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  clientAddress?: string | null;
  clientCity?: string | null;
  clientPostalCode?: string | null;
  clientCountry?: string | null;
  clientSiret?: string | null;
  clientVatNumber?: string | null;

  // Infos facture
  invoiceNumber?: string | null;
  issueDate?: Date;
  dueDate?: Date | null;

  // Montants
  taxRate?: number | null;
  discount?: number | null;
  currency?: string;

  // Notes
  notes?: string | null;
  terms?: string | null;

  // Lignes
  items: DocumentItemInput[];
}

/**
 * Input pour mettre à jour un document
 */
export interface UpdateDocumentInput {
  name?: string;

  // Template et style
  templateId?: string | null;
  styleConfig?: StyleConfig | null;

  // Infos émetteur
  companyName?: string | null;
  companyAddress?: string | null;
  companyCity?: string | null;
  companyPostalCode?: string | null;
  companyCountry?: string | null;
  companyPhone?: string | null;
  companyEmail?: string | null;
  companySiret?: string | null;
  companyVatNumber?: string | null;
  companyLogo?: string | null;

  // Infos client
  clientName?: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  clientAddress?: string | null;
  clientCity?: string | null;
  clientPostalCode?: string | null;
  clientCountry?: string | null;
  clientSiret?: string | null;
  clientVatNumber?: string | null;

  // Infos facture
  invoiceNumber?: string | null;
  issueDate?: Date;
  dueDate?: Date | null;

  // Montants
  taxRate?: number | null;
  discount?: number | null;
  currency?: string;

  // Notes
  notes?: string | null;
  terms?: string | null;

  // Lignes
  items?: UpdateDocumentItemInput[];
}

/**
 * Input pour les requêtes de liste de documents
 */
export interface DocumentQueryInput {
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: DocumentSortBy;
  sortOrder?: SortOrder;
}

/**
 * Données pour le formulaire de document
 */
export interface DocumentFormData {
  // Nom du document
  name: string;

  // Infos émetteur
  companyName?: string | null;
  companyAddress?: string | null;
  companyCity?: string | null;
  companyPostalCode?: string | null;
  companyCountry?: string | null;
  companyPhone?: string | null;
  companyEmail?: string | null;
  companySiret?: string | null;
  companyVatNumber?: string | null;
  companyLogo?: string | null;

  // Infos client
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  clientAddress?: string | null;
  clientCity?: string | null;
  clientPostalCode?: string | null;
  clientCountry?: string | null;
  clientSiret?: string | null;
  clientVatNumber?: string | null;

  // Infos facture
  invoiceNumber?: string | null;
  issueDate?: Date;
  dueDate?: Date | null;

  // Montants
  taxRate?: number | null;
  discount?: number | null;
  currency?: string;

  // Options
  notes?: string | null;
  terms?: string | null;
  templateId?: string | null;
  styleConfig?: StyleConfig | null;

  // Lignes
  items: DocumentItemFormData[];
}

/**
 * Données pour une ligne de document dans le formulaire
 */
export interface DocumentItemFormData {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total?: number;
  order?: number;
}

/**
 * Valeurs par défaut pour un nouveau document
 */
export const DEFAULT_DOCUMENT_FORM_DATA: DocumentFormData = {
  name: "",

  // Infos émetteur
  companyName: null,
  companyAddress: null,
  companyCity: null,
  companyPostalCode: null,
  companyCountry: "France",
  companyPhone: null,
  companyEmail: null,
  companySiret: null,
  companyVatNumber: null,
  companyLogo: null,

  // Infos client
  clientName: "",
  clientEmail: null,
  clientPhone: null,
  clientAddress: null,
  clientCity: null,
  clientPostalCode: null,
  clientCountry: "France",
  clientSiret: null,
  clientVatNumber: null,

  // Infos facture
  invoiceNumber: null,
  issueDate: new Date(),
  dueDate: null,

  // Montants
  taxRate: 20,
  discount: 0,
  currency: "EUR",

  // Options
  notes: null,
  terms: null,
  templateId: null,
  styleConfig: null,

  // Lignes
  items: [
    {
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
      order: 0,
    },
  ],
};

/**
 * Valeurs par défaut pour une nouvelle ligne de document
 */
export const DEFAULT_DOCUMENT_ITEM: DocumentItemFormData = {
  description: "",
  quantity: 1,
  unitPrice: 0,
  total: 0,
  order: 0,
};
