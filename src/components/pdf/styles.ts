import { StyleSheet } from "@react-pdf/renderer";
import { TemplateConfig } from "@/server/modules/template/template.schema";
import { registerPDFFonts, DEFAULT_PDF_FONT } from "./fonts";

// Enregistrer les polices au chargement du module
registerPDFFonts();

// ============================================
// CRÉATION DES STYLES DYNAMIQUES
// ============================================

/**
 * Crée les styles PDF dynamiquement basés sur la configuration du template
 */
export function createPDFStyles(config: TemplateConfig) {
  const {
    primaryColor = "#1f2937",
    secondaryColor = "#6b7280",
    fontSize = 12,
    layout = "classic",
    headerPosition = "left",
  } = config;

  // Alignement du header
  const headerAlign =
    headerPosition === "center"
      ? "center"
      : headerPosition === "right"
        ? "flex-end"
        : "flex-start";

  const headerTextAlign =
    headerPosition === "center"
      ? "center"
      : headerPosition === "right"
        ? "right"
        : "left";

  return StyleSheet.create({
    // ============================================
    // PAGE
    // ============================================
    page: {
      padding: 40,
      fontFamily: DEFAULT_PDF_FONT,
      fontSize: fontSize,
      color: secondaryColor,
    },

    // Barre colorée du layout moderne
    topBar: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 8,
      backgroundColor: primaryColor,
    },

    // ============================================
    // HEADER
    // ============================================
    header: {
      alignItems: headerAlign,
      marginBottom: 30,
    },

    logo: {
      width: 120,
      height: 40,
      backgroundColor: primaryColor,
      marginBottom: 10,
      justifyContent: "center",
      alignItems: "center",
    },

    logoText: {
      color: "white",
      fontWeight: 700,
      fontSize: 14,
    },

    companyName: {
      fontSize: 18,
      fontWeight: 700,
      color: primaryColor,
      textAlign: headerTextAlign,
    },

    companyInfo: {
      fontSize: fontSize - 1,
      color: secondaryColor,
      textAlign: headerTextAlign,
      marginTop: 2,
    },

    // ============================================
    // TITRE FACTURE
    // ============================================
    invoiceTitle: {
      marginBottom: 30,
      textAlign: layout === "modern" ? "center" : "left",
      borderBottomWidth: layout === "minimal" ? 2 : 0,
      borderBottomColor: primaryColor,
      paddingBottom: layout === "minimal" ? 10 : 0,
    },

    invoiceTitleText: {
      fontSize: 24,
      fontWeight: 700,
      color: primaryColor,
      letterSpacing: 2,
    },

    invoiceNumber: {
      fontSize: 14,
      color: secondaryColor,
      marginTop: 5,
    },

    // ============================================
    // SECTION INFOS (DATES + CLIENT)
    // ============================================
    infoSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 30,
    },

    datesSection: {
      flex: 1,
    },

    dateRow: {
      flexDirection: "row",
      marginBottom: 5,
    },

    dateLabel: {
      fontWeight: 600,
      color: primaryColor,
      marginRight: 5,
    },

    dateValue: {
      color: secondaryColor,
    },

    clientSection: {
      width: 200,
      padding: 15,
      backgroundColor: layout === "modern" ? "#f9fafb" : "transparent",
      borderWidth: layout === "modern" ? 0 : 1,
      borderColor: secondaryColor,
      borderRadius: 4,
    },

    clientTitle: {
      fontSize: fontSize - 1,
      fontWeight: 700,
      color: primaryColor,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 8,
    },

    clientName: {
      fontWeight: 600,
      color: primaryColor,
      marginBottom: 3,
    },

    clientInfo: {
      color: secondaryColor,
      marginBottom: 2,
    },

    // ============================================
    // TABLEAU DES ARTICLES
    // ============================================
    table: {
      marginBottom: 30,
    },

    tableHeader: {
      flexDirection: "row",
      backgroundColor: layout === "modern" ? primaryColor : "transparent",
      borderBottomWidth: layout === "modern" ? 0 : 1,
      borderBottomColor: layout === "minimal" ? primaryColor : secondaryColor,
      paddingVertical: 10,
      paddingHorizontal: 10,
    },

    tableHeaderText: {
      fontWeight: 600,
      color: layout === "modern" ? "white" : primaryColor,
    },

    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: `${secondaryColor}30`,
      paddingVertical: 10,
      paddingHorizontal: 10,
    },

    tableRowAlt: {
      backgroundColor: layout === "modern" ? "#f9fafb" : "transparent",
    },

    colDescription: {
      flex: 3,
    },

    colQuantity: {
      width: 60,
      textAlign: "center",
    },

    colPrice: {
      width: 80,
      textAlign: "right",
    },

    colTotal: {
      width: 80,
      textAlign: "right",
    },

    itemTotal: {
      fontWeight: 600,
      color: primaryColor,
    },

    // ============================================
    // TOTAUX
    // ============================================
    totalsSection: {
      alignItems: "flex-end",
      marginBottom: 30,
    },

    totalsContainer: {
      width: 250,
    },

    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
    },

    totalLabel: {
      color: secondaryColor,
    },

    totalValue: {
      color: primaryColor,
    },

    totalDiscount: {
      color: "#16a34a",
    },

    separator: {
      borderBottomWidth: 1,
      borderBottomColor: secondaryColor,
      marginVertical: 5,
    },

    grandTotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: layout === "modern" ? 10 : 0,
      backgroundColor:
        layout === "modern" ? `${primaryColor}10` : "transparent",
      borderRadius: 4,
    },

    grandTotalLabel: {
      fontSize: 14,
      fontWeight: 700,
      color: primaryColor,
    },

    grandTotalValue: {
      fontSize: 14,
      fontWeight: 700,
      color: primaryColor,
    },

    // ============================================
    // NOTES ET CONDITIONS
    // ============================================
    notesSection: {
      marginTop: 30,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: `${secondaryColor}30`,
    },

    notesTitle: {
      fontWeight: 600,
      color: primaryColor,
      marginBottom: 5,
    },

    notesText: {
      fontSize: fontSize - 1,
      color: secondaryColor,
      lineHeight: 1.5,
    },

    // ============================================
    // FOOTER
    // ============================================
    footer: {
      position: "absolute",
      bottom: 40,
      left: 40,
      right: 40,
      textAlign: "center",
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: `${secondaryColor}30`,
    },

    footerText: {
      fontSize: fontSize - 1,
      color: secondaryColor,
    },
  });
}

// ============================================
// UTILITAIRES DE FORMATAGE
// ============================================

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
