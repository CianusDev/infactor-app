// Export des schémas et types
export {
  documentItemSchema,
  updateDocumentItemSchema,
  styleConfigSchema,
  createDocumentSchema,
  updateDocumentSchema,
  documentQuerySchema,
  type StyleConfig,
  type DocumentItemInput,
  type UpdateDocumentItemInput,
  type CreateDocumentInput,
  type UpdateDocumentInput,
  type DocumentQueryInput,
} from "./document.schema";

// Export du repository
export { DocumentRepository, type DocumentWithItems } from "./document.repository";

// Export du service
export { DocumentService } from "./document.service";

// Export du controller
export { DocumentController } from "./document.controller";
