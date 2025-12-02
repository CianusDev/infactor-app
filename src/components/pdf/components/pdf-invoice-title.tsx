import { Text, View } from "@react-pdf/renderer";
import { createPDFStyles } from "../styles";

export interface PDFInvoiceTitleProps {
  styles: ReturnType<typeof createPDFStyles>;
  invoiceNumber: string;
}

/**
 * Composant Titre de la facture
 * Affiche "FACTURE" et le numéro de facture
 */
export function PDFInvoiceTitle({
  styles,
  invoiceNumber,
}: PDFInvoiceTitleProps) {
  return (
    <View style={styles.invoiceTitle}>
      <Text style={styles.invoiceTitleText}>FACTURE</Text>
      <Text style={styles.invoiceNumber}>N° {invoiceNumber}</Text>
    </View>
  );
}
