import { InvoicePreviewData } from "@/hooks/use-template-customizer";
import { InvoicePDFData, CompanyData, ClientData, TotalsData } from "./types";
import { DocumentWithItems } from "@/types/document";
import { formatDate } from "@/lib/utils";

/**
 * Convertit les données de prévisualisation vers le format PDF structuré
 */
export function convertToInvoicePDFData(
  data: InvoicePreviewData,
): InvoicePDFData {
  const company: CompanyData = {
    name: data.companyName,
    address: data.companyAddress,
    city: data.companyCity,
    postalCode: data.companyPostalCode,
    country: data.companyCountry,
    phone: data.companyPhone,
    email: data.companyEmail,
    siret: data.companySiret,
    vatNumber: data.companyVatNumber,
    logo: data.companyLogo,
  };

  const client: ClientData = {
    name: data.clientName,
    address: data.clientAddress,
    city: data.clientCity,
    postalCode: data.clientPostalCode,
    country: data.clientCountry,
    email: data.clientEmail,
    phone: data.clientPhone,
    siret: data.clientSiret,
    vatNumber: data.clientVatNumber,
  };

  const totals: TotalsData = {
    subtotal: data.subtotal,
    taxRate: data.taxRate,
    taxAmount: data.taxAmount,
    discount: data.discount,
    total: data.total,
    currency: data.currency,
  };

  return {
    invoiceNumber: data.invoiceNumber,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    company,
    client,
    items: data.items,
    totals,
    notes: data.notes,
    terms: data.terms,
  };
}

/**
 * Génère un nom de fichier pour le PDF
 */
export function generatePDFFileName(
  invoiceNumber: string,
  prefix: string = "facture",
): string {
  const sanitizedNumber = invoiceNumber.replace(/[^a-zA-Z0-9-]/g, "_");
  const date = new Date().toISOString().split("T")[0];
  return `${prefix}_${sanitizedNumber}_${date}.pdf`;
}

/**
 * Vérifie si les données sont valides pour la génération du PDF
 */
export function validateInvoicePDFData(data: InvoicePDFData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Vérifier les données obligatoires
  if (!data.invoiceNumber) {
    errors.push("Le numéro de facture est requis");
  }

  if (!data.company.name) {
    errors.push("Le nom de l'entreprise est requis");
  }

  if (!data.client.name) {
    errors.push("Le nom du client est requis");
  }

  if (!data.items || data.items.length === 0) {
    errors.push("Au moins un article est requis");
  }

  if (data.totals.total <= 0) {
    errors.push("Le total doit être supérieur à 0");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Convertit un DocumentWithItems en InvoicePreviewData pour la génération PDF
 */
export function documentToPreviewData(
  document: DocumentWithItems,
): InvoicePreviewData {
  return {
    invoiceNumber: document.invoiceNumber || `DOC-${document.id.slice(0, 8)}`,
    issueDate: formatDate(document.issueDate),
    dueDate: document.dueDate ? formatDate(document.dueDate) : "-",

    // Entreprise
    companyName: document.companyName || "Entreprise",
    companyAddress: document.companyAddress || "",
    companyCity: document.companyCity || "",
    companyPostalCode: document.companyPostalCode || "",
    companyCountry: document.companyCountry || "France",
    companyPhone: document.companyPhone || undefined,
    companyEmail: document.companyEmail || undefined,
    companySiret: document.companySiret || undefined,
    companyVatNumber: document.companyVatNumber || undefined,
    companyLogo: document.companyLogo || undefined,

    // Client
    clientName: document.clientName,
    clientAddress: document.clientAddress || undefined,
    clientCity: document.clientCity || undefined,
    clientPostalCode: document.clientPostalCode || undefined,
    clientCountry: document.clientCountry || undefined,
    clientEmail: document.clientEmail || undefined,
    clientPhone: document.clientPhone || undefined,
    clientSiret: document.clientSiret || undefined,
    clientVatNumber: document.clientVatNumber || undefined,

    // Lignes
    items: document.items.map((item) => ({
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
    })),

    // Totaux
    subtotal: Number(document.subtotal),
    taxRate: Number(document.taxRate) || 20,
    taxAmount: Number(document.taxAmount) || 0,
    discount: Number(document.discount) || 0,
    total: Number(document.total),
    currency: document.currency || "EUR",

    // Notes
    notes: document.notes || undefined,
    terms: document.terms || undefined,
  };
}
