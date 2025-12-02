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
  PDFWatermark,
} from "./components";

// ============================================
// TYPES
// ============================================

export interface InvoicePDFProps {
  config: TemplateConfig;
  data: InvoicePreviewData;
}

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
  // Créer les styles basés sur la configuration
  const styles = createPDFStyles(config);

  // Convertir les données vers le format structuré
  const pdfData = convertToInvoicePDFData(data);

  // Extraire les options de configuration
  const {
    layout = "classic",
    showLogo = true,
    showWatermark = false,
    footerText = "",
    primaryColor = "#1f2937",
  } = config;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Filigrane (Watermark) */}
        {showWatermark && (
          <PDFWatermark
            companyName={pdfData.company.name}
            primaryColor={primaryColor}
          />
        )}

        {/* Barre colorée pour le layout moderne */}
        {layout === "modern" && <View style={styles.topBar} />}

        {/* Header: Logo et informations entreprise */}
        <PDFHeader
          styles={styles}
          company={pdfData.company}
          showLogo={showLogo}
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
