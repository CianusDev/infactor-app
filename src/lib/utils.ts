import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodIssue } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(errors: ZodIssue[] | undefined, field: string) {
  return errors?.find((e) => e.path[0] === field)?.message;
}

export function prepareDataApi(status: number, data: unknown, error: string) {
  switch (status) {
    case 200:
    case 201:
      return {
        success: true,
        data: data,
      };
    default:
      return {
        success: false,
        message: error,
      };
  }
}

// ============================================
// FORMATAGE DES DATES
// ============================================

/**
 * Formate une date au format français (DD/MM/YYYY)
 */
export function formatDate(
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "-";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return dateObj.toLocaleDateString("fr-FR", options || defaultOptions);
}

/**
 * Formate une date avec l'heure
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "-";

  return dateObj.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formate une date de manière relative (il y a X jours, etc.)
 */
export function formatRelativeDate(
  date: string | Date | null | undefined,
): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "-";

  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Aujourd'hui";
  if (diffInDays === 1) return "Hier";
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
  if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;

  return formatDate(dateObj);
}

// ============================================
// FORMATAGE DES DEVISES
// ============================================

/**
 * Formate un montant en devise (EUR par défaut)
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = "EUR",
  locale: string = "fr-FR",
): string {
  if (amount === null || amount === undefined) return "-";

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) return "-";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

/**
 * Formate un nombre avec séparateurs de milliers
 */
export function formatNumber(
  value: number | string | null | undefined,
  decimals: number = 2,
  locale: string = "fr-FR",
): string {
  if (value === null || value === undefined) return "-";

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "-";

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);
}

/**
 * Formate un pourcentage
 */
export function formatPercent(
  value: number | string | null | undefined,
  decimals: number = 0,
  locale: string = "fr-FR",
): string {
  if (value === null || value === undefined) return "-";

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "-";

  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue / 100);
}

// ============================================
// UTILITAIRES DE CALCUL
// ============================================

/**
 * Calcule le total d'une ligne de facture
 */
export function calculateItemTotal(
  quantity: number,
  unitPrice: number,
): number {
  return Math.round(quantity * unitPrice * 100) / 100;
}

/**
 * Calcule les totaux d'une facture
 */
export function calculateInvoiceTotals(
  items: { quantity: number; unitPrice: number }[],
  taxRate: number = 20,
  discount: number = 0,
): { subtotal: number; taxAmount: number; total: number } {
  const subtotal = items.reduce(
    (sum, item) => sum + calculateItemTotal(item.quantity, item.unitPrice),
    0,
  );

  const subtotalAfterDiscount = subtotal - discount;
  const taxAmount = (subtotalAfterDiscount * taxRate) / 100;
  const total = subtotalAfterDiscount + taxAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}
