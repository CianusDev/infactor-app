"use client";

import { useState, useMemo } from "react";
import { Search, LayoutGrid, List, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "./template-card";
import { TemplateListSkeleton } from "./template-skeleton";
import { Template, TemplateConfig } from "@/types/template";
import { useTemplates } from "@/hooks/use-templates";

export interface TemplateListProps {
  /** Templates à afficher (si non fourni, utilise le hook useTemplates) */
  templates?: Template[];
  /** ID du template actuellement sélectionné */
  selectedTemplateId?: string | null;
  /** Callback appelé lors de la sélection d'un template */
  onSelectTemplate?: (template: Template) => void;
  /** État de chargement externe */
  isLoading?: boolean;
  /** Afficher la barre de recherche */
  showSearch?: boolean;
  /** Afficher le bouton de rafraîchissement */
  showRefresh?: boolean;
  /** Nombre de colonnes (responsive) */
  columns?: 2 | 3 | 4;
  /** Afficher les actions sur les cartes */
  showCardActions?: boolean;
  /** Classe CSS additionnelle */
  className?: string;
  /** Titre de la section */
  title?: string;
  /** Description de la section */
  description?: string;
}

/**
 * Composant pour afficher une liste de templates de factures
 * Supporte la recherche, la sélection et différentes configurations d'affichage
 */
export function TemplateList({
  templates: externalTemplates,
  selectedTemplateId,
  onSelectTemplate,
  isLoading: externalLoading,
  showSearch = true,
  showRefresh = false,
  columns = 3,
  showCardActions = true,
  className,
  title,
  description,
}: TemplateListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Utiliser le hook si pas de templates externes
  const {
    templates: hookTemplates,
    isLoading: hookLoading,
    refetch,
  } = useTemplates({
    autoFetch: !externalTemplates,
  });

  const templates = externalTemplates ?? hookTemplates;
  const isLoading = externalLoading ?? hookLoading;

  // Filtrer les templates par recherche
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) {
      return templates;
    }

    const query = searchQuery.toLowerCase();
    return templates.filter((template) => {
      const config = (template.config || {}) as TemplateConfig;
      return (
        template.name.toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query) ||
        config.layout?.toLowerCase().includes(query)
      );
    });
  }, [templates, searchQuery]);

  // Classes pour la grille selon le nombre de colonnes
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  const handleRefresh = async () => {
    if (refetch) {
      await refetch();
    }
  };

  // Affichage du skeleton pendant le chargement
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        {(title || description) && (
          <div className="space-y-1">
            {title && (
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        {showSearch && (
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        )}
        <TemplateListSkeleton columns={columns} count={6} />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header avec titre et description */}
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Barre d'outils */}
      {(showSearch || showRefresh) && (
        <div className="flex items-center justify-between gap-4">
          {/* Recherche */}
          {showSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Toggle vue grille/liste */}
            <div className="hidden sm:flex items-center border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
                aria-label="Vue grille"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
                aria-label="Vue liste"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Rafraîchir */}
            {showRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                aria-label="Rafraîchir la liste"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Rafraîchir
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Liste des templates */}
      {filteredTemplates.length === 0 ? (
        <EmptyState
          hasSearch={searchQuery.trim().length > 0}
          onClearSearch={() => setSearchQuery("")}
        />
      ) : viewMode === "grid" ? (
        <div className={cn("grid gap-6", gridCols[columns])}>
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplateId === template.id}
              onSelect={onSelectTemplate}
              showActions={showCardActions}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplateId === template.id}
              onSelect={onSelectTemplate}
              showActions={showCardActions}
              className="flex-row"
            />
          ))}
        </div>
      )}

      {/* Compteur de résultats */}
      {filteredTemplates.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          {filteredTemplates.length}{" "}
          {filteredTemplates.length === 1 ? "modèle trouvé" : "modèles trouvés"}
          {searchQuery && ` pour "${searchQuery}"`}
        </div>
      )}
    </div>
  );
}

/**
 * Composant d'état vide
 */
function EmptyState({
  hasSearch,
  onClearSearch,
}: {
  hasSearch: boolean;
  onClearSearch: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <LayoutGrid className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">
        {hasSearch ? "Aucun modèle trouvé" : "Aucun modèle disponible"}
      </h3>
      <p className="text-muted-foreground max-w-sm mb-4">
        {hasSearch
          ? "Essayez de modifier votre recherche ou d'utiliser d'autres termes."
          : "Il n'y a pas encore de modèles de factures disponibles."}
      </p>
      {hasSearch && (
        <Button variant="outline" onClick={onClearSearch}>
          Effacer la recherche
        </Button>
      )}
    </div>
  );
}
