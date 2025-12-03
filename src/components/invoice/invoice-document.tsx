"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { TemplateConfig } from "@/server/modules/template/template.schema";
import { InvoicePreviewData } from "@/hooks/use-template-customizer";

// ============================================
// CONSTANTES PARTAGÉES AVEC LE PDF
// ============================================

const SPACING = {
  page: 40,
  sectionMargin: 30,
  elementMargin: 10,
  smallMargin: 5,
  tinyMargin: 2,
  cardPadding: 15,
  tableCellPaddingV: 10,
  tableCellPaddingH: 10,
  topBarHeight: 8,
  logoWidth: 120,
  logoHeight: 50,
  logoPlaceholderHeight: 40,
  clientSectionWidth: 200,
  totalsWidth: 250,
  colQuantityWidth: 60,
  colPriceWidth: 80,
  colTotalWidth: 80,
};

const FONT_SIZES = {
  title: 24,
  companyName: 18,
  invoiceNumber: 14,
  grandTotal: 14,
  small: 9,
};

// ============================================
// TYPES
// ============================================

export interface InvoiceDocumentProps {
  config: TemplateConfig;
  data: InvoicePreviewData;
  scale?: number;
  className?: string;
}

// ============================================
// UTILITAIRES
// ============================================

function formatCurrency(amount: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount);
}

// ============================================
// SOUS-COMPOSANTS
// ============================================

interface DocumentHeaderProps {
  data: InvoicePreviewData;
  config: TemplateConfig;
  headerAlign: string;
  headerTextAlign: "left" | "center" | "right";
}

