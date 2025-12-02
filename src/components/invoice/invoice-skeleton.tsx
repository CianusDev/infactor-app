"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Skeleton pour une ligne du tableau des factures
 */
export function InvoiceRowSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 border-b border-border",
        className
      )}
    >
      {/* Numéro de facture */}
      <Skeleton className="h-5 w-24" />

      {/* Nom du client */}
      <Skeleton className="h-5 w-40 flex-1" />

      {/* Statut */}
      <Skeleton className="h-6 w-20 rounded-full" />

      {/* Date d'émission */}
      <Skeleton className="h-5 w-24" />

      {/* Date d'échéance */}
      <Skeleton className="h-5 w-24" />

      {/* Montant */}
      <Skeleton className="h-5 w-20" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}

/**
 * Skeleton pour le tableau complet des factures
 */
export function InvoiceTableSkeleton({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      {/* En-tête du tableau */}
      <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/50">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32 flex-1" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Lignes */}
      {Array.from({ length: rows }).map((_, index) => (
        <InvoiceRowSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton pour les filtres de factures
 */
export function InvoiceFiltersSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Barre de recherche */}
      <Skeleton className="h-10 w-64" />

      {/* Filtre par statut */}
      <Skeleton className="h-10 w-40" />

      {/* Tri */}
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

/**
 * Skeleton pour les statistiques des factures
 */
export function InvoiceStatsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border border-border bg-card"
        >
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton pour la carte d'une facture (vue grille)
 */
export function InvoiceCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border border-border bg-card space-y-3",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Client */}
      <div className="space-y-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Dates */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Montant */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Skeleton className="h-6 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton pour la grille de factures
 */
export function InvoiceGridSkeleton({
  cards = 6,
  className,
}: {
  cards?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {Array.from({ length: cards }).map((_, index) => (
        <InvoiceCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton pour la page de liste des factures complète
 */
export function InvoiceListPageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats */}
      <InvoiceStatsSkeleton />

      {/* Filtres */}
      <InvoiceFiltersSkeleton />

      {/* Tableau */}
      <InvoiceTableSkeleton rows={10} />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton pour le détail d'une facture
 */
export function InvoiceDetailSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-1">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Infos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Items */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-4">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-4 w-48 flex-1" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Totaux */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between pt-2 border-t">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton pour le formulaire de facture
 */
export function InvoiceFormSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Infos client */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Lignes */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-4">
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-10" />
              </div>
            ))}
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Notes */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Template */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-32 w-full" />
          </div>

          {/* Options */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Totaux */}
          <div className="p-4 rounded-lg border border-border bg-card space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between pt-2 border-t">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
