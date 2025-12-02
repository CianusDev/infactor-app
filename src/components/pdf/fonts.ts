import { Font } from "@react-pdf/renderer";

// ============================================
// CONFIGURATION DES POLICES PDF
// ============================================

/**
 * Enregistre les polices personnalisées pour @react-pdf/renderer
 * Doit être appelé une seule fois au démarrage de l'application
 */
export function registerPDFFonts(): void {
  // Police Inter
  Font.register({
    family: "Inter",
    src: "/fonts/Inter.ttf",
  });
}

/**
 * Liste des polices disponibles pour le PDF
 */
export const PDF_FONTS = {
  inter: "Inter",
  helvetica: "Helvetica",
} as const;

export type PDFFontFamily = (typeof PDF_FONTS)[keyof typeof PDF_FONTS];

/**
 * Police par défaut pour les PDF
 */
export const DEFAULT_PDF_FONT: PDFFontFamily = PDF_FONTS.inter;