function DocumentHeader({
  data,
  config,
  headerAlign,
  headerTextAlign,
}: DocumentHeaderProps) {
  const {
    primaryColor,
    secondaryColor,
    showLogo,
    logoUrl,
    fontSize = 12,
  } = config;
  const displayLogo = data.companyLogo || logoUrl;

  return (
    <header
      className={cn("flex flex-col", headerAlign)}
      style={{ marginBottom: SPACING.sectionMargin }}
    >
      {/* Logo */}
      {showLogo !== false && (
        <>
          {displayLogo ? (
            <div style={{ marginBottom: SPACING.elementMargin }}>
              <Image
                src={displayLogo}
                alt="Logo"
                width={SPACING.logoWidth}
                height={SPACING.logoHeight}
                style={{ objectFit: "contain" }}
                unoptimized
              />
            </div>
          ) : (
            <div
              style={{
                width: SPACING.logoWidth,
                height: SPACING.logoPlaceholderHeight,
                backgroundColor: primaryColor,
                marginBottom: SPACING.elementMargin,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
              }}
            >
              <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>
                LOGO
              </span>
            </div>
          )}
        </>
      )}

      {/* Nom entreprise */}
      <h1
        style={{
          fontSize: FONT_SIZES.companyName,
          fontWeight: 700,
          color: primaryColor,
          textAlign: headerTextAlign,
          margin: 0,
        }}
      >
        {data.companyName}
      </h1>

      {/* Adresse */}
      <p
        style={{
          fontSize: fontSize - 1,
          color: secondaryColor,
          textAlign: headerTextAlign,
          marginTop: SPACING.tinyMargin,
          marginBottom: 0,
        }}
      >
        {data.companyAddress}
      </p>
      <p
        style={{
          fontSize: fontSize - 1,
          color: secondaryColor,
          textAlign: headerTextAlign,
          marginTop: SPACING.tinyMargin,
          marginBottom: 0,
        }}
      >
        {data.companyPostalCode} {data.companyCity}, {data.companyCountry}
      </p>

      {/* Téléphone */}
      {data.companyPhone && (
        <p
          style={{
            fontSize: fontSize - 1,
            color: secondaryColor,
            textAlign: headerTextAlign,
            marginTop: SPACING.tinyMargin,
            marginBottom: 0,
          }}
        >
          Tél: {data.companyPhone}
        </p>
      )}

      {/* Email */}
      {data.companyEmail && (
        <p
          style={{
            fontSize: fontSize - 1,
            color: secondaryColor,
            textAlign: headerTextAlign,
            marginTop: SPACING.tinyMargin,
            marginBottom: 0,
          }}
        >
          {data.companyEmail}
        </p>
      )}

      {/* SIRET */}
      {data.companySiret && (
        <p
          style={{
            fontSize: FONT_SIZES.small,
            color: secondaryColor,
            textAlign: headerTextAlign,
            marginTop: SPACING.smallMargin,
            marginBottom: 0,
          }}
        >
          SIRET: {data.companySiret}
        </p>
      )}

      {/* TVA */}
      {data.companyVatNumber && (
        <p
          style={{
            fontSize: FONT_SIZES.small,
            color: secondaryColor,
            textAlign: headerTextAlign,
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          N° TVA: {data.companyVatNumber}
        </p>
      )}
    </header>
  );
}

interface DocumentTitleProps {
  invoiceNumber: string;
  config: TemplateConfig;
}

function DocumentTitle({ invoiceNumber, config }: DocumentTitleProps) {
  const { primaryColor, secondaryColor, layout } = config;

  return (
    <div
      style={{
        marginBottom: SPACING.sectionMargin,
        textAlign: layout === "modern" ? "center" : "left",
        borderBottomWidth: layout === "minimal" ? 2 : 0,
        borderBottomStyle: "solid",
        borderBottomColor: layout === "minimal" ? primaryColor : "transparent",
        paddingBottom: layout === "minimal" ? SPACING.elementMargin : 0,
      }}
    >
      <h2
        style={{
          fontSize: FONT_SIZES.title,
          fontWeight: 700,
          color: primaryColor,
          letterSpacing: 2,
          margin: 0,
        }}
      >
        FACTURE
      </h2>
      <p
        style={{
          fontSize: FONT_SIZES.invoiceNumber,
          color: secondaryColor,
          marginTop: SPACING.smallMargin,
          marginBottom: 0,
        }}
      >
        N° {invoiceNumber}
      </p>
    </div>
  );
}

interface DocumentInfoSectionProps {
  data: InvoicePreviewData;
  config: TemplateConfig;
}

function DocumentInfoSection({ data, config }: DocumentInfoSectionProps) {
  const { primaryColor, secondaryColor, layout, fontSize = 12 } = config;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: SPACING.sectionMargin,
      }}
    >
      {/* Dates */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", marginBottom: SPACING.smallMargin }}>
          <span
            style={{
              fontWeight: 600,
              color: primaryColor,
              marginRight: SPACING.smallMargin,
            }}
          >
            Date d&apos;émission:
          </span>
          <span style={{ color: secondaryColor }}>{data.issueDate}</span>
        </div>
        <div style={{ display: "flex", marginBottom: SPACING.smallMargin }}>
          <span
            style={{
              fontWeight: 600,
              color: primaryColor,
              marginRight: SPACING.smallMargin,
            }}
          >
            Date d&apos;échéance:
          </span>
          <span style={{ color: secondaryColor }}>{data.dueDate}</span>
        </div>
      </div>

      {/* Client */}
      <div
        style={{
          width: SPACING.clientSectionWidth,
          padding: SPACING.cardPadding,
          backgroundColor: layout === "modern" ? "#f9fafb" : "transparent",
          border: layout !== "modern" ? `1px solid ${secondaryColor}` : "none",
          borderRadius: 4,
        }}
      >
        <h3
          style={{
            fontSize: fontSize - 1,
            fontWeight: 700,
            color: primaryColor,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          Facturer à
        </h3>
        <p
          style={{
            fontWeight: 600,
            color: primaryColor,
            marginBottom: 3,
            marginTop: 0,
          }}
        >
          {data.clientName}
        </p>

        {data.clientAddress && (
          <p
            style={{
              color: secondaryColor,
              marginBottom: SPACING.tinyMargin,
              marginTop: 0,
            }}
          >
            {data.clientAddress}
          </p>
        )}

        {(data.clientPostalCode || data.clientCity) && (
          <p
            style={{
              color: secondaryColor,
              marginBottom: SPACING.tinyMargin,
              marginTop: 0,
            }}
          >
            {data.clientPostalCode} {data.clientCity}
            {data.clientCountry ? `, ${data.clientCountry}` : ""}
          </p>
        )}

        {data.clientEmail && (
          <p
            style={{
              color: secondaryColor,
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            {data.clientEmail}
          </p>
        )}

        {data.clientSiret && (
          <p
            style={{
              fontSize: FONT_SIZES.small,
              color: secondaryColor,
              marginTop: SPACING.smallMargin,
              marginBottom: 0,
            }}
          >
            SIRET: {data.clientSiret}
          </p>
        )}

        {data.clientVatNumber && (
          <p
            style={{
              fontSize: FONT_SIZES.small,
              color: secondaryColor,
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            N° TVA: {data.clientVatNumber}
          </p>
        )}
      </div>
    </div>
  );
}

interface DocumentItemsTableProps {
  items: InvoicePreviewData["items"];
  currency: string;
  config: TemplateConfig;
}

function DocumentItemsTable({
  items,
  currency,
  config,
}: DocumentItemsTableProps) {
  const { primaryColor, secondaryColor, layout } = config;

  const headerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    backgroundColor: layout === "modern" ? primaryColor : "transparent",
    paddingTop: SPACING.tableCellPaddingV,
    paddingBottom: SPACING.tableCellPaddingV,
    paddingLeft: SPACING.tableCellPaddingH,
    paddingRight: SPACING.tableCellPaddingH,
    borderBottom:
      layout !== "modern"
        ? `1px solid ${layout === "minimal" ? primaryColor : secondaryColor}`
        : "none",
  };

  const headerTextColor = layout === "modern" ? "white" : primaryColor;

  return (
    <div style={{ marginBottom: SPACING.sectionMargin }}>
      {/* Header */}
      <div style={headerStyle}>
        <div
          style={{
            flex: 3,
            fontWeight: 600,
            color: headerTextColor,
          }}
        >
          Description
        </div>
        <div
          style={{
            width: SPACING.colQuantityWidth,
            textAlign: "center",
            fontWeight: 600,
            color: headerTextColor,
          }}
        >
          Qté
        </div>
        <div
          style={{
            width: SPACING.colPriceWidth,
            textAlign: "right",
            fontWeight: 600,
            color: headerTextColor,
          }}
        >
          Prix unit.
        </div>
        <div
          style={{
            width: SPACING.colTotalWidth,
            textAlign: "right",
            fontWeight: 600,
            color: headerTextColor,
          }}
        >
          Total
        </div>
      </div>

      {/* Rows */}
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "row",
            paddingTop: SPACING.tableCellPaddingV,
            paddingBottom: SPACING.tableCellPaddingV,
            paddingLeft: SPACING.tableCellPaddingH,
            paddingRight: SPACING.tableCellPaddingH,
            borderBottom: `1px solid ${secondaryColor}30`,
            backgroundColor:
              layout === "modern" && index % 2 === 0
                ? "#f9fafb"
                : "transparent",
          }}
        >
          <div style={{ flex: 3, color: secondaryColor }}>
            {item.description}
          </div>
          <div
            style={{
              width: SPACING.colQuantityWidth,
              textAlign: "center",
              color: secondaryColor,
            }}
          >
            {item.quantity}
          </div>
          <div
            style={{
              width: SPACING.colPriceWidth,
              textAlign: "right",
              color: secondaryColor,
            }}
          >
            {formatCurrency(item.unitPrice, currency)}
          </div>
          <div
            style={{
              width: SPACING.colTotalWidth,
              textAlign: "right",
              fontWeight: 600,
              color: primaryColor,
            }}
          >
            {formatCurrency(item.total, currency)}
          </div>
        </div>
      ))}
    </div>
  );
}

