"use client";

import { useState, useCallback, useMemo } from "react";
import { TemplateConfig } from "@/server/modules/template/template.schema";
import { Template } from "@/types/template";

// ============================================
// TYPES
// ============================================

export interface InvoicePreviewData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  // Informations entreprise
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyPostalCode: string;
  companyCountry: string;
  companyPhone?: string;
  companyEmail?: string;
  companySiret?: string;
  companyVatNumber?: string;
  companyLogo?: string;
  // Informations client
  clientName: string;
  clientAddress?: string;
  clientCity?: string;
  clientPostalCode?: string;
  clientCountry?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientSiret?: string;
  clientVatNumber?: string;
  // Lignes de facture
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  // Totaux
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount?: number;
  total: number;
  currency: string;
  // Notes
  notes?: string;
  terms?: string;
}

export interface UseTemplateCustomizerOptions {
  template?: Template | null;
  initialConfig?: Partial<TemplateConfig>;
}

export interface UseTemplateCustomizerReturn {
  // Configuration actuelle
  config: TemplateConfig;
  // État original (pour reset)
  originalConfig: TemplateConfig;
  // Données de prévisualisation
  previewData: InvoicePreviewData;
  // Indicateur de modifications
  hasChanges: boolean;
  // Setters individuels
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setFontFamily: (font: string) => void;
  setFontSize: (size: number) => void;
  setLayout: (layout: "classic" | "modern" | "minimal") => void;
  setShowLogo: (show: boolean) => void;
  setShowWatermark: (show: boolean) => void;
  setHeaderPosition: (position: "left" | "center" | "right") => void;
  setFooterText: (text: string) => void;
  // Actions
  updateConfig: (partial: Partial<TemplateConfig>) => void;
  resetConfig: () => void;
  setPreviewData: (data: Partial<InvoicePreviewData>) => void;
}

// ============================================
// DONNÉES DE PRÉVISUALISATION PAR DÉFAUT
// ============================================

const defaultPreviewData: InvoicePreviewData = {
  invoiceNumber: "FAC-2025-0001",
  issueDate: new Date().toLocaleDateString("fr-FR"),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
  // Entreprise
  companyName: "Ma Société",
  companyAddress: "123 Rue de l'Exemple",
  companyCity: "Paris",
  companyPostalCode: "75001",
  companyCountry: "France",
  companyPhone: "01 23 45 67 89",
  companyEmail: "contact@masociete.fr",
  companySiret: "123 456 789 00012",
  companyVatNumber: "FR12345678901",
  // Client
  clientName: "Client Exemple",
  clientAddress: "456 Avenue du Client",
  clientCity: "Lyon",
  clientPostalCode: "69001",
  clientCountry: "France",
  clientEmail: "client@exemple.fr",
  // Lignes
  items: [
    {
      description: "Prestation de service",
      quantity: 1,
      unitPrice: 500,
      total: 500,
    },
    {
      description: "Développement web",
      quantity: 10,
      unitPrice: 80,
      total: 800,
    },
    {
      description: "Maintenance mensuelle",
      quantity: 1,
      unitPrice: 200,
      total: 200,
    },
  ],
  // Totaux
  subtotal: 1500,
  taxRate: 20,
  taxAmount: 300,
  discount: 0,
  total: 1800,
  currency: "EUR",
  // Notes
  notes: "Merci pour votre confiance.",
  terms: "Paiement à 30 jours. Pénalités de retard : 3 fois le taux légal.",
};

// ============================================
// CONFIGURATION PAR DÉFAUT
// ============================================

const defaultConfig: TemplateConfig = {
  primaryColor: "#1f2937",
  secondaryColor: "#6b7280",
  fontFamily: "Inter",
  fontSize: 12,
  layout: "classic",
  showLogo: true,
  showWatermark: false,
  headerPosition: "left",
  footerText: "Merci pour votre confiance.",
};

// ============================================
// HOOK
// ============================================

