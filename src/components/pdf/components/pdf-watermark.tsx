import { Text, View, StyleSheet } from "@react-pdf/renderer";

export interface PDFWatermarkProps {
  companyName: string;
  primaryColor: string;
}

/**
 * Convertit une couleur hex en rgba avec opacité
 */
function hexToRgba(hex: string, alpha: number): string {
  // Enlever le # si présent
  const cleanHex = hex.replace("#", "");

  // Parser les composantes RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Composant Watermark (Filigrane) du PDF
 * Affiche le nom de l'entreprise en arrière-plan au centre de la page
 */
export function PDFWatermark({ companyName, primaryColor }: PDFWatermarkProps) {
  // Ne rien afficher si pas de nom d'entreprise
  if (!companyName) {
    return null;
  }

  // Couleur avec transparence (10% d'opacité pour être visible mais discret)
  const transparentColor = hexToRgba(primaryColor, 0.1);

  const styles = StyleSheet.create({
    watermarkContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    watermarkText: {
      fontSize: 48,
      fontWeight: 700,
      color: transparentColor,
      textAlign: "center",
      letterSpacing: 8,
    },
  });

  return (
    <View style={styles.watermarkContainer} fixed>
      <Text style={styles.watermarkText}>{companyName.toUpperCase()}</Text>
    </View>
  );
}
