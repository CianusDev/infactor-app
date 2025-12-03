"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { uploadImage } from "@/server/config/cloudinary";
import Image from "next/image";

export interface LogoUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Composant pour uploader un logo via Cloudinary
 * Affiche une prévisualisation et permet de supprimer le logo
 */
export function LogoUpload({
  value,
  onChange,
  className,
  disabled = false,
}: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Gérer le clic sur la zone d'upload
  const handleClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  // Gérer la sélection de fichier
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
    // Réinitialiser l'input pour permettre de re-sélectionner le même fichier
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Gérer le drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  // Uploader le fichier vers Cloudinary
  const uploadFile = async (file: File) => {
    // Vérifier le type de fichier
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Format de fichier non supporté", {
        description: "Utilisez JPG, PNG, GIF, WebP ou SVG",
      });
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Fichier trop volumineux", {
        description: "La taille maximale est de 5 Mo",
      });
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadImage(file, false);
      onChange(result.secure_url);
      toast.success("Logo uploadé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast.error("Erreur lors de l'upload", {
        description: "Veuillez réessayer",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Supprimer le logo
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    toast.success("Logo supprimé");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Zone d'upload / Prévisualisation */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors cursor-pointer",
          "flex items-center justify-center",
          "min-h-[120px]",
          dragOver && "border-primary bg-primary/5",
          !dragOver &&
            !value &&
            "border-muted-foreground/25 hover:border-primary/50",
          value && "border-transparent bg-muted/30",
          disabled && "opacity-50 cursor-not-allowed",
          isUploading && "cursor-wait",
        )}
      >
        {/* Input caché */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {/* État: Upload en cours */}
        {isUploading && (
          <div className="flex flex-col items-center gap-2 p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Upload en cours...
            </span>
          </div>
        )}

        {/* État: Pas de logo */}
        {!isUploading && !value && (
          <div className="flex flex-col items-center gap-2 p-4">
            <div className="p-3 rounded-full bg-muted">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Cliquez pour uploader</p>
              <p className="text-xs text-muted-foreground">
                ou glissez-déposez votre logo ici
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, GIF, WebP, SVG (max 5 Mo)
            </p>
          </div>
        )}

        {/* État: Logo uploadé */}
        {!isUploading && value && (
          <div className="relative w-full h-full min-h-[120px] p-4">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={value}
                alt="Logo"
                width={200}
                height={80}
                className="max-h-[100px] w-auto object-contain"
                unoptimized
              />
            </div>

            {/* Bouton supprimer */}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Indication */}
      {!value && (
        <p className="text-xs text-muted-foreground text-center">
          Votre logo apparaîtra en haut de vos factures
        </p>
      )}
    </div>
  );
}
