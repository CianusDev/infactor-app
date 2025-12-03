import { TemplateConfig } from "@/server/modules/template/template.schema";

// ============================================
// CONSTANTES DE STYLES PARTAGÉES
// ============================================

/**
 * Dimensions de la page A4 en pixels (à 72 DPI)
 */
export const PAGE = {
  width: 595, // 210mm
  height: 842, // 297mm
  padding: 40,
} as const;

/**
 * Dimensions et espacements communs
 */
export const SPACING = {
  // Marges
  sectionMargin: 30,
  elementMargin: 10,
  smallMargin: 5,
  tinyMargin: 2,

  // Paddings
  cardPadding: 15,
  tableCellPadding: 10,
  footerPadding: 15,

  // Largeurs
  logoWidth: 120,
  logoHeight: 50,
  logoPlaceholderHeight: 40,
  clientSectionWidth: 200,
  totalsWidth: 250,
  colQuantityWidth: 60,
  colPriceWidth: 80,
  colTotalWidth: 80,

  // Hauteurs
  topBarHeight: 8,
} as const;

/**
 * Tailles de police
 */
export const FONT_SIZES = {
  title: 24,
  companyName: 18,
  invoiceNumber: 14,
  grandTotal: 14,
  small: 9,
} as const;

/**
 * Couleurs par défaut
 */
export const DEFAULT_COLORS = {
  primary: "#1f2937",
  secondary: "#6b7280",
  white: "#ffffff",
  background: "#f9fafb",
  success: "#16a34a",
  border: "30", // Opacité pour les bordures (ajoutée à la couleur)
} as const;

/**
 * Configuration par défaut du template
 */
export const DEFAULT_TEMPLATE_CONFIG: Required<
  Omit<TemplateConfig, "logoUrl">