interface DocumentTotalsProps {
  data: InvoicePreviewData;
  config: TemplateConfig;
}

function DocumentTotals({ data, config }: DocumentTotalsProps) {
  const { primaryColor, secondaryColor, layout } = config;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: SPACING.sectionMargin,
      }}
    >
      <div style={{ width: SPACING.totalsWidth }}>
        {/* Sous-total */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: SPACING.smallMargin,
            paddingBottom: SPACING.smallMargin,
          }}
        >
          <span style={{ color: secondaryColor }}>Sous-total HT</span>
          <span style={{ color: primaryColor }}>
            {formatCurrency(data.subtotal, data.currency)}
          </span>
        </div>

        {/* Remise */}
        {data.discount && data.discount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: SPACING.smallMargin,
              paddingBottom: SPACING.smallMargin,
            }}
          >
            <span style={{ color: secondaryColor }}>Remise</span>
            <span style={{ color: "#16a34a" }}>
              -{formatCurrency(data.discount, data.currency)}
            </span>
          </div>
        )}

        {/* TVA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: SPACING.smallMargin,
            paddingBottom: SPACING.smallMargin,
          }}
        >
          <span style={{ color: secondaryColor }}>TVA ({data.taxRate}%)</span>
          <span style={{ color: primaryColor }}>
            {formatCurrency(data.taxAmount, data.currency)}
          </span>
        </div>

        {/* Séparateur */}
        <div
          style={{
            borderBottom: `1px solid ${secondaryColor}`,
            marginTop: SPACING.smallMargin,
            marginBottom: SPACING.smallMargin,
          }}
        />

        {/* Total TTC */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: SPACING.tableCellPaddingV,
            paddingBottom: SPACING.tableCellPaddingV,
            paddingLeft: layout === "modern" ? SPACING.tableCellPaddingH : 0,
            paddingRight: layout === "modern" ? SPACING.tableCellPaddingH : 0,
            backgroundColor:
              layout === "modern" ? `${primaryColor}10` : "transparent",
            borderRadius: layout === "modern" ? 4 : 0,
            fontSize: FONT_SIZES.grandTotal,
            fontWeight: 700,
            color: primaryColor,
          }}
        >
          <span>Total TTC</span>
          <span>{formatCurrency(data.total, data.currency)}</span>
        </div>
      </div>
    </div>
  );
}

