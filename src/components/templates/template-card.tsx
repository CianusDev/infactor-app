"use client";

import { useRouter } from "next/navigation";
import { Check, Star, Eye, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TemplatePreview } from "./template-preview";
import { Template, TemplateConfig } from "@/types/template";

export interface TemplateCardProps {
  template: Template;
  isSelected?: boolean;
  onSelect?: (template: Template) => void;
  showActions?: boolean;
  className?: string;
}

/**
 * Composant carte pour afficher un template de facture
 * Affiche la prévisualisation, le nom, la description et les options de configuration
 */
export function TemplateCard({
  template,
  isSelected = false,
  onSelect,
  showActions = true,
  className,
}: TemplateCardProps) {
  const router = useRouter();
  const { id, name, description, isDefault } = template;

  // Le config est stocké en JSON, on le cast vers le type approprié
  const config = (template.config || {}) as TemplateConfig;

  const handleClick = () => {
    if (onSelect) {
      onSelect(template);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleViewTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/templates/${id}`);
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200 cursor-pointer group",
        "hover:shadow-lg hover:border-primary/50",
        isSelected && "ring-2 ring-primary border-primary shadow-lg",
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onSelect ? 0 : undefined}
      role={onSelect ? "button" : undefined}
      aria-pressed={onSelect ? isSelected : undefined}
      aria-label={`Template ${name}${isSelected ? " (sélectionné)" : ""}`}
    >
      {/* Indicateur de sélection */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
            <Check className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Prévisualisation du template */}
      <div className="relative flex items-center justify-center p-4 bg-muted/30">
        <TemplatePreview config={config} size="md" />

        {/* Overlay au hover avec bouton */}
        <div
          className={cn(
            "absolute inset-0 bg-black/0 transition-all duration-200 flex items-center justify-center opacity-0",
            "group-hover:bg-black/40 group-hover:opacity-100",
          )}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={handleViewTemplate}
            className="shadow-lg"
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir & Personnaliser
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold line-clamp-1">
            {name}
          </CardTitle>
          {isDefault && (
            <Badge variant="secondary" className="shrink-0 gap-1">
              <Star className="w-3 h-3" />
              Par défaut
            </Badge>
          )}
        </div>
        {description && (
          <CardDescription className="line-clamp-2 text-sm">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      {showActions && (
        <CardContent className="pt-0">
          {/* Aperçu de la configuration */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              {/* Couleurs du template */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full border border-border shadow-sm"
                  style={{ backgroundColor: config.primaryColor || "#1f2937" }}
                  title={`Couleur principale: ${config.primaryColor}`}
                />
                <div
                  className="w-5 h-5 rounded-full border border-border shadow-sm"
                  style={{
                    backgroundColor: config.secondaryColor || "#6b7280",
                  }}
                  title={`Couleur secondaire: ${config.secondaryColor}`}
                />
              </div>

              {/* Séparateur */}
              <div className="w-px h-4 bg-border" />

              {/* Layout */}
              <span className="text-xs text-muted-foreground capitalize">
                {config.layout || "classic"}
              </span>

              {/* Police */}
              {config.fontFamily && (
                <>
                  <div className="w-px h-4 bg-border" />
                  <span className="text-xs text-muted-foreground">
                    {config.fontFamily}
                  </span>
                </>
              )}
            </div>

            {/* Bouton personnaliser */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleViewTemplate}
              title="Personnaliser ce modèle"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
