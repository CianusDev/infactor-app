"use client";

import { useState } from "react";
import { Download, Loader2, FileText } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { InvoicePDF } from "./invoice-pdf";
import { TemplateConfig } from "@/server/modules/template/template.schema";
import { InvoicePreviewData } from "@/hooks/use-template-customizer";
import { DocumentWithItems } from "@/types/document";
import { documentToPreviewData } from "./utils";
import { toast } from "sonner";

export interface PDFDownloadButtonProps {
  config: TemplateConfig;
  data: InvoicePreviewData;
  fileName?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

/**
 * Bouton pour télécharger une facture en PDF
 * Génère le PDF côté client et déclenche le téléchargement
 */
export function PDFDownloadButton({
  config,
  data,
  fileName,
  variant = "outline",
  size = "default",
  className,
  showIcon = true,
  children,
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Générer le nom du fichier
  const getFileName = () => {
    if (fileName) return fileName;
    const invoiceNumber = data.invoiceNumber.replace(/[^a-zA-Z0-9-]/g, "_");
    const date = new Date().toISOString().split("T")[0];
    return `facture_${invoiceNumber}_${date}.pdf`;
  };

  // Gérer le téléchargement
  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      // Générer le PDF
      const blob = await pdf(
        <InvoicePDF config={config} data={data} />,
      ).toBlob();

      // Créer un lien de téléchargement
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getFileName();

      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Nettoyer l'URL
      URL.revokeObjectURL(url);

      toast.success("PDF téléchargé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleDownload}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Génération...
        </>
      ) : (
        <>
          {showIcon && <Download className="h-4 w-4 mr-2" />}
          {children || "Télécharger PDF"}
        </>
      )}
    </Button>
  );
}

/**
 * Bouton icône pour télécharger le PDF
 */
export function PDFDownloadIconButton({
  config,
  data,
  fileName,
  className,
}: Omit<PDFDownloadButtonProps, "variant" | "size" | "showIcon" | "children">) {
  const [isGenerating, setIsGenerating] = useState(false);

  const getFileName = () => {
    if (fileName) return fileName;
    const invoiceNumber = data.invoiceNumber.replace(/[^a-zA-Z0-9-]/g, "_");
    const date = new Date().toISOString().split("T")[0];
    return `facture_${invoiceNumber}_${date}.pdf`;
  };

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const blob = await pdf(
        <InvoicePDF config={config} data={data} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getFileName();

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast.success("PDF téléchargé !");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={handleDownload}
      disabled={isGenerating}
      title="Télécharger en PDF"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
    </Button>
  );
}

// ============================================
// TÉLÉCHARGEMENT PDF DEPUIS UN DOCUMENT
// ============================================

export interface DocumentPDFDownloadButtonProps {
  document: DocumentWithItems;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

/**
 * Bouton pour télécharger un document en PDF
 * Utilise la config du template ou une config par défaut
 */
export function DocumentPDFDownloadButton({
  document,
  variant = "outline",
  size = "default",
  className,
  showIcon = true,
  children,
}: DocumentPDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Configuration par défaut du template
  const defaultConfig: TemplateConfig = {
    primaryColor: "#1f2937",
    secondaryColor: "#6b7280",
    fontFamily: "Inter",
    fontSize: 12,
    layout: "classic",
    showLogo: true,
    showWatermark: false,
    headerPosition: "left",
    footerText: "Merci pour votre confiance.",
  };

  // Générer le nom du fichier
  const getFileName = () => {
    const sanitizedName = document.name.replace(/[^a-zA-Z0-9-]/g, "_");
    const date = new Date().toISOString().split("T")[0];
    return `${sanitizedName}_${date}.pdf`;
  };

  // Gérer le téléchargement
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);

    try {
      // Convertir le document en données de prévisualisation
      const previewData = documentToPreviewData(document);

      // Utiliser la config du template ou la config par défaut
      const templateConfig: TemplateConfig = document.template?.config
        ? {
            ...defaultConfig,
            ...(document.template.config as Partial<TemplateConfig>),
          }
        : document.styleConfig
          ? {
              ...defaultConfig,
              ...(document.styleConfig as Partial<TemplateConfig>),
            }
          : defaultConfig;

      // Générer le PDF
      const blob = await pdf(
        <InvoicePDF config={templateConfig} data={previewData} />,
      ).toBlob();

      // Créer un lien de téléchargement
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = getFileName();

      // Déclencher le téléchargement
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

      // Nettoyer l'URL
      URL.revokeObjectURL(url);

      toast.success("PDF téléchargé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleDownload}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Génération...
        </>
      ) : (
        <>
          {showIcon && <Download className="h-4 w-4 mr-2" />}
          {children || "Télécharger PDF"}
        </>
      )}
    </Button>
  );
}
