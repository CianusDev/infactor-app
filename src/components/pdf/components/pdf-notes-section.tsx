import { Text, View } from "@react-pdf/renderer";
import { createPDFStyles } from "../styles";

export interface PDFNotesSectionProps {
  styles: ReturnType<typeof createPDFStyles>;
  notes?: string;
  terms?: string;
}

/**
 * Composant Section Notes du PDF
 * Affiche les notes et les conditions de paiement
 */
export function PDFNotesSection({
  styles,
  notes,
  terms,
}: PDFNotesSectionProps) {
  // Ne rien afficher si pas de notes ni de conditions
  if (!notes && !terms) {
    return null;
  }

  return (
    <View style={styles.notesSection}>
      {/* Notes */}
      {notes && (
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text style={styles.notesText}>{notes}</Text>
        </View>
      )}

      {/* Conditions de paiement */}
      {terms && (
        <View>
          <Text style={styles.notesTitle}>Conditions de paiement</Text>
          <Text style={styles.notesText}>{terms}</Text>
        </View>
      )}
    </View>
  );
}
