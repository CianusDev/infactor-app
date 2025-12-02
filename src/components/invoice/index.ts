// Exports des composants de facture/document

// Document et prévisualisation
export { InvoiceDocument } from "./invoice-document";
export type { InvoiceDocumentProps } from "./invoice-document";

// Thumbnails
export {
  DocumentThumbnail,
  DocumentThumbnailStatic,
} from "./document-thumbnail";
export type { DocumentThumbnailProps } from "./document-thumbnail";

// Skeletons de chargement
export {
  InvoiceRowSkeleton,
  InvoiceTableSkeleton,
  InvoiceFiltersSkeleton,
  InvoiceStatsSkeleton,
  InvoiceCardSkeleton,
  InvoiceGridSkeleton,
  InvoiceListPageSkeleton,
  InvoiceDetailSkeleton,
  InvoiceFormSkeleton,
} from "./invoice-skeleton";

// Sélecteur de template
export { TemplateSelector, TemplateSelectorCompact } from "./template-selector";
export type { TemplateSelectorProps } from "./template-selector";

// Formulaires (re-export depuis le sous-dossier)
export {
  ClientInfoForm,
  CompanyInfoForm,
  InvoiceItemsForm,
  InvoiceItemsReadOnly,
  InvoiceOptionsForm,
  InvoiceTotals,
} from "./forms";
export type {
  ClientInfoFormProps,
  CompanyInfoFormProps,
  InvoiceItemsFormProps,
  InvoiceOptionsFormProps,
} from "./forms";

// Creator (flow UX split-screen)
export { InvoiceCreator } from "./creator";
export type { InvoiceCreatorProps } from "./creator";
