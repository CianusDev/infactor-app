"use client";

import { cn } from "@/lib/utils";
import { TemplateConfig } from "@/server/modules/template/template.schema";
import { InvoicePreviewData } from "@/hooks/use-template-customizer";

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
}

function DocumentHeader({ data, config, headerAlign }: DocumentHeaderProps) {
  const { primaryColor, secondaryColor, showLogo } = config;

  return (
    <header className={cn("flex flex-col mb-[30px]", headerAlign)}>
      {/* Logo */}
      {showLogo && (
        <div
          className="w-[120px] h-[40px] mb-[10px] flex items-center justify-center rounded"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="text-white font-bold text-sm">LOGO</span>
        </div>
      )}

      {/* Nom entreprise */}
      <h1
        className="text-lg font-bold"
        style={{ color: primaryColor }}
      >
        {data.companyName}
      </h1>

      {/* Adresse */}
      <p className="mt-[2px]" style={{ color: secondaryColor }}>
        {data.companyAddress}
      </p>
      <p className="mt-[2px]" style={{ color: secondaryColor }}>
        {data.companyPostalCode} {data.companyCity}, {data.companyCountry}
      </p>

      {/* Téléphone */}
      {data.companyPhone && (
        <p className="mt-[2px]" style={{ color: secondaryColor }}>
          Tél: {data.companyPhone}
        </p>
      )}

      {/* Email */}
      {data.companyEmail && (
        <p className="mt-[2px]" style={{ color: secondaryColor }}>
          {data.companyEmail}
        </p>
      )}

      {/* SIRET */}
      {data.companySiret && (
        <p className="text-[9px] mt-[5px]" style={{ color: secondaryColor }}>
          SIRET: {data.companySiret}
        </p>
      )}

      {/* TVA */}
      {data.companyVatNumber && (
        <p className="text-[9px]" style={{ color: secondaryColor }}>
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
      className={cn(
        "mb-[30px]",
        layout === "modern" && "text-center",
        layout === "minimal" && "border-b-2 pb-[10px]"
      )}
      style={{
        borderColor: layout === "minimal" ? primaryColor : undefined,
      }}
    >
      <h2
        className="text-2xl font-bold tracking-widest"
        style={{ color: primaryColor }}
      >
        FACTURE
      </h2>
      <p className="text-sm mt-[5px]" style={{ color: secondaryColor }}>
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
  const { primaryColor, secondaryColor, layout } = config;

  return (
    <div className="flex justify-between mb-[30px]">
      {/* Dates */}
      <div className="flex-1">
        <div className="flex mb-[5px]">
          <span className="font-semibold mr-[5px]" style={{ color: primaryColor }}>
            Date d&apos;émission:
          </span>
          <span style={{ color: secondaryColor }}>{data.issueDate}</span>
        </div>
        <div className="flex mb-[5px]">
          <span className="font-semibold mr-[5px]" style={{ color: primaryColor }}>
            Date d&apos;échéance:
          </span>
          <span style={{ color: secondaryColor }}>{data.dueDate}</span>
        </div>
      </div>

      {/* Client */}
      <div
        className={cn(
          "w-[200px] p-[15px] rounded",
          layout === "modern" ? "bg-gray-50" : "border"
        )}
        style={{
          borderColor: layout !== "modern" ? secondaryColor : undefined,
        }}
      >
        <h3
          className="text-xs font-bold uppercase tracking-wide mb-[8px]"
          style={{ color: primaryColor }}
        >
          Facturer à
        </h3>
        <p className="font-semibold mb-[3px]" style={{ color: primaryColor }}>
          {data.clientName}
        </p>

        {data.clientAddress && (
          <p className="mb-[2px]" style={{ color: secondaryColor }}>
            {data.clientAddress}
          </p>
        )}

        {(data.clientPostalCode || data.clientCity) && (
          <p className="mb-[2px]" style={{ color: secondaryColor }}>
            {data.clientPostalCode} {data.clientCity}
            {data.clientCountry ? `, ${data.clientCountry}` : ""}
          </p>
        )}

        {data.clientEmail && (
          <p className="mt-[8px]" style={{ color: secondaryColor }}>
            {data.clientEmail}
          </p>
        )}

        {data.clientSiret && (
          <p className="text-[9px] mt-[5px]" style={{ color: secondaryColor }}>
            SIRET: {data.clientSiret}
          </p>
        )}

        {data.clientVatNumber && (
          <p className="text-[9px]" style={{ color: secondaryColor }}>
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

function DocumentItemsTable({ items, currency, config }: DocumentItemsTableProps) {
  const { primaryColor, secondaryColor, layout } = config;

  return (
    <div className="mb-[30px]">
      {/* Header */}
      <div
        className={cn(
          "flex py-[10px] px-[10px]",
          layout === "modern" && "text-white",
          layout !== "modern" && "border-b",
          layout === "minimal" && "border-b-2"
        )}
        style={{
          backgroundColor: layout === "modern" ? primaryColor : undefined,
          borderColor: layout === "minimal" ? primaryColor : secondaryColor,
        }}
      >
        <div
          className="flex-[3] font-semibold"
          style={{ color: layout === "modern" ? "white" : primaryColor }}
        >
          Description
        </div>
        <div
          className="w-[60px] text-center font-semibold"
          style={{ color: layout === "modern" ? "white" : primaryColor }}
        >
          Qté
        </div>
        <div
          className="w-[80px] text-right font-semibold"
          style={{ color: layout === "modern" ? "white" : primaryColor }}
        >
          Prix unit.
        </div>
        <div
          className="w-[80px] text-right font-semibold"
          style={{ color: layout === "modern" ? "white" : primaryColor }}
        >
          Total
        </div>
      </div>

      {/* Rows */}
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex py-[10px] px-[10px] border-b",
            layout === "modern" && index % 2 === 0 && "bg-gray-50"
          )}
          style={{ borderColor: `${secondaryColor}30` }}
        >
          <div className="flex-[3]" style={{ color: secondaryColor }}>
            {item.description}
          </div>
          <div className="w-[60px] text-center" style={{ color: secondaryColor }}>
            {item.quantity}
          </div>
          <div className="w-[80px] text-right" style={{ color: secondaryColor }}>
            {formatCurrency(item.unitPrice, currency)}
          </div>
          <div
            className="w-[80px] text-right font-semibold"
            style={{ color: primaryColor }}
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
    <div className="flex justify-end mb-[30px]">
      <div className="w-[250px]">
        {/* Sous-total */}
        <div className="flex justify-between py-[5px]">
          <span style={{ color: secondaryColor }}>Sous-total HT</span>
          <span style={{ color: primaryColor }}>
            {formatCurrency(data.subtotal, data.currency)}
          </span>
        </div>

        {/* Remise */}
        {data.discount && data.discount > 0 && (
          <div className="flex justify-between py-[5px]">
            <span style={{ color: secondaryColor }}>Remise</span>
            <span className="text-green-600">
              -{formatCurrency(data.discount, data.currency)}
            </span>
          </div>
        )}

        {/* TVA */}
        <div className="flex justify-between py-[5px]">
          <span style={{ color: secondaryColor }}>TVA ({data.taxRate}%)</span>
          <span style={{ color: primaryColor }}>
            {formatCurrency(data.taxAmount, data.currency)}
          </span>
        </div>

        {/* Séparateur */}
        <div
          className="border-b my-[5px]"
          style={{ borderColor: secondaryColor }}
        />

        {/* Total TTC */}
        <div
          className={cn(
            "flex justify-between py-[10px] text-sm font-bold",
            layout === "modern" && "rounded px-[10px] -mx-[10px]"
          )}
          style={{
            backgroundColor: layout === "modern" ? `${primaryColor}10` : undefined,
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
  const { primaryColor, secondaryColor } = config;

  if (!notes && !terms) {
    return null;
  }

  return (
    <div
      className="mt-[30px] pt-[20px] border-t"
      style={{ borderColor: `${secondaryColor}30` }}
    >
      {notes && (
        <div className="mb-[15px]">
          <h4 className="font-semibold mb-[5px]" style={{ color: primaryColor }}>
            Notes
          </h4>
          <p
            className="text-xs leading-relaxed whitespace-pre-line"
            style={{ color: secondaryColor }}
          >
            {notes}
          </p>
        </div>
      )}

      {terms && (
        <div>
          <h4 className="font-semibold mb-[5px]" style={{ color: primaryColor }}>
            Conditions de paiement
          </h4>
          <p
            className="text-xs leading-relaxed whitespace-pre-line"
            style={{ color: secondaryColor }}
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
  const { secondaryColor } = config;

  if (!footerText) {
    return null;
  }

  return (
    <footer
      className="absolute bottom-[40px] left-[40px] right-[40px] text-center pt-[15px] border-t"
      style={{
        color: secondaryColor,
        borderColor: `${secondaryColor}30`,
      }}
    >
      <p className="text-xs">{footerText}</p>
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
    showWatermark = false,
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
    showWatermark,
    headerPosition,
    footerText,
  };

  // Alignement du header
  const headerAlign =
    headerPosition === "center"
      ? "items-center text-center"
      : headerPosition === "right"
        ? "items-end text-right"
        : "items-start text-left";

  return (
    <div
      className={cn("relative bg-white shadow-lg print:shadow-none", className)}
      style={{
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
        fontSize: `${fontSize}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        width: "210mm",
        minHeight: "297mm",
        padding: "40px",
      }}
    >
      {/* Watermark */}
      {showWatermark && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            fontSize: "100px",
            color: primaryColor,
            opacity: 0.05,
            transform: "rotate(-30deg)",
          }}
        >
          <span className="font-bold">{data.companyName}</span>
        </div>
      )}

      {/* Barre colorée pour le layout moderne */}
      {layout === "modern" && (
        <div
          className="absolute top-0 left-0 right-0 h-[8px]"
          style={{ backgroundColor: primaryColor }}
        />
      )}

      {/* Header */}
      <DocumentHeader
        data={data}
        config={fullConfig}
        headerAlign={headerAlign}
      />

      {/* Titre */}
      <DocumentTitle
        invoiceNumber={data.invoiceNumber}
        config={fullConfig}
      />

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
        className
      )}
    />
  );
}