export function useTemplateCustomizer(
  options: UseTemplateCustomizerOptions = {}
): UseTemplateCustomizerReturn {
  const { template, initialConfig } = options;

  // Extraire la config du template si disponible
  const templateConfig = useMemo(() => {
    if (template?.config) {
      return template.config as TemplateConfig;
    }
    return null;
  }, [template]);

  // Configuration originale (pour le reset)
  const originalConfig = useMemo<TemplateConfig>(() => {
    return {
      ...defaultConfig,
      ...templateConfig,
      ...initialConfig,
    };
  }, [templateConfig, initialConfig]);

  // État de la configuration actuelle
  const [config, setConfig] = useState<TemplateConfig>(originalConfig);

  // État des données de prévisualisation
  const [previewData, setPreviewDataState] = useState<InvoicePreviewData>(defaultPreviewData);

  // Vérifier si des changements ont été effectués
  const hasChanges = useMemo(() => {
    return JSON.stringify(config) !== JSON.stringify(originalConfig);
  }, [config, originalConfig]);

  // ============================================
  // SETTERS INDIVIDUELS
  // ============================================

  const setPrimaryColor = useCallback((color: string) => {
    setConfig((prev) => ({ ...prev, primaryColor: color }));
  }, []);

  const setSecondaryColor = useCallback((color: string) => {
    setConfig((prev) => ({ ...prev, secondaryColor: color }));
  }, []);

  const setFontFamily = useCallback((font: string) => {
    setConfig((prev) => ({ ...prev, fontFamily: font }));
  }, []);

  const setFontSize = useCallback((size: number) => {
    setConfig((prev) => ({ ...prev, fontSize: size }));
  }, []);

  const setLayout = useCallback((layout: "classic" | "modern" | "minimal") => {
    setConfig((prev) => ({ ...prev, layout }));
  }, []);

  const setShowLogo = useCallback((show: boolean) => {
    setConfig((prev) => ({ ...prev, showLogo: show }));
  }, []);

  const setShowWatermark = useCallback((show: boolean) => {
    setConfig((prev) => ({ ...prev, showWatermark: show }));
  }, []);

  const setHeaderPosition = useCallback((position: "left" | "center" | "right") => {
    setConfig((prev) => ({ ...prev, headerPosition: position }));
  }, []);

  const setFooterText = useCallback((text: string) => {
    setConfig((prev) => ({ ...prev, footerText: text }));
  }, []);

  // ============================================
  // ACTIONS
  // ============================================

  const updateConfig = useCallback((partial: Partial<TemplateConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(originalConfig);
  }, [originalConfig]);

  const setPreviewData = useCallback((data: Partial<InvoicePreviewData>) => {
    setPreviewDataState((prev) => ({ ...prev, ...data }));
  }, []);

  return {
    config,
    originalConfig,
    previewData,
    hasChanges,
    setPrimaryColor,
    setSecondaryColor,
    setFontFamily,
    setFontSize,
    setLayout,
    setShowLogo,
    setShowWatermark,
    setHeaderPosition,
    setFooterText,
    updateConfig,
    resetConfig,
    setPreviewData,
  };
}

// ============================================
// CONSTANTES UTILES POUR L'UI
// ============================================

export const FONT_FAMILIES = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Merriweather", label: "Merriweather" },
] as const;

export const LAYOUT_OPTIONS = [
  { value: "classic", label: "Classique", description: "Design traditionnel et professionnel" },
  { value: "modern", label: "Moderne", description: "Style contemporain avec des touches de couleur" },
  { value: "minimal", label: "Minimaliste", description: "Épuré et simple, focus sur le contenu" },
] as const;

export const HEADER_POSITIONS = [
  { value: "left", label: "Gauche" },
  { value: "center", label: "Centré" },
  { value: "right", label: "Droite" },
] as const;

export const PRESET_COLORS = [
  { name: "Gris foncé", value: "#1f2937" },
  { name: "Bleu", value: "#2563eb" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Vert", value: "#059669" },
  { name: "Rouge", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Rose", value: "#db2777" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Noir", value: "#000000" },
  { name: "Doré", value: "#b8860b" },
] as const;
