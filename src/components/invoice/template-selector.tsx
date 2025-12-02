"use client";

import { useState, useEffect } from "react";
import { Check, Palette, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplatePreview } from "@/components/templates/template-preview";
import { useTemplates } from "@/hooks/use-templates";
import { Template, TemplateConfig } from "@/types/template";

export interface TemplateSelectorProps {
  selectedTemplateId?: string | null;
  onSelect: (templateId: string | null) => void;
  className?: string;
  defaultOpen?: boolean;
}

/**
 * Composant pour sélectionner un template de facture
 * Affiche une grille de templates avec prévisualisation
 */
export function TemplateSelector({
  selectedTemplateId,
  onSelect,
  className,
  defaultOpen = true,
}: TemplateSelectorProps) {
  const { templates, isLoading, error } = useTemplates();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Trouver le template sélectionné
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <Card className={cn("", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto hover:bg-transparent"
            >
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <CardTitle className="text-lg">Modèle de facture</CardTitle>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <CardDescription>
            Choisissez le style visuel de votre facture
          </CardDescription>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* État de chargement */}
            {isLoading && (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <TemplateSelectorSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Erreur */}
            {error && !isLoading && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Erreur lors du chargement des modèles
              </div>
            )}

            {/* Liste des templates */}
            {!isLoading && !error && templates.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <TemplateSelectorItem
                    key={template.id}
                    template={template}
                    isSelected={template.id === selectedTemplateId}
                    onSelect={() => onSelect(template.id)}
                  />
                ))}
              </div>
            )}

            {/* Aucun template */}
            {!isLoading && !error && templates.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Aucun modèle disponible
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      {/* Aperçu du template sélectionné (quand fermé) */}
      {!isOpen && selectedTemplate && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
            <TemplatePreview
              config={(selectedTemplate.config || {}) as TemplateConfig}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {selectedTemplate.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {selectedTemplate.description}
              </p>
            </div>
            <Check className="h-4 w-4 text-primary shrink-0" />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Item individuel du sélecteur de template
 */
function TemplateSelectorItem({
  template,
  isSelected,
  onSelect,
}: {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const config = (template.config || {}) as TemplateConfig;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative p-3 rounded-lg border-2 transition-all text-left",
        "hover:border-primary/50 hover:bg-muted/50",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-card"
      )}
    >
      {/* Indicateur de sélection */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground">
            <Check className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Prévisualisation */}
      <div className="flex justify-center mb-2">
        <TemplatePreview config={config} size="sm" />
      </div>

      {/* Nom du template */}
      <p className="font-medium text-sm text-center truncate">
        {template.name}
      </p>

      {/* Badge par défaut */}
      {template.isDefault && (
        <p className="text-xs text-center text-muted-foreground mt-1">
          Par défaut
        </p>
      )}
    </button>
  );
}

/**
 * Skeleton pour le chargement
 */
function TemplateSelectorSkeleton() {
  return (
    <div className="p-3 rounded-lg border-2 border-border">
      <div className="flex justify-center mb-2">
        <Skeleton className="w-16 h-20 rounded" />
      </div>
      <Skeleton className="h-4 w-20 mx-auto" />
    </div>
  );
}

/**
 * Version compacte du sélecteur (dropdown)
 */
export function TemplateSelectorCompact({
  selectedTemplateId,
  onSelect,
  className,
}: TemplateSelectorProps) {
  const { templates, isLoading } = useTemplates();
  const [isOpen, setIsOpen] = useState(false);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="truncate">
            {isLoading
              ? "Chargement..."
              : selectedTemplate
              ? selectedTemplate.name
              : "Choisir un modèle"}
          </span>
        </div>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        )}
      </Button>

      {isOpen && !isLoading && (
        <div className="absolute z-50 mt-2 w-full max-h-64 overflow-auto rounded-lg border border-border bg-popover shadow-lg">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              className={cn(
                "w-full flex items-center gap-3 p-3 text-left transition-colors",
                "hover:bg-muted",
                template.id === selectedTemplateId && "bg-muted"
              )}
              onClick={() => {
                onSelect(template.id);
                setIsOpen(false);
              }}
            >
              <TemplatePreview
                config={(template.config || {}) as TemplateConfig}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{template.name}</p>
                {template.description && (
                  <p className="text-xs text-muted-foreground truncate">
                    {template.description}
                  </p>
                )}
              </div>
              {template.id === selectedTemplateId && (
                <Check className="h-4 w-4 text-primary shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
