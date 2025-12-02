"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, Pencil, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

import { useTemplate } from "@/hooks/use-templates";
import { useTemplateCustomizer } from "@/hooks/use-template-customizer";
import { TemplateEditor } from "@/components/templates/template-editor";
import { InvoiceDocument } from "@/components/invoice";
import { PDFDownloadButton, PDFDownloadIconButton } from "@/components/pdf";

interface TemplatePageProps {
  params: Promise<{ id: string }>;
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"preview" | "customize">(
    "preview",
  );
  const [scale, setScale] = useState(0.6);

  // Récupérer le template
  const { template, isLoading, error } = useTemplate({ templateId: id });

  // Hook de personnalisation
  const { config, previewData, hasChanges, updateConfig, resetConfig } =
    useTemplateCustomizer({ template });

  // Gérer le redimensionnement pour le scale
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScale(0.35);
      } else if (width < 1024) {
        setScale(0.5);
      } else if (width < 1440) {
        setScale(0.55);
      } else {
        setScale(0.65);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Gérer la sauvegarde
  const handleSave = async () => {
    try {
      // TODO: Appeler l'API pour sauvegarder les modifications
      toast.success("Modifications sauvegardées avec succès !");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex-1 flex">
          <Skeleton className="flex-1 m-4" />
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error || !template) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-destructive">{error || "Modèle non trouvé"}</p>
        <Button variant="outline" onClick={() => router.push("/templates")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux modèles
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/templates")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{template.name}</h1>
              {template.isDefault && (
                <Badge variant="secondary" className="text-xs">
                  Par défaut
                </Badge>
              )}
              {hasChanges && (
                <Badge
                  variant="outline"
                  className="text-xs text-orange-500 border-orange-500"
                >
                  Modifié
                </Badge>
              )}
            </div>
            {template.description && (
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <PDFDownloadButton
            config={config}
            data={previewData}
            variant="outline"
            size="sm"
          >
            Exporter PDF
          </PDFDownloadButton>
          {hasChanges && (
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Vue desktop: side-by-side */}
        <div className="hidden lg:flex flex-1">
          {/* Panel de personnalisation */}
          <div className="w-[380px] border-r overflow-hidden flex flex-col">
            <TemplateEditor
              config={config}
              hasChanges={hasChanges}
              onConfigChange={updateConfig}
              onReset={resetConfig}
              onSave={handleSave}
            />
          </div>

          {/* Prévisualisation */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Contrôles de zoom */}
            <div className="flex items-center justify-center gap-4 py-3 px-4 border-b bg-muted/30">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setScale((s) => Math.max(0.3, s - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="w-32">
                <Slider
                  value={[scale * 100]}
                  onValueChange={(v) => setScale(v[0] / 100)}
                  min={30}
                  max={100}
                  step={5}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setScale((s) => Math.min(1, s + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground w-12">
                {Math.round(scale * 100)}%
              </span>
            </div>

            {/* Document */}
            <div className="flex-1 overflow-auto bg-muted/30 p-8">
              <div className="flex justify-center">
                <InvoiceDocument
                  config={config}
                  data={previewData}
                  scale={scale}
                  className="shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vue mobile/tablette: tabs */}
        <div className="flex lg:hidden flex-col flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "preview" | "customize")}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <TabsList className="w-full justify-center rounded-none border-b h-12 bg-background">
              <TabsTrigger value="preview" className="gap-2 flex-1">
                <Eye className="h-4 w-4" />
                Aperçu
              </TabsTrigger>
              <TabsTrigger value="customize" className="gap-2 flex-1">
                <Pencil className="h-4 w-4" />
                Personnaliser
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="preview"
              className="flex-1 overflow-auto bg-muted/30 p-4 m-0"
            >
              <div className="flex justify-center">
                <InvoiceDocument
                  config={config}
                  data={previewData}
                  scale={scale}
                  className="shadow-2xl"
                />
              </div>
            </TabsContent>

            <TabsContent
              value="customize"
              className="flex-1 overflow-hidden m-0"
            >
              <TemplateEditor
                config={config}
                hasChanges={hasChanges}
                onConfigChange={updateConfig}
                onReset={resetConfig}
                onSave={handleSave}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer mobile avec actions rapides */}
      <div className="lg:hidden flex items-center justify-between p-3 border-t bg-background">
        <Button
          variant="outline"
          size="sm"
          onClick={resetConfig}
          disabled={!hasChanges}
        >
          Réinitialiser
        </Button>
        <div className="flex items-center gap-2">
          <PDFDownloadIconButton config={config} data={previewData} />
          <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
}
