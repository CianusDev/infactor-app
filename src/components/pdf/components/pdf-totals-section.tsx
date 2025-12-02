import { Text, View } from "@react-pdf/renderer";
import { TotalsData } from "../types";
import { createPDFStyles, formatCurrency } from "../styles";

export interface PDFTotalsSectionProps {
  styles: ReturnType<typeof createPDFStyles>;
  totals: TotalsData;
}

/**
 * Composant Section Totaux du PDF
 * Affiche le sous-total, la remise, la TVA et le total TTC
 */
export function PDFTotalsSection({ styles, totals }: PDFTotalsSectionProps) {
  const { subtotal, taxRate, taxAmount, discount, total, currency } = totals;

  return (
    <View style={styles.totalsSection}>
      <View style={styles.totalsContainer}>
        {/* Sous-total HT */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Sous-total HT</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(subtotal, currency)}
          </Text>
        </View>

        {/* Remise (si applicable) */}
        {discount && discount > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Remise</Text>
            <Text style={styles.totalDiscount}>
              -{formatCurrency(discount, currency)}
            </Text>
          </View>
        )}

        {/* TVA */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TVA ({taxRate}%)</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(taxAmount, currency)}
          </Text>
        </View>

        {/* Séparateur */}
        <View style={styles.separator} />

        {/* Total TTC */}
        <View style={styles.grandTotalRow}>
          <Text style={styles.grandTotalLabel}>Total TTC</Text>
          <Text style={styles.grandTotalValue}>
            {formatCurrency(total, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
}
