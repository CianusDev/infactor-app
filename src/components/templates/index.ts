// ============================================
// COMPOSANTS TEMPLATES - EXPORTS
// ============================================

// Carte de template
export { TemplateCard } from "./template-card";
export type { TemplateCardProps } from "./template-card";

// Liste de templates
export { TemplateList } from "./template-list";
export type { TemplateListProps } from "./template-list";

// Prévisualisation miniature
export { TemplatePreview, TemplatePreviewSkeleton } from "./template-preview";
export type { TemplatePreviewProps } from "./template-preview";

// Skeletons
export { TemplateSkeleton, TemplateListSkeleton } from "./template-skeleton";

// Prévisualisation complète (legacy - utiliser InvoiceDocument)
export {
  TemplateFullPreview,
  TemplateFullPreviewSkeleton,
} from "./template-full-preview";
export type { TemplateFullPreviewProps } from "./template-full-preview";

// Éditeur legacy
export { TemplateCustomizer } from "./template-customizer";
export type { TemplateCustomizerProps } from "./template-customizer";

// Nouvel éditeur user-friendly
export { TemplateEditor } from "./template-editor";
export type { TemplateEditorProps } from "./template-editor";
