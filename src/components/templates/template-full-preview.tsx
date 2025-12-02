"use client";

import { cn } from "@/lib/utils";
import { TemplateConfig } from "@/server/modules/template/template.schema";
import { InvoicePreviewData } from "@/hooks/use-template-customizer";
import { Separator } from "@/components/ui/separator";

export interface TemplateFullPreviewProps {
  config: TemplateConfig;
  data: InvoicePreviewData;
  scale?: number;
  className?: string;
}

/**
 * Composant de prévisualisation complète d'une facture
 * Affiche une facture en taille réelle avec toutes les données
 */
export function TemplateFullPreview({
  config,
  data,
  scale = 1,
  className,
}: TemplateFullPreviewProps) {
  const {
    primaryColor = "#1f2937",
    secondaryColor = "#6b7280",
    fontFamily = "Inter",
    fontSize = 12,
    layout = "classic",
    showLogo = true,
    showWatermark = false,
    headerPosition = "left",
    footerText = "",
  } = config;

  // Alignement du header
  const headerAlign =
    headerPosition === "center"
      ? "text-center items-center"
      : headerPosition === "right"
        ? "text-right items-end"
        : "text-left items-start";

  // Formatage des montants
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: data.currency || "EUR",
    }).format(amount);
  };

  return (
    <div
      className={cn("relative bg-white shadow-lg", className)}
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        width: "210mm", // Format A4
        minHeight: "297mm",
        padding: "20mm",
      }}
    >
      {/* Watermark */}
      {showWatermark && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5"
          style={{ fontSize: "120px", color: primaryColor }}
        >
          <span className="font-bold rotate-[-30deg]">{data.companyName}</span>
        </div>
      )}

      {/* Bande colorée pour le layout moderne */}
      {layout === "modern" && (
        <div
          className="absolute top-0 left-0 right-0 h-3"
          style={{ backgroundColor: primaryColor }}
        />
      )}

      {/* Header */}
      <header className={cn("flex flex-col mb-8", headerAlign)}>
        {/* Logo */}
        {showLogo && (
          <div className="mb-4">
            {data.companyLogo ? (
              <img
                src={data.companyLogo}
                alt={data.companyName}
                className="h-16 object-contain"
                style={{
                  marginLeft: headerPosition === "right" ? "auto" : undefined,
                  marginRight: headerPosition === "left" ? "auto" : undefined,
                }}
              />
            ) : (
              <div
                className="h-16 w-32 rounded flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: primaryColor }}
              >
                LOGO
              </div>
            )}
          </div>
        )}

        {/* Informations entreprise */}
        <div className={cn("flex flex-col gap-0.5", headerAlign)}>
          <h1 className="text-xl font-bold" style={{ color: primaryColor }}>
            {data.companyName}
          </h1>
          <p style={{ color: secondaryColor }}>{data.companyAddress}</p>
          <p style={{ color: secondaryColor }}>
            {data.companyPostalCode} {data.companyCity}, {data.companyCountry}
          </p>
          {data.companyPhone && (
            <p style={{ color: secondaryColor }}>Tél: {data.companyPhone}</p>
          )}
          {data.companyEmail && (
            <p style={{ color: secondaryColor }}>{data.companyEmail}</p>
          )}
          {data.companySiret && (
            <p className="text-xs mt-1" style={{ color: secondaryColor }}>
              SIRET: {data.companySiret}
            </p>
          )}
          {data.companyVatNumber && (
            <p className="text-xs" style={{ color: secondaryColor }}>
              N° TVA: {data.companyVatNumber}
            </p>
          )}
        </div>
      </header>

      {/* Titre FACTURE */}
      <div
        className={cn(
          "mb-8",
          layout === "modern" ? "text-center" : "",
          layout === "minimal" ? "border-b pb-4" : "",
        )}
        style={{ borderColor: layout === "minimal" ? primaryColor : undefined }}
      >
        <h2
          className="text-3xl font-bold tracking-wide"
          style={{ color: primaryColor }}
        >
          FACTURE
        </h2>
        <p className="text-lg mt-1" style={{ color: secondaryColor }}>
          N° {data.invoiceNumber}
        </p>
      </div>

      {/* Informations facture et client */}
      <div className="flex justify-between mb-8 gap-8">
        {/* Dates */}
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-semibold" style={{ color: primaryColor }}>
              Date d&apos;émission:
            </span>{" "}
            <span style={{ color: secondaryColor }}>{data.issueDate}</span>
          </div>
          <div>
            <span className="font-semibold" style={{ color: primaryColor }}>
              Date d&apos;échéance:
            </span>{" "}
            <span style={{ color: secondaryColor }}>{data.dueDate}</span>
          </div>
        </div>

        {/* Client */}
        <div
          className={cn(
            "p-4 rounded-lg min-w-[250px]",
            layout === "modern" ? "bg-gray-50" : "border",
          )}
          style={{
            borderColor: layout !== "modern" ? secondaryColor : undefined,
          }}
        >
          <h3
            className="font-bold mb-2 text-sm uppercase tracking-wide"
            style={{ color: primaryColor }}
          >
            Facturer à
          </h3>
          <p className="font-semibold" style={{ color: primaryColor }}>
            {data.clientName}
          </p>
          {data.clientAddress && (
            <p style={{ color: secondaryColor }}>{data.clientAddress}</p>
          )}
          {(data.clientPostalCode || data.clientCity) && (
            <p style={{ color: secondaryColor }}>
              {data.clientPostalCode} {data.clientCity}
              {data.clientCountry ? `, ${data.clientCountry}` : ""}
            </p>
          )}
          {data.clientEmail ? (
            <p className="mt-2" style={{ color: secondaryColor }}>
              {data.clientEmail}
            </p>
          ) : null}
          {data.clientSiret && (
            <p className="text-xs mt-1" style={{ color: secondaryColor }}>
              SIRET: {data.clientSiret}
            </p>
          )}
          {data.clientVatNumber && (
            <p className="text-xs" style={{ color: secondaryColor }}>
              N° TVA: {data.clientVatNumber}
            </p>
          )}
        </div>
      </div>

      {/* Tableau des articles */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr
              className={cn(
                layout === "modern" ? "text-white" : "",
                layout === "minimal" ? "border-b-2" : "",
              )}
              style={{
                backgroundColor: layout === "modern" ? primaryColor : undefined,
                borderColor: layout === "minimal" ? primaryColor : undefined,
              }}
            >
              <th
                className={cn(
                  "text-left py-3 px-4 font-semibold",
                  layout !== "modern" && "border-b",
                )}
                style={{
                  color: layout === "modern" ? "white" : primaryColor,
                  borderColor:
                    layout === "classic" ? secondaryColor : undefined,
                }}
              >
                Description
              </th>
              <th
                className={cn(
                  "text-center py-3 px-4 font-semibold w-24",
                  layout !== "modern" && "border-b",
                )}
                style={{
                  color: layout === "modern" ? "white" : primaryColor,
                  borderColor:
                    layout === "classic" ? secondaryColor : undefined,
                }}
              >
                Qté
              </th>
              <th
                className={cn(
                  "text-right py-3 px-4 font-semibold w-32",
                  layout !== "modern" && "border-b",
                )}
                style={{
                  color: layout === "modern" ? "white" : primaryColor,
                  borderColor:
                    layout === "classic" ? secondaryColor : undefined,
                }}
              >
                Prix unitaire
              </th>
              <th
                className={cn(
                  "text-right py-3 px-4 font-semibold w-32",
                  layout !== "modern" && "border-b",
                )}
                style={{
                  color: layout === "modern" ? "white" : primaryColor,
                  borderColor:
                    layout === "classic" ? secondaryColor : undefined,
                }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr
                key={index}
                className={cn(
                  layout === "modern" && index % 2 === 0 ? "bg-gray-50" : "",
                )}
              >
                <td
                  className="py-3 px-4 border-b"
                  style={{
                    color: secondaryColor,
                    borderColor: `${secondaryColor}30`,
                  }}
                >
                  {item.description}
                </td>
                <td
                  className="py-3 px-4 text-center border-b"
                  style={{
                    color: secondaryColor,
                    borderColor: `${secondaryColor}30`,
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  className="py-3 px-4 text-right border-b"
                  style={{
                    color: secondaryColor,
                    borderColor: `${secondaryColor}30`,
                  }}
                >
                  {formatCurrency(item.unitPrice)}
                </td>
                <td
                  className="py-3 px-4 text-right border-b font-medium"
                  style={{
                    color: primaryColor,
                    borderColor: `${secondaryColor}30`,
                  }}
                >
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totaux */}
      <div className="flex justify-end mb-8">
        <div className="w-72">
          {/* Sous-total */}
          <div className="flex justify-between py-2">
            <span style={{ color: secondaryColor }}>Sous-total HT</span>
            <span style={{ color: primaryColor }}>
              {formatCurrency(data.subtotal)}
            </span>
          </div>

          {/* Remise */}
          {data.discount && data.discount > 0 && (
            <div className="flex justify-between py-2">
              <span style={{ color: secondaryColor }}>Remise</span>
              <span className="text-green-600">
                -{formatCurrency(data.discount)}
              </span>
            </div>
          )}

          {/* TVA */}
          <div className="flex justify-between py-2">
            <span style={{ color: secondaryColor }}>TVA ({data.taxRate}%)</span>
            <span style={{ color: primaryColor }}>
              {formatCurrency(data.taxAmount)}
            </span>
          </div>

          <Separator className="my-2" />

          {/* Total TTC */}
          <div
            className={cn(
              "flex justify-between py-3 text-lg font-bold",
              layout === "modern" ? "rounded px-3 -mx-3" : "",
            )}
            style={{
              backgroundColor:
                layout === "modern" ? `${primaryColor}10` : undefined,
              color: primaryColor,
            }}
          >
            <span>Total TTC</span>
            <span>{formatCurrency(data.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes et conditions */}
      {(data.notes || data.terms) && (
        <div
          className="mt-8 pt-8 border-t"
          style={{ borderColor: `${secondaryColor}30` }}
        >
          {data.notes && (
            <div className="mb-4">
              <h4
                className="font-semibold mb-1"
                style={{ color: primaryColor }}
              >
                Notes
              </h4>
              <p
                className="text-sm whitespace-pre-line"
                style={{ color: secondaryColor }}
              >
                {data.notes}
              </p>
            </div>
          )}
          {data.terms && (
            <div>
              <h4
                className="font-semibold mb-1"
                style={{ color: primaryColor }}
              >
                Conditions de paiement
              </h4>
              <p
                className="text-sm whitespace-pre-line"
                style={{ color: secondaryColor }}
              >
                {data.terms}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {footerText && (
        <footer
          className="absolute bottom-8 left-8 right-8 text-center pt-4 border-t"
          style={{
            color: secondaryColor,
            borderColor: `${secondaryColor}30`,
          }}
        >
          <p className="text-sm">{footerText}</p>
        </footer>
      )}
    </div>
  );
}

/**
 * Skeleton de chargement pour TemplateFullPreview
 */
export function TemplateFullPreviewSkeleton({
  className,
}: {
  className?: string;
}) {
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
