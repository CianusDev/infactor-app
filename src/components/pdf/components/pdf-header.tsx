import { Text, View, Image } from "@react-pdf/renderer";
import { CompanyData } from "../types";
import { createPDFStyles } from "../styles";

export interface PDFHeaderProps {
  styles: ReturnType<typeof createPDFStyles>;
  company: CompanyData;
  showLogo?: boolean;
  logoUrl?: string | null;
}

/**
 * Composant Header du PDF
 * Affiche le logo et les informations de l'entreprise
 */
export function PDFHeader({
  styles,
  company,
  showLogo = true,
  logoUrl,
}: PDFHeaderProps) {
  // Utiliser le logo de l'entreprise en priorité, sinon celui du template
  const displayLogo = company.logo || logoUrl;

  return (
    <View style={styles.header}>
      {/* Logo */}
      {showLogo && (
        <>
          {displayLogo ? (
            <Image
              src={displayLogo}
              style={{
                width: 120,
                height: 50,
                objectFit: "contain",
                marginBottom: 10,
              }}
            />
          ) : (
            <View style={styles.logo}>
              <Text style={styles.logoText}>LOGO</Text>
            </View>
          )}
        </>
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
