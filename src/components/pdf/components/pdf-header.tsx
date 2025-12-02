import { Text, View } from "@react-pdf/renderer";
import { CompanyData } from "../types";
import { createPDFStyles } from "../styles";

export interface PDFHeaderProps {
  styles: ReturnType<typeof createPDFStyles>;
  company: CompanyData;
  showLogo?: boolean;
}

/**
 * Composant Header du PDF
 * Affiche le logo et les informations de l'entreprise
 */
export function PDFHeader({
  styles,
  company,
  showLogo = true,
}: PDFHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Logo */}
      {showLogo && (
        <View style={styles.logo}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
      )}

      {/* Nom de l'entreprise */}
      <Text style={styles.companyName}>{company.name}</Text>

      {/* Adresse */}
      <Text style={styles.companyInfo}>{company.address}</Text>
      <Text style={styles.companyInfo}>
        {company.postalCode} {company.city}, {company.country}
      </Text>

      {/* Téléphone */}
      {company.phone && (
        <Text style={styles.companyInfo}>Tél: {company.phone}</Text>
      )}

      {/* Email */}
      {company.email && <Text style={styles.companyInfo}>{company.email}</Text>}

      {/* SIRET */}
      {company.siret && (
        <Text style={[styles.companyInfo, { fontSize: 9, marginTop: 5 }]}>
          SIRET: {company.siret}
        </Text>
      )}

      {/* Numéro de TVA */}
      {company.vatNumber && (
        <Text style={[styles.companyInfo, { fontSize: 9 }]}>
          N° TVA: {company.vatNumber}
        </Text>
      )}
    </View>
  );
}