> & { logoUrl: string | null } = {
  primaryColor: DEFAULT_COLORS.primary,
  secondaryColor: DEFAULT_COLORS.secondary,
  fontFamily: "Inter",
  fontSize: 12,
  layout: "classic",
  showLogo: true,
  logoUrl: null,
  headerPosition: "left",
  footerText: "Merci pour votre confiance.",
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Obtenir l'alignement du header selon la position
 */
export function getHeaderAlignment(position: "left" | "center" | "right") {
  switch (position) {
    case "center":
      return {
        flexAlign: "center" as const,
        textAlign: "center" as const,
        cssClass: "text-center items-center",
      };
    case "right":
      return {
        flexAlign: "flex-end" as const,
        textAlign: "right" as const,
        cssClass: "text-right items-end",
      };
    default:
      return {
        flexAlign: "flex-start" as const,
        textAlign: "left" as const,
        cssClass: "text-left items-start",
      };
  }
}

/**
 * Obtenir une config sécurisée avec toutes les valeurs par défaut
 */
export function getSafeConfig(
  config: TemplateConfig | null | undefined,
): Required<Omit<TemplateConfig, "logoUrl">> & { logoUrl: string | null } {
  return {
    ...DEFAULT_TEMPLATE_CONFIG,
    ...(config || {}),
    // S'assurer que les valeurs critiques ne sont jamais undefined
    primaryColor: config?.primaryColor || DEFAULT_TEMPLATE_CONFIG.primaryColor,
    secondaryColor:
      config?.secondaryColor || DEFAULT_TEMPLATE_CONFIG.secondaryColor,
    fontSize: config?.fontSize || DEFAULT_TEMPLATE_CONFIG.fontSize,
    layout: config?.layout || DEFAULT_TEMPLATE_CONFIG.layout,
    headerPosition:
      config?.headerPosition || DEFAULT_TEMPLATE_CONFIG.headerPosition,
    showLogo: config?.showLogo !== false,
    logoUrl: config?.logoUrl || null,
    fontFamily: config?.fontFamily || DEFAULT_TEMPLATE_CONFIG.fontFamily,
    footerText: config?.footerText ?? DEFAULT_TEMPLATE_CONFIG.footerText,
  };
}

/**
 * Formater un montant en devise
 */
export function formatCurrency(
  amount: number,
  currency: string = "EUR",
): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Formater une date
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Générer les styles CSS inline pour le preview HTML
 * basés sur la configuration du template
 */
export function generatePreviewStyles(config: TemplateConfig) {
  const safeConfig = getSafeConfig(config);
  const { primaryColor, secondaryColor, fontSize, layout } = safeConfig;

  return {
    // Page
    page: {
      fontFamily: safeConfig.fontFamily,
      fontSize: `${fontSize}px`,
      color: secondaryColor,
      padding: `${PAGE.padding}px`,
      minHeight: "297mm",
      width: "210mm",
      backgroundColor: "white",
      position: "relative" as const,
    },

    // Top bar (modern layout)
    topBar: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      height: `${SPACING.topBarHeight}px`,
      backgroundColor: primaryColor,
    },

    // Logo placeholder
    logoPlaceholder: {
      width: `${SPACING.logoWidth}px`,
      height: `${SPACING.logoPlaceholderHeight}px`,
      backgroundColor: primaryColor,
      marginBottom: `${SPACING.elementMargin}px`,
    },

    // Company name
    companyName: {
      fontSize: `${FONT_SIZES.companyName}px`,
      fontWeight: 700,
      color: primaryColor,
    },

    // Company info
    companyInfo: {
      fontSize: `${fontSize - 1}px`,
      color: secondaryColor,
      marginTop: `${SPACING.tinyMargin}px`,
    },

    // Invoice title
    invoiceTitle: {
      fontSize: `${FONT_SIZES.title}px`,
      fontWeight: 700,
      color: primaryColor,
      letterSpacing: "2px",
      textAlign: (layout === "modern" ? "center" : "left") as
        | "center"
        | "left",
      marginBottom: `${SPACING.sectionMargin}px`,
      ...(layout === "minimal" && {
        borderBottomWidth: "2px",
        borderBottomStyle: "solid" as const,
        borderBottomColor: primaryColor,
        paddingBottom: `${SPACING.elementMargin}px`,
      }),
    },

    // Invoice number
    invoiceNumber: {
      fontSize: `${FONT_SIZES.invoiceNumber}px`,
      color: secondaryColor,
      marginTop: `${SPACING.smallMargin}px`,
    },

    // Client section
    clientSection: {
      width: `${SPACING.clientSectionWidth}px`,
      padding: `${SPACING.cardPadding}px`,
      backgroundColor: layout === "modern" ? DEFAULT_COLORS.background : "transparent",
      ...(layout !== "modern" && {
        border: `1px solid ${secondaryColor}`,
        borderRadius: "4px",
      }),
    },

    // Client title
    clientTitle: {
      fontSize: `${fontSize - 1}px`,
      fontWeight: 700,
      color: primaryColor,
      textTransform: "uppercase" as const,
      letterSpacing: "1px",
      marginBottom: `${SPACING.smallMargin + 3}px`,
    },

    // Table header
    tableHeader: {
      backgroundColor: layout === "modern" ? primaryColor : "transparent",
      color: layout === "modern" ? "white" : primaryColor,
      fontWeight: 600,
      padding: `${SPACING.tableCellPadding}px`,
      ...(layout !== "modern" && {
        borderBottom: `1px solid ${layout === "minimal" ? primaryColor : secondaryColor}`,
      }),
    },

    // Table row
    tableRow: {
      padding: `${SPACING.tableCellPadding}px`,
      borderBottom: `1px solid ${secondaryColor}${DEFAULT_COLORS.border}`,
    },

    // Table row alternate (modern)
    tableRowAlt: {
      backgroundColor: layout === "modern" ? DEFAULT_COLORS.background : "transparent",
    },

    // Totals section
    totalsSection: {
      width: `${SPACING.totalsWidth}px`,
      marginLeft: "auto",
    },

    // Grand total row
    grandTotalRow: {
      fontSize: `${FONT_SIZES.grandTotal}px`,
      fontWeight: 700,
      color: primaryColor,
      padding: `${SPACING.tableCellPadding}px`,
      ...(layout === "modern" && {
        backgroundColor: `${primaryColor}10`,
        borderRadius: "4px",
      }),
    },

    // Notes section
    notesSection: {
      marginTop: `${SPACING.sectionMargin}px`,
      paddingTop: `${SPACING.sectionMargin - 10}px`,
      borderTop: `1px solid ${secondaryColor}${DEFAULT_COLORS.border}`,
    },

    // Footer
    footer: {
      position: "absolute" as const,
      bottom: `${PAGE.padding}px`,
      left: `${PAGE.padding}px`,
      right: `${PAGE.padding}px`,
      textAlign: "center" as const,
      paddingTop: `${SPACING.footerPadding}px`,
      borderTop: `1px solid ${secondaryColor}${DEFAULT_COLORS.border}`,
      fontSize: `${fontSize - 1}px`,
      color: secondaryColor,
    },

    // Colors
    primaryColor,
    secondaryColor,
    fontSize,
    layout,
  };
}
