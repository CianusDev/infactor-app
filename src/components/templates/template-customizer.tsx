"use client";

import { useCallback } from "react";
import {
  Palette,
  Type,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  FileText,
  RotateCcw,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TemplateConfig } from "@/server/modules/template/template.schema";
import {
  FONT_FAMILIES,
  LAYOUT_OPTIONS,
  HEADER_POSITIONS,
  PRESET_COLORS,
} from "@/hooks/use-template-customizer";

export interface TemplateCustomizerProps {
  config: TemplateConfig;
  hasChanges?: boolean;
  onConfigChange: (partial: Partial<TemplateConfig>) => void;
  onReset?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  className?: string;
}

/**
 * Composant d'interface de personnalisation de template
 * Permet de modifier les couleurs, polices, layout et autres options
 */
export function TemplateCustomizer({
  config,
  hasChanges = false,
  onConfigChange,
  onReset,
  onSave,
  isSaving = false,
  className,
}: TemplateCustomizerProps) {
  const {
    primaryColor = "#1f2937",
    secondaryColor = "#6b7280",
    fontFamily = "Inter",
    fontSize = 12,
    layout = "classic",
    showLogo = true,

    headerPosition = "left",
    footerText = "",
  } = config;

  // Handler pour les couleurs personnalisées
  const handleColorChange = useCallback(
    (type: "primaryColor" | "secondaryColor", color: string) => {
      onConfigChange({ [type]: color });
    },
    [onConfigChange],
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header avec actions */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">Personnalisation</h2>
          <p className="text-sm text-muted-foreground">
            Modifiez le style de votre modèle
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && onReset && (
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          )}
          {onSave && (
            <Button
              size="sm"
              onClick={onSave}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Contenu avec onglets */}
      <Tabs defaultValue="colors" className="flex-1 overflow-hidden">
        <TabsList className="w-full justify-start rounded-none border-b px-4 h-12">
          <TabsTrigger value="colors" className="gap-2">
            <Palette className="h-4 w-4" />
            Couleurs
          </TabsTrigger>
          <TabsTrigger value="typography" className="gap-2">
            <Type className="h-4 w-4" />
            Typographie
          </TabsTrigger>
          <TabsTrigger value="layout" className="gap-2">
            <Layout className="h-4 w-4" />
            Disposition
          </TabsTrigger>
          <TabsTrigger value="options" className="gap-2">
            <FileText className="h-4 w-4" />
            Options
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto p-4">
          {/* Onglet Couleurs */}
          <TabsContent value="colors" className="mt-0 space-y-6">
            {/* Couleur principale */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Couleur principale</CardTitle>
                <CardDescription>
                  Utilisée pour les titres et éléments importants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Présets de couleurs */}
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        primaryColor === color.value
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-transparent hover:scale-110",
                      )}
                      style={{ backgroundColor: color.value }}
                      onClick={() =>
                        handleColorChange("primaryColor", color.value)
                      }
                      title={color.name}
                    />
                  ))}
                </div>
                {/* Couleur personnalisée */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="primaryColor" className="text-sm">
                    Personnalisée:
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="primaryColor"
                      value={primaryColor}
                      onChange={(e) =>
                        handleColorChange("primaryColor", e.target.value)
                      }
                      className="w-10 h-10 rounded cursor-pointer border"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) =>
                        handleColorChange("primaryColor", e.target.value)
                      }
                      className="w-28 font-mono text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Couleur secondaire */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Couleur secondaire</CardTitle>
                <CardDescription>
                  Utilisée pour le texte et éléments secondaires
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Présets de couleurs */}
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        secondaryColor === color.value
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-transparent hover:scale-110",
                      )}
                      style={{ backgroundColor: color.value }}
                      onClick={() =>
                        handleColorChange("secondaryColor", color.value)
                      }
                      title={color.name}
                    />
                  ))}
                </div>
                {/* Couleur personnalisée */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="secondaryColor" className="text-sm">
                    Personnalisée:
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={secondaryColor}
                      onChange={(e) =>
                        handleColorChange("secondaryColor", e.target.value)
                      }
                      className="w-10 h-10 rounded cursor-pointer border"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) =>
                        handleColorChange("secondaryColor", e.target.value)
                      }
                      className="w-28 font-mono text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Typographie */}
          <TabsContent value="typography" className="mt-0 space-y-6">
            {/* Police de caractères */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Police de caractères
                </CardTitle>
                <CardDescription>
                  Choisissez la police pour votre facture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={fontFamily}
                  onValueChange={(value) =>
                    onConfigChange({ fontFamily: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir une police" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem
                        key={font.value}
                        value={font.value}
                        style={{ fontFamily: font.value }}
                      >
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Aperçu de la police */}
                <div
                  className="mt-4 p-4 border rounded-md bg-muted/30"
                  style={{ fontFamily }}
                >
                  <p
                    className="text-lg font-semibold"
                    style={{ color: primaryColor }}
                  >
                    Aperçu de la police {fontFamily}
                  </p>
                  <p className="text-sm" style={{ color: secondaryColor }}>
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  </p>
                  <p className="text-sm" style={{ color: secondaryColor }}>
                    abcdefghijklmnopqrstuvwxyz
                  </p>
                  <p className="text-sm" style={{ color: secondaryColor }}>
                    0123456789 €$£¥
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Taille de police */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Taille de police</CardTitle>
                <CardDescription>
                  Ajustez la taille du texte (8-16 px)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taille: {fontSize}px</span>
                  </div>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) =>
                      onConfigChange({ fontSize: value[0] })
                    }
                    min={8}
                    max={16}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>8px</span>
                    <span>12px</span>
                    <span>16px</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Disposition */}
          <TabsContent value="layout" className="mt-0 space-y-6">
            {/* Type de layout */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Style de mise en page
                </CardTitle>
                <CardDescription>
                  Choisissez le style général de votre facture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={layout}
                  onValueChange={(value) =>
                    onConfigChange({
                      layout: value as "classic" | "modern" | "minimal",
                    })
                  }
                  className="grid gap-3"
                >
                  {LAYOUT_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-start gap-3">
                      <RadioGroupItem
                        value={option.value}
                        id={`layout-${option.value}`}
                        className="mt-1"
                      />
                      <Label
                        htmlFor={`layout-${option.value}`}
                        className="flex flex-col cursor-pointer"
                      >
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {option.description}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Position du header */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Position de l&apos;en-tête
                </CardTitle>
                <CardDescription>
                  Alignement du logo et des informations entreprise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {HEADER_POSITIONS.map((position) => (
                    <Button
                      key={position.value}
                      type="button"
                      variant={
                        headerPosition === position.value
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onConfigChange({
                          headerPosition: position.value as
                            | "left"
                            | "center"
                            | "right",
                        })
                      }
                    >
                      {position.value === "left" && (
                        <AlignLeft className="h-4 w-4 mr-2" />
                      )}
                      {position.value === "center" && (
                        <AlignCenter className="h-4 w-4 mr-2" />
                      )}
                      {position.value === "right" && (
                        <AlignRight className="h-4 w-4 mr-2" />
                      )}
                      {position.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Options */}
          <TabsContent value="options" className="mt-0 space-y-6">
            {/* Options d'affichage */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Options d&apos;affichage
                </CardTitle>
                <CardDescription>
                  Éléments à afficher sur la facture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Afficher le logo */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      className="h-5 w-5 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Label htmlFor="showLogo" className="cursor-pointer">
                      Afficher le logo
                    </Label>
                  </div>
                  <Switch
                    id="showLogo"
                    checked={showLogo}
                    onCheckedChange={(checked) =>
                      onConfigChange({ showLogo: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Texte de pied de page */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Pied de page</CardTitle>
                <CardDescription>
                  Texte affiché en bas de la facture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  value={footerText}
                  onChange={(e) =>
                    onConfigChange({ footerText: e.target.value })
                  }
                  placeholder="Ex: Merci pour votre confiance."
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Laissez vide pour ne pas afficher de pied de page.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
