import { TemplateConfig } from "@/server/modules/template/template.schema";

// ============================================
// TYPES DE DONNÉES POUR LE PDF
// ============================================

/**
 * Données de l'entreprise pour le PDF
 */
export interface CompanyData {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  siret?: string;
  vatNumber?: string;
  logo?: string;
}

/**
 * Données du client pour le PDF
 */
export interface ClientData {
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  email?: string;
  phone?: string;
  siret?: string;
  vatNumber?: string;
}

/**
 * Ligne d'article pour le PDF
 */
export interface InvoiceItemData {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Données des totaux pour le PDF
 */
export interface TotalsData {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount?: number;
  total: number;
  currency: string;
}

/**
 * Données complètes de la facture pour le PDF
 */
export interface InvoicePDFData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  company: CompanyData;
  client: ClientData;
  items: InvoiceItemData[];
  totals: TotalsData;
  notes?: string;
  terms?: string;
}

/**
 * Props principales du composant InvoicePDF
 */
export interface InvoicePDFProps {
  config: TemplateConfig;
  data: InvoicePDFData;
}

// ============================================
// TYPES UTILITAIRES
// ============================================

/**
 * Type pour les layouts de template
 */
export type PDFLayout = "classic" | "modern" | "minimal";

/**
 * Type pour les positions du header
 */
export type PDFHeaderPosition = "left" | "center" | "right";
