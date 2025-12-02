import { Text, View } from "@react-pdf/renderer";
import { createPDFStyles } from "../styles";

export interface PDFFooterProps {
  styles: ReturnType<typeof createPDFStyles>;
  footerText?: string;
}

/**
 * Composant Footer du PDF
 * Affiche le texte de pied de page personnalisé
 */
export function PDFFooter({ styles, footerText }: PDFFooterProps) {
  // Ne rien afficher si pas de texte de footer
  if (!footerText) {
    return null;
  }

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{footerText}</Text>
    </View>
  );
}
