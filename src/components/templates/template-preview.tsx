"use client";

import { cn } from "@/lib/utils";
import { TemplateConfig } from "@/server/modules/template/template.schema";

export interface TemplatePreviewProps {
  config: TemplateConfig;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-32 h-44",
  md: "w-48 h-64",
  lg: "w-64 h-80",
};

const fontSizeClasses = {
  sm: {
    title: "text-[6px]",
    subtitle: "text-[5px]",
    body: "text-[4px]",
  },
  md: {
    title: "text-[8px]",
    subtitle: "text-[7px]",
    body: "text-[5px]",
  },
  lg: {
    title: "text-[10px]",
    subtitle: "text-[8px]",
    body: "text-[6px]",
  },
};

/**
 * Composant de prévisualisation visuelle d'un template de facture
 * Affiche une miniature représentative du style du template
 */
export function TemplatePreview({
  config,
  size = "md",
  className,
}: TemplatePreviewProps) {
  const {
    primaryColor = "#1f2937",
    secondaryColor = "#6b7280",
    layout = "classic",
    headerPosition = "left",
    showLogo = true,
    footerText = "Merci pour votre confiance.",
  } = config;

  const fonts = fontSizeClasses[size];

  // Déterminer l'alignement du header
  const headerAlign =
    headerPosition === "center"
      ? "items-center text-center"
      : headerPosition === "right"
        ? "items-end text-right"
        : "items-start text-left";

  return (
    <div
      className={cn(
        "relative rounded-md border bg-white shadow-sm overflow-hidden",
        sizeClasses[size],
        className,
      )}
    >
      {/* Contenu du template */}
      <div className="flex flex-col h-full p-2">
        {/* Header */}
        <div className={cn("flex flex-col mb-2", headerAlign)}>
          {/* Logo placeholder */}
          {showLogo && (
            <div
              className="rounded mb-1"
              style={{
                backgroundColor: primaryColor,
                width: size === "sm" ? 16 : size === "md" ? 20 : 28,
                height: size === "sm" ? 8 : size === "md" ? 10 : 14,
              }}
            />
          )}
          {/* Company name placeholder */}
          <div
            className={cn("font-semibold truncate", fonts.title)}
            style={{ color: primaryColor }}
          >
            Entreprise
          </div>
          <div
            className={cn("truncate opacity-70", fonts.subtitle)}
            style={{ color: secondaryColor }}
          >
            123 Rue Example
          </div>
        </div>

        {/* Titre FACTURE */}
        <div
          className={cn(
            "font-bold mb-2",
            fonts.title,
            layout === "modern" ? "text-center" : "",
          )}
          style={{ color: primaryColor }}
        >
          FACTURE
        </div>

        {/* Infos client (simulées) */}
        <div className="flex justify-between mb-2">
          <div className={cn("flex flex-col", fonts.body)}>
            <span style={{ color: primaryColor }} className="font-medium">
              Client
            </span>
            <span className="text-gray-500">Nom du client</span>
          </div>
          <div className={cn("flex flex-col text-right", fonts.body)}>
            <span style={{ color: primaryColor }} className="font-medium">
              Date
            </span>
            <span className="text-gray-500">01/01/2025</span>
          </div>
        </div>

        {/* Tableau des items (simulé) */}
        <div className="flex-1 mb-2">
          {/* Header du tableau */}
          <div
            className={cn("flex justify-between py-0.5 border-b", fonts.body)}
            style={{ borderColor: secondaryColor }}
          >
            <span style={{ color: primaryColor }} className="font-medium">
              Description
            </span>
            <span style={{ color: primaryColor }} className="font-medium">
              Total
            </span>
          </div>
          {/* Lignes simulées */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn("flex justify-between py-0.5", fonts.body)}
              style={{ opacity: 1 - i * 0.2 }}
            >
              <span className="text-gray-600">Article {i}</span>
              <span className="text-gray-600">{i * 100}€</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          className={cn(
            "flex justify-between py-1 border-t font-semibold",
            fonts.subtitle,
          )}
          style={{ borderColor: primaryColor, color: primaryColor }}
        >
          <span>Total</span>
          <span>600€</span>
        </div>

        {/* Footer */}
        {footerText && (
          <div
            className={cn("text-center mt-auto pt-1 opacity-60", fonts.body)}
            style={{ color: secondaryColor }}
          >
            {footerText.substring(0, 30)}
            {footerText.length > 30 ? "..." : ""}
          </div>
        )}
      </div>

      {/* Badge layout (modern vs classic) */}
      {layout === "modern" && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: primaryColor }}
        />
      )}

      {/* Overlay pour effet visuel */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent to-black/5" />
    </div>
  );
}

/**
 * Skeleton de chargement pour TemplatePreview
 */
export function TemplatePreviewSkeleton({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-gray-100 animate-pulse",
        sizeClasses[size],
        className,
      )}
    />
  );
}
