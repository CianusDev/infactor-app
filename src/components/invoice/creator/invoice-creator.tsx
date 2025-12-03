"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  FileText,
  Palette,
  ChevronLeft,
  Minus,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";

// Composants de formulaire
import { ClientInfoForm } from "../forms/client-info-form";
import { CompanyInfoForm } from "../forms/company-info-form";
import { InvoiceItemsForm } from "../forms/invoice-items-form";
import {
  InvoiceOptionsForm,
  InvoiceTotals,
} from "../forms/invoice-options-form";

// Composants existants
import { TemplateList } from "@/components/templates/template-list";
import { TemplateEditor } from "@/components/templates/template-editor";
import { InvoiceDocument } from "../invoice-document";
import { InvoiceFormSkeleton } from "../invoice-skeleton";
import { PDFDownloadButton } from "@/components/pdf";

// Hooks
import {
  useDocumentCreator,
  UseDocumentCreatorOptions,
} from "@/hooks/use-document-creator";
import { DocumentWithItems } from "@/types/document";

// ============================================
// TYPES
// ============================================

export interface InvoiceCreatorProps {
  documentId?: string;
  onSuccess?: (document: DocumentWithItems) => void;
  onCancel?: () => void;
  className?: string;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export function InvoiceCreator({
  documentId,
  onSuccess,
  onCancel,
  className,
}: InvoiceCreatorProps) {
  const router = useRouter();
  const [zoom, setZoom] = useState(60);
  const [activeTab, setActiveTab] = useState<"form" | "style">("form");

  // Configuration du hook
  const creatorOptions: UseDocumentCreatorOptions = {
    documentId,
    onSuccess: (document) => {
      if (onSuccess) {
        onSuccess(document);
      } else {
        router.push(`/invoices`);
      }
    },
  };

  const {
    // Navigation
    step,
    goToTemplateSelection,

    // Template
    selectedTemplate,
    selectTemplate,

    // Configuration template
    templateConfig,
    updateTemplateConfig,
    resetTemplateConfig,

    // Formulaire
    formData,
    updateField,
    errors,

    // Lignes
    items,
    addItem,
    removeItem,
    updateItem,

    // Calculs
    subtotal,
    taxAmount,
    total,

    // Preview
    previewData,

    // États
    isLoading,
    isSaving,
    isEditMode,

    // Actions
    save,
  } = useDocumentCreator(creatorOptions);

  // Gérer l'annulation
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  // Gérer la sauvegarde
  const handleSave = async () => {
    await save();
  };

  // Gérer le zoom
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 100));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 30));
  };

  // Afficher le skeleton pendant le chargement en mode édition
  if (isLoading) {
    return <InvoiceFormSkeleton className={className} />;
  }

  // ============================================
  // ÉTAPE 1 : Sélection du template
  // ============================================

  if (step === "template") {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Nouveau document
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Choisissez un modèle pour commencer
            </p>
          </div>
        </div>

        {/* Liste des templates */}
        <TemplateList
          onSelectTemplate={selectTemplate}
          selectedTemplateId={selectedTemplate?.id}
          showSearch={true}
          showRefresh={false}
          columns={3}
          showCardActions={false}
          title="Sélectionnez un modèle"
          description="Ce modèle sera utilisé pour générer votre document. Vous pourrez le personnaliser ensuite."
        />
      </div>
    );
  }

  // ============================================
  // ÉTAPE 2 : Éditeur split-screen style Canva
  // ============================================

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header compact */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={goToTemplateSelection}
            className="shrink-0 gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Changer de modèle</span>
          </Button>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              {isEditMode ? "Modifier le document" : "Nouveau document"}
            </h1>
            {selectedTemplate && (
              <p className="text-xs text-muted-foreground">
                Modèle : {selectedTemplate.name}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Enregistrer</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Contenu principal - Split screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panneau gauche - Formulaire (largeur fixe) */}
        <div className="w-[500px] border-r bg-background flex flex-col overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "form" | "style")}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-4 pt-4 shrink-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Contenu
                </TabsTrigger>
                <TabsTrigger value="style" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Style
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Onglet Contenu - Formulaire */}
            <TabsContent
              value="form"
              className="flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden"
            >
              {/*<ScrollArea className="h-full ">*/}
              <div className="p-4 space-y-6 overflow-y-auto h-full">
                {/* Nom du document */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nom du document <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Ex: Facture Client X - Janvier 2025"
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      errors.name && "border-destructive",
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Informations émetteur */}
                <CompanyInfoForm
                  formData={formData}
                  errors={errors}
                  onUpdate={updateField}
                />

                {/* Informations client */}
                <ClientInfoForm
                  formData={formData}
                  errors={errors}
                  onUpdate={updateField}
                />

                {/* Lignes de facture */}
                <InvoiceItemsForm
                  items={items}
                  currency={formData.currency}
                  errors={errors}
                  onAddItem={addItem}
                  onRemoveItem={removeItem}
                  onUpdateItem={updateItem}
                />

                {/* Options */}
                <InvoiceOptionsForm
                  formData={formData}
                  errors={errors}
                  onUpdate={updateField}
                />

                {/* Récapitulatif */}
                <InvoiceTotals
                  subtotal={subtotal}
                  taxRate={formData.taxRate ?? 20}
                  taxAmount={taxAmount}
                  discount={formData.discount ?? 0}
                  total={total}
                  currency={formData.currency}
                />

                {/* Espace en bas pour le scroll */}
                <div className="h-8" />
              </div>
              {/*</ScrollArea>*/}
            </TabsContent>

            {/* Onglet Style - Personnalisation */}
            <TabsContent
              value="style"
              className="flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden"
            >
              <ScrollArea className="h-full">
                <div className="p-4">
                  <TemplateEditor
                    config={templateConfig}
                    onConfigChange={updateTemplateConfig}
                    onReset={resetTemplateConfig}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panneau droit - Preview style Canva */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
          {/* Toolbar Preview */}
          <div className="flex items-center justify-between px-4 py-2 border-b bg-background/80 backdrop-blur shrink-0">
            <span className="text-sm font-medium text-muted-foreground">
              Aperçu en temps réel
            </span>

            <div className="flex items-center gap-3">
              {/* Contrôles de zoom avec slider */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleZoomOut}
                  disabled={zoom <= 30}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <div className="w-24 hidden sm:block">
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={30}
                    max={100}
                    step={5}
                    className="cursor-pointer"
                  />
                </div>

                <span className="text-xs font-medium text-muted-foreground w-10 text-center">
                  {zoom}%
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleZoomIn}
                  disabled={zoom >= 100}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="h-4 w-px bg-border" />

              {/* Télécharger PDF */}
              <PDFDownloadButton
                config={templateConfig}
                data={previewData}
                fileName={
                  formData.name
                    ? `${formData.name.replace(/[^a-zA-Z0-9-]/g, "_")}.pdf`
                    : undefined
                }
                variant="default"
                size="sm"
              >
                <span className="hidden sm:inline">Télécharger</span> PDF
              </PDFDownloadButton>
            </div>
          </div>

          {/* Zone de prévisualisation style Canva */}
          <div className="flex-1 overflow-auto">
            <div
              className="min-h-full p-8 flex items-start justify-center"
              style={{
                background:
                  "repeating-conic-gradient(#80808012 0% 25%, transparent 0% 50%) 50% / 20px 20px",
              }}
            >
              {/* Document avec ombre et effet de page */}
              <div
                className="relative transition-transform duration-200 ease-out origin-top"
                style={{
                  transform: `scale(${zoom / 100})`,
                }}
              >
                {/* Ombre portée */}
                <div className="absolute inset-0 bg-black/20 blur-xl translate-y-2 rounded-sm" />

                {/* Document */}
                <div className="relative bg-white rounded-sm shadow-2xl">
                  <InvoiceDocument
                    config={templateConfig}
                    data={previewData}
                    scale={1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
