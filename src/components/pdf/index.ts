// ============================================
// COMPOSANTS PDF - EXPORTS
// ============================================

// Composant principal
export { InvoicePDF } from "./invoice-pdf";
export type { InvoicePDFProps } from "./invoice-pdf";

// Boutons de téléchargement
export {
  PDFDownloadButton,
  PDFDownloadIconButton,
  DocumentPDFDownloadButton,
} from "./pdf-download-button";
export type {
  PDFDownloadButtonProps,
  DocumentPDFDownloadButtonProps,
} from "./pdf-download-button";

// Sous-composants
export { PDFHeader } from "./components/pdf-header";
export type { PDFHeaderProps } from "./components/pdf-header";

export { PDFInvoiceTitle } from "./components/pdf-invoice-title";
export type { PDFInvoiceTitleProps } from "./components/pdf-invoice-title";

export { PDFInfoSection } from "./components/pdf-info-section";
export type { PDFInfoSectionProps } from "./components/pdf-info-section";

export { PDFItemsTable } from "./components/pdf-items-table";
export type { PDFItemsTableProps } from "./components/pdf-items-table";

export { PDFTotalsSection } from "./components/pdf-totals-section";
export type { PDFTotalsSectionProps } from "./components/pdf-totals-section";

export { PDFNotesSection } from "./components/pdf-notes-section";
export type { PDFNotesSectionProps } from "./components/pdf-notes-section";

export { PDFFooter } from "./components/pdf-footer";
export type { PDFFooterProps } from "./components/pdf-footer";

// Types de données
export type {
  CompanyData,
  ClientData,
  InvoiceItemData,
  TotalsData,
  InvoicePDFData,
  PDFLayout,
  PDFHeaderPosition,
} from "./types";

// Styles et utilitaires
export { createPDFStyles, formatCurrency, formatDate } from "./styles";
export {
  convertToInvoicePDFData,
  generatePDFFileName,
  validateInvoicePDFData,
  documentToPreviewData,
} from "./utils";

// Polices
export { registerPDFFonts, PDF_FONTS, DEFAULT_PDF_FONT } from "./fonts";
export type { PDFFontFamily } from "./fonts";
