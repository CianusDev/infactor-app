import { Text, View } from "@react-pdf/renderer";
import { ClientData } from "../types";
import { createPDFStyles } from "../styles";

export interface PDFInfoSectionProps {
  styles: ReturnType<typeof createPDFStyles>;
  issueDate: string;
  dueDate: string;
  client: ClientData;
}

/**
 * Composant Section Informations du PDF
 * Affiche les dates d'émission/échéance et les informations du client
 */
export function PDFInfoSection({
  styles,
  issueDate,
  dueDate,
  client,
}: PDFInfoSectionProps) {
  return (
    <View style={styles.infoSection}>
      {/* Dates */}
      <View style={styles.datesSection}>
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>Date d&apos;émission:</Text>
          <Text style={styles.dateValue}>{issueDate}</Text>
        </View>
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>Date d&apos;échéance:</Text>
          <Text style={styles.dateValue}>{dueDate}</Text>
        </View>
      </View>

      {/* Client */}
      <View style={styles.clientSection}>
        <Text style={styles.clientTitle}>Facturer à</Text>
        <Text style={styles.clientName}>{client.name}</Text>

        {/* Adresse */}
        {client.address && (
          <Text style={styles.clientInfo}>{client.address}</Text>
        )}

        {/* Ville et code postal */}
        {(client.postalCode || client.city) && (
          <Text style={styles.clientInfo}>
            {client.postalCode} {client.city}
            {client.country ? `, ${client.country}` : ""}
          </Text>
        )}

        {/* Email */}
        {client.email && (
          <Text style={[styles.clientInfo, { marginTop: 8 }]}>
            {client.email}
          </Text>
        )}

        {/* SIRET */}
        {client.siret && (
          <Text style={[styles.clientInfo, { fontSize: 9, marginTop: 5 }]}>
            SIRET: {client.siret}
          </Text>
        )}

        {/* Numéro de TVA */}
        {client.vatNumber && (
          <Text style={[styles.clientInfo, { fontSize: 9 }]}>
            N° TVA: {client.vatNumber}
          </Text>
        )}
      </View>
    </View>
  );
}
