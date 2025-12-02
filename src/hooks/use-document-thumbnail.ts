"use client";

import { useCallback, useRef, useState, useMemo } from "react";
import { toPng, toJpeg } from "html-to-image";

export interface UseDocumentThumbnailOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: "png" | "jpeg";
  backgroundColor?: string;
}

export interface UseDocumentThumbnailReturn {
  /** Référence à attacher au conteneur du document */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** URL de la miniature générée (base64) */
  thumbnailUrl: string | null;
  /** Indique si la génération est en cours */
  isGenerating: boolean;
  /** Erreur éventuelle */
  error: string | null;
  /** Génère la miniature */
  generateThumbnail: () => Promise<string | null>;
  /** Réinitialise la miniature */
  reset: () => void;
}

const DEFAULT_OPTIONS: UseDocumentThumbnailOptions = {
  quality: 0.8,
  width: 300,
  height: 424, // Ratio A4 (210/297 ≈ 0.707)
  format: "jpeg",
  backgroundColor: "#ffffff",
};

/**
 * Hook pour générer des miniatures de documents
 *
 * @example
 * ```tsx
 * const { containerRef, thumbnailUrl, generateThumbnail, isGenerating } = useDocumentThumbnail();
 *
 * return (
 *   <>
 *     <div ref={containerRef}>
 *       <InvoiceDocument config={config} data={data} />
 *     </div>
 *     <button onClick={generateThumbnail} disabled={isGenerating}>
 *       Générer miniature
 *     </button>
 *     {thumbnailUrl && <img src={thumbnailUrl} alt="Miniature" />}
 *   </>
 * );
 * ```
 */
export function useDocumentThumbnail(
  options: UseDocumentThumbnailOptions = {},
): UseDocumentThumbnailReturn {
  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_OPTIONS, ...options }),
    [options],
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateThumbnail = useCallback(async (): Promise<string | null> => {
    if (!containerRef.current) {
      setError("Conteneur non trouvé");
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const node = containerRef.current;

      // Options de génération
      const imageOptions = {
        quality: mergedOptions.quality,
        backgroundColor: mergedOptions.backgroundColor,
        width: mergedOptions.width,
        height: mergedOptions.height,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
        // Ignorer les éléments avec cette classe (pour exclure des éléments de l'UI)
        filter: (domNode: HTMLElement) => {
          return !domNode.classList?.contains("thumbnail-ignore");
        },
      };

      // Générer l'image selon le format
      let dataUrl: string;
      if (mergedOptions.format === "png") {
        dataUrl = await toPng(node, imageOptions);
      } else {
        dataUrl = await toJpeg(node, imageOptions);
      }

      setThumbnailUrl(dataUrl);
      return dataUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la génération de la miniature";
      setError(errorMessage);
      console.error("Erreur génération thumbnail:", err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [mergedOptions]);

  const reset = useCallback(() => {
    setThumbnailUrl(null);
    setError(null);
  }, []);

  return {
    containerRef,
    thumbnailUrl,
    isGenerating,
    error,
    generateThumbnail,
    reset,
  };
}

/**
 * Génère une miniature à partir d'un élément DOM (fonction utilitaire)
 */
export async function generateThumbnailFromElement(
  element: HTMLElement,
  options: UseDocumentThumbnailOptions = {},
): Promise<string> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const imageOptions = {
    quality: mergedOptions.quality,
    backgroundColor: mergedOptions.backgroundColor,
    width: mergedOptions.width,
    height: mergedOptions.height,
  };

  if (mergedOptions.format === "png") {
    return await toPng(element, imageOptions);
  } else {
    return await toJpeg(element, imageOptions);
  }
}

/**
 * Convertit une data URL base64 en Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Convertit une data URL base64 en File
 */
export function dataUrlToFile(
  dataUrl: string,
  filename: string = "thumbnail.jpg",
): File {
  const blob = dataUrlToBlob(dataUrl);
  return new File([blob], filename, { type: blob.type });
}