interface DocumentNotesProps {
  notes?: string;
  terms?: string;
  config: TemplateConfig;
}

function DocumentNotes({ notes, terms, config }: DocumentNotesProps) {
  const { primaryColor, secondaryColor, fontSize = 12 } = config;

  if (!notes && !terms) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: SPACING.sectionMargin,
        paddingTop: 20,
        borderTop: `1px solid ${secondaryColor}30`,
      }}
    >
      {notes && (
        <div style={{ marginBottom: 15 }}>
          <h4
            style={{
              fontWeight: 600,
              color: primaryColor,
              marginBottom: SPACING.smallMargin,
              marginTop: 0,
            }}
          >
            Notes
          </h4>
          <p
            style={{
              fontSize: fontSize - 1,
              color: secondaryColor,
              lineHeight: 1.5,
              whiteSpace: "pre-line",
              margin: 0,
            }}
          >
            {notes}
          </p>
        </div>
      )}

      {terms && (
        <div>
          <h4
            style={{
              fontWeight: 600,
              color: primaryColor,
              marginBottom: SPACING.smallMargin,
              marginTop: 0,
            }}
          >
            Conditions de paiement
          </h4>
          <p
            style={{
              fontSize: fontSize - 1,
              color: secondaryColor,
              lineHeight: 1.5,
              whiteSpace: "pre-line",
              margin: 0,
            }}
          >
            {terms}
          </p>
        </div>
      )}
    </div>
  );
}

interface DocumentFooterProps {
  footerText?: string;
  config: TemplateConfig;
}

function DocumentFooter({ footerText, config }: DocumentFooterProps) {
  const { secondaryColor, fontSize = 12 } = config;

  if (!footerText) {
    return null;
  }

  return (
    <footer
      style={{
        position: "absolute",
        bottom: SPACING.page,
        left: SPACING.page,
        right: SPACING.page,
        textAlign: "center",
        paddingTop: 15,
        borderTop: `1px solid ${secondaryColor}30`,
        fontSize: fontSize - 1,
        color: secondaryColor,
      }}
    >
      <p style={{ margin: 0 }}>{footerText}</p>
    </footer>
  );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

/**
 * Composant InvoiceDocument
 * Preview web fidèle au rendu PDF
 * Utilise les mêmes dimensions et espacements que le PDF
 */
export function InvoiceDocument({
  config,
  data,
  scale = 1,
  className,
}: InvoiceDocumentProps) {
  const {
    primaryColor = "#1f2937",
    secondaryColor = "#6b7280",
    fontSize = 12,
    layout = "classic",
    headerPosition = "left",
    footerText = "",
  } = config;

  // Configuration complète avec valeurs par défaut
  const fullConfig: TemplateConfig = {
    ...config,
    primaryColor,
    secondaryColor,
    fontSize,
    layout,
    headerPosition,
    footerText,
  };

  // Alignement du header
  const headerAlign =
    headerPosition === "center"
      ? "items-center"
      : headerPosition === "right"
        ? "items-end"
        : "items-start";

  const headerTextAlign: "left" | "center" | "right" =
    headerPosition === "center"
      ? "center"
      : headerPosition === "right"
        ? "right"
        : "left";

  return (
    <div
      className={cn("relative bg-white shadow-lg print:shadow-none", className)}
      style={{
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
        fontSize: fontSize,
        color: secondaryColor,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        width: "210mm",
        minHeight: "297mm",
        padding: SPACING.page,
      }}
    >
      {/* Barre colorée pour le layout moderne */}
      {layout === "modern" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: SPACING.topBarHeight,
            backgroundColor: primaryColor,
          }}
        />
      )}

      {/* Header */}
      <DocumentHeader
        data={data}
        config={fullConfig}
        headerAlign={headerAlign}
        headerTextAlign={headerTextAlign}
      />

      {/* Titre */}
      <DocumentTitle invoiceNumber={data.invoiceNumber} config={fullConfig} />

      {/* Section infos */}
      <DocumentInfoSection data={data} config={fullConfig} />

      {/* Tableau des articles */}
      <DocumentItemsTable
        items={data.items}
        currency={data.currency}
        config={fullConfig}
      />

      {/* Totaux */}
      <DocumentTotals data={data} config={fullConfig} />

      {/* Notes */}
      <DocumentNotes
        notes={data.notes}
        terms={data.terms}
        config={fullConfig}
      />

      {/* Footer */}
      <DocumentFooter footerText={footerText} config={fullConfig} />
    </div>
  );
}

/**
 * Skeleton de chargement
 */
export function InvoiceDocumentSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-gray-100 animate-pulse rounded-lg",
        "w-[210mm] min-h-[297mm]",
        className,
      )}
    />
  );
}
