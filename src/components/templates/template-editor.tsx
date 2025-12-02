"use client";

import { useState } from "react";
import {
  Palette,
  Type,
  Layout,
  Settings,
  ChevronDown,
  RotateCcw,
  Save,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TemplateConfig } from "@/server/modules/template/template.schema";
import {
  FONT_FAMILIES,
  LAYOUT_OPTIONS,
  PRESET_COLORS,
} from "@/hooks/use-template-customizer";

// ============================================
// TYPES
// ============================================

export interface TemplateEditorProps {
  config: TemplateConfig;
  hasChanges?: boolean;
  onConfigChange: (partial: Partial<TemplateConfig>) => void;
  onReset?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  className?: string;
}

// ============================================
// SOUS-COMPOSANTS
// ============================================

interface EditorSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

function EditorSection({
  title,
  icon,
  children,
  defaultOpen = true,
  badge,
}: EditorSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-between w-full p-4 text-left",
            "hover:bg-muted/50 transition-colors",
            "border-b border-border",
            isOpen && "bg-muted/30",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <span className="font-medium">{title}</span>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 space-y-4 border-b border-border bg-background">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: readonly { name: string; value: string }[];
}

function ColorPicker({
  label,
  value,
  onChange,
  presets = PRESET_COLORS,
}: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>

      {/* Présets de couleurs */}
      <div className="flex flex-wrap gap-2">
        <TooltipProvider delayDuration={300}>
          {presets.map((color) => (
            <Tooltip key={color.value}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                    value === color.value
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-transparent",
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => onChange(color.value)}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{color.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Sélecteur personnalisé */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border border-border overflow-hidden"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 font-mono text-sm uppercase"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

interface OptionRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function OptionRow({ label, description, children }: OptionRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export function TemplateEditor({
  config,
  hasChanges = false,
  onConfigChange,
  onReset,
  onSave,
  isSaving = false,
  className,
}: TemplateEditorProps) {
  const {
    primaryColor = "#1f2937",
    secondaryColor = "#6b7280",
    fontFamily = "Inter",
    fontSize = 12,
    layout = "classic",
    showLogo = true,
    showWatermark = false,
    headerPosition = "left",
    footerText = "",
  } = config;

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Éditeur de modèle</h2>
            <p className="text-xs text-muted-foreground">
              Personnalisez votre facture
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-300"
            >
              Non sauvegardé
            </Badge>
          )}
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-auto">
        {/* Section Couleurs */}
        <EditorSection
          title="Couleurs"
          icon={<Palette className="h-4 w-4" />}
          defaultOpen={true}
        >
          <ColorPicker
            label="Couleur principale"
            value={primaryColor}
            onChange={(color) => onConfigChange({ primaryColor: color })}
          />

          <div className="pt-2">
            <ColorPicker
              label="Couleur secondaire"
              value={secondaryColor}
              onChange={(color) => onConfigChange({ secondaryColor: color })}
            />
          </div>

          {/* Aperçu des couleurs */}
          <div className="mt-4 p-4 rounded-lg border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">Aperçu</p>
            <div className="space-y-2">
              <p className="font-semibold" style={{ color: primaryColor }}>
                Titre principal
              </p>
              <p className="text-sm" style={{ color: secondaryColor }}>
                Texte secondaire et descriptions
              </p>
            </div>
          </div>
        </EditorSection>

        {/* Section Typographie */}
        <EditorSection
          title="Typographie"
          icon={<Type className="h-4 w-4" />}
          defaultOpen={false}
        >
          {/* Police */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Police</Label>
            <Select
              value={fontFamily}
              onValueChange={(value) => onConfigChange({ fontFamily: value })}
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
          </div>

          {/* Taille de police */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Taille du texte</Label>
              <span className="text-sm text-muted-foreground font-mono">
                {fontSize}px
              </span>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => onConfigChange({ fontSize: value[0] })}
              min={8}
              max={16}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Petit</span>
              <span>Grand</span>
            </div>
          </div>

          {/* Aperçu typographie */}
          <div
            className="mt-4 p-4 rounded-lg border bg-white"
            style={{ fontFamily }}
          >
            <p className="text-xs text-muted-foreground mb-2">Aperçu</p>
            <p
              className="font-bold"
              style={{ fontSize: `${fontSize + 4}px`, color: primaryColor }}
            >
              Facture #{new Date().getFullYear()}-001
            </p>
            <p style={{ fontSize: `${fontSize}px`, color: secondaryColor }}>
              Ceci est un exemple de texte avec la police {fontFamily}.
            </p>
          </div>
        </EditorSection>

        {/* Section Mise en page */}
        <EditorSection
          title="Mise en page"
          icon={<Layout className="h-4 w-4" />}
          defaultOpen={false}
        >
          {/* Style de layout */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Style</Label>
            <div className="grid grid-cols-3 gap-2">
              {LAYOUT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onConfigChange({
                      layout: option.value as "classic" | "modern" | "minimal",
                    })
                  }
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    layout === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div
                    className={cn(
                      "w-full h-12 rounded border",
                      option.value === "modern" && "border-t-4",
                      option.value === "minimal" && "border-dashed",
                    )}
                    style={{
                      borderColor:
                        option.value === "modern" ? primaryColor : undefined,
                    }}
                  />
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Position du header */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Alignement en-tête</Label>
            <div className="flex gap-2">
              {[
                { value: "left", icon: AlignLeft, label: "Gauche" },
                { value: "center", icon: AlignCenter, label: "Centre" },
                { value: "right", icon: AlignRight, label: "Droite" },
              ].map((position) => (
                <Button
                  key={position.value}
                  type="button"
                  variant={
                    headerPosition === position.value ? "default" : "outline"
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
                  <position.icon className="h-4 w-4 mr-1" />
                  {position.label}
                </Button>
              ))}
            </div>
          </div>
        </EditorSection>

        {/* Section Options */}
        <EditorSection
          title="Options"
          icon={<Settings className="h-4 w-4" />}
          defaultOpen={false}
        >
          {/* Logo */}
          <OptionRow
            label="Afficher le logo"
            description="Logo de votre entreprise en haut de la facture"
          >
            <Switch
              checked={showLogo}
              onCheckedChange={(checked) =>
                onConfigChange({ showLogo: checked })
              }
            />
          </OptionRow>

          {/* Watermark */}
          <OptionRow
            label="Filigrane"
            description="Nom de l'entreprise en arrière-plan"
          >
            <Switch
              checked={showWatermark}
              onCheckedChange={(checked) =>
                onConfigChange({ showWatermark: checked })
              }
            />
          </OptionRow>

          {/* Footer */}
          <div className="space-y-2 pt-2">
            <Label className="text-sm font-medium">Pied de page</Label>
            <Input
              value={footerText}
              onChange={(e) => onConfigChange({ footerText: e.target.value })}
              placeholder="Ex: Merci pour votre confiance !"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Texte affiché en bas de chaque facture
            </p>
          </div>
        </EditorSection>
      </div>

      {/* Footer avec actions */}
      <div className="p-4 border-t bg-background sticky bottom-0">
        <div className="flex items-center gap-2">
          {onReset && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={!hasChanges}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          )}
          {onSave && (
            <Button
              size="sm"
              onClick={onSave}
              disabled={!hasChanges || isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
