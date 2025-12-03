import { Document, Page, View } from "@react-pdf/renderer";
import { TemplateConfig } from "@/server/modules/template/template.schema";
import { InvoicePreviewData } from "@/hooks/use-template-customizer";
import { createPDFStyles } from "./styles";
import { convertToInvoicePDFData } from "./utils";
import {
  PDFHeader,
  PDFInvoiceTitle,
  PDFInfoSection,
  PDFItemsTable,
  PDFTotalsSection,
  PDFNotesSection,
  PDFFooter,
} from "./components";

// ============================================
// TYPES
// ============================================

export interface InvoicePDFProps {
  config: TemplateConfig;
  data: InvoicePreviewData;
}

// ============================================
// CONFIGURATION PAR DÉFAUT
// ============================================

const defaultConfig: TemplateConfig = {
  primaryColor: "#1f2937",
  secondaryColor: "#6b7280",
  fontFamily: "Inter",
  fontSize: 12,
  layout: "classic",
  showLogo: true,
  logoUrl: null,
  headerPosition: "left",
  footerText: "Merci pour votre confiance.",
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

/**
 * Composant PDF de facture
 * Génère un document PDF basé sur la configuration du template et les données
 *
 * Structure:
 * - PDFHeader: Logo et informations de l'entreprise
 * - PDFInvoiceTitle: Titre "FACTURE" et numéro
 * - PDFInfoSection: Dates et informations client
 * - PDFItemsTable: Tableau des articles
 * - PDFTotalsSection: Sous-total, TVA, total
 * - PDFNotesSection: Notes et conditions
 * - PDFFooter: Texte de pied de page
 */
export function InvoicePDF({ config, data }: InvoicePDFProps) {
  // Fusionner la config avec les valeurs par défaut pour éviter les undefined
  const safeConfig: TemplateConfig = {
    ...defaultConfig,
    ...(config || {}),
  };

  // Créer les styles basés sur la configuration
  const styles = createPDFStyles(safeConfig);

  // Convertir les données vers le format structuré
  const pdfData = convertToInvoicePDFData(data);

  // Extraire les options de configuration avec valeurs par défaut garanties
  const layout = safeConfig.layout || "classic";
  const showLogo = safeConfig.showLogo !== false;
  const logoUrl = safeConfig.logoUrl || null;
  const footerText = safeConfig.footerText || "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Barre colorée pour le layout moderne */}
        {layout === "modern" && <View style={styles.topBar} />}

        {/* Header: Logo et informations entreprise */}
        <PDFHeader
          styles={styles}
          company={pdfData.company}
          showLogo={showLogo}
          logoUrl={logoUrl}
        />

        {/* Titre de la facture */}
        <PDFInvoiceTitle
          styles={styles}
          invoiceNumber={pdfData.invoiceNumber}
        />

        {/* Section informations: Dates et client */}
        <PDFInfoSection
          styles={styles}
          issueDate={pdfData.issueDate}
          dueDate={pdfData.dueDate}
          client={pdfData.client}
        />

        {/* Tableau des articles */}
        <PDFItemsTable
          styles={styles}
          items={pdfData.items}
          currency={pdfData.totals.currency}
        />

        {/* Section des totaux */}
        <PDFTotalsSection styles={styles} totals={pdfData.totals} />

        {/* Notes et conditions */}
        <PDFNotesSection
          styles={styles}
          notes={pdfData.notes}
          terms={pdfData.terms}
        />

        {/* Footer */}
        <PDFFooter styles={styles} footerText={footerText} />
      </Page>
    </Document>
  );
}
