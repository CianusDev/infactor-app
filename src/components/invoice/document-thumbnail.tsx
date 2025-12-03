"use client";

import { useEffect, useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import { Loader2, FileText, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { InvoiceDocument } from "./invoice-document";
import { DocumentWithItems, StyleConfig } from "@/types/document";
import { documentToPreviewData } from "@/components/pdf/utils";
import { TemplateConfig } from "@/server/modules/template/template.schema";
import { Button } from "@/components/ui/button";

export interface DocumentThumbnailProps {
  document: DocumentWithItems;
  width?: number;
  height?: number;
  className?: string;
  showRefreshButton?: boolean;
  onClick?: () => void;
}

// Configuration par défaut du template
const defaultTemplateConfig: TemplateConfig = {
  primaryColor: "#1f2937",
  secondaryColor: "#6b7280",
  fontFamily: "Inter",
  fontSize: 12,
  layout: "classic",
  showLogo: true,
  logoUrl: null,
  headerPosition: "left",
  footerText: "Merci pour votre confiance.",
};

/**
 * Composant pour afficher une miniature de document
 * Génère automatiquement une image à partir du rendu HTML
 */
export function DocumentThumbnail({
  document,
  width = 200,
  height = 283, // Ratio A4
  className,
  showRefreshButton = false,
  onClick,
}: DocumentThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convertir le document en données de prévisualisation
  const previewData = documentToPreviewData(document);

  // Obtenir la config du template
  const templateConfig: TemplateConfig = document.template?.config
    ? {
        ...defaultTemplateConfig,
        ...(document.template.config as Partial<TemplateConfig>),
      }
    : document.styleConfig
      ? {
          ...defaultTemplateConfig,
          ...(document.styleConfig as Partial<StyleConfig>),
        }
      : defaultTemplateConfig;

  // Générer la miniature
  const generateThumbnail = async () => {
    if (!containerRef.current) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Attendre que le rendu soit complet
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toJpeg(containerRef.current, {
        quality: 0.8,
        backgroundColor: "#ffffff",
        width: width * 2, // 2x pour une meilleure qualité
        height: height * 2,
        style: {
          transform: `scale(${width / 595})`, // 595 = largeur A4 en pixels à 72dpi
          transformOrigin: "top left",
        },
      });

      setThumbnailUrl(dataUrl);
    } catch (err) {
      console.error("Erreur génération thumbnail:", err);
      setError("Erreur de génération");
    } finally {
      setIsGenerating(false);
    }
  };

  // Générer au montage et quand le document change
  useEffect(() => {
    const timer = setTimeout(() => {
      generateThumbnail();
    }, 200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.id, document.updatedAt]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border bg-white",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className,
      )}
      style={{ width, height }}
      onClick={onClick}
    >
      {/* Conteneur caché pour le rendu du document */}
      <div
        ref={containerRef}
        className="absolute"
        style={{
          left: "-9999px",
          top: 0,
          width: 595, // Largeur A4 en pixels
          height: 842, // Hauteur A4 en pixels
        }}
      >
        <InvoiceDocument config={templateConfig} data={previewData} scale={1} />
      </div>

      {/* Affichage de la miniature ou état de chargement */}
      {isGenerating && !thumbnailUrl ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 p-2">
          <FileText className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-xs text-muted-foreground text-center">
            Aperçu non disponible
          </span>
        </div>
      ) : thumbnailUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={`Aperçu de ${document.name}`}
            className="w-full h-full object-cover object-top"
          />
          {/* Bouton de rafraîchissement */}
          {showRefreshButton && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                generateThumbnail();
              }}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <FileText className="h-8 w-8 text-muted-foreground/50" />
        </div>
      )}

      {/* Overlay de chargement lors du rafraîchissement */}
      {isGenerating && thumbnailUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

/**
 * Version simplifiée pour les listes (sans génération dynamique)
 * Utilise une image placeholder ou une URL stockée
 */
export function DocumentThumbnailStatic({
  thumbnailUrl,
  name,
  width = 200,
  height = 283,
  className,
  onClick,
}: {
  thumbnailUrl?: string | null;
  name: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border bg-white",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className,
      )}
      style={{ width, height }}
      onClick={onClick}
    >
      {thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt={`Aperçu de ${name}`}
          className="w-full h-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-muted/30 to-muted/60 p-4">
          <FileText className="h-12 w-12 text-muted-foreground/40 mb-2" />
          <span className="text-xs text-muted-foreground text-center line-clamp-2">
            {name}
          </span>
        </div>
      )}
    </div>
  );
}
