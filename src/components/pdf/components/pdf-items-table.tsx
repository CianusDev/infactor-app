import { Text, View } from "@react-pdf/renderer";
import { InvoiceItemData } from "../types";
import { createPDFStyles, formatCurrency } from "../styles";

export interface PDFItemsTableProps {
  styles: ReturnType<typeof createPDFStyles>;
  items: InvoiceItemData[];
  currency: string;
}

/**
 * Composant Tableau des Articles du PDF
 * Affiche la liste des articles avec description, quantité, prix unitaire et total
 */
export function PDFItemsTable({ styles, items, currency }: PDFItemsTableProps) {
  return (
    <View style={styles.table}>
      {/* Header du tableau */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.colDescription]}>
          Description
        </Text>
        <Text style={[styles.tableHeaderText, styles.colQuantity]}>Qté</Text>
        <Text style={[styles.tableHeaderText, styles.colPrice]}>
          Prix unit.
        </Text>
        <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
      </View>

      {/* Lignes du tableau */}
      {items.map((item, index) => (
        <View
          key={index}
          style={[styles.tableRow, index % 2 === 0 ? styles.tableRowAlt : {}]}
        >
          <Text style={styles.colDescription}>{item.description}</Text>
          <Text style={styles.colQuantity}>{item.quantity}</Text>
          <Text style={styles.colPrice}>
            {formatCurrency(item.unitPrice, currency)}
          </Text>
          <Text style={[styles.colTotal, styles.itemTotal]}>
            {formatCurrency(item.total, currency)}
          </Text>
        </View>
      ))}
    </View>
  );
}
