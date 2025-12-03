"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Template, TemplateConfig } from "@/types/template";
import {
  DocumentFormData,
  DocumentItemFormData,
  DEFAULT_DOCUMENT_FORM_DATA,
  DEFAULT_DOCUMENT_ITEM,
  DocumentWithItems,
  StyleConfig,
} from "@/types/document";
import { calculateItemTotal, calculateInvoiceTotals } from "@/lib/utils";
import {
  createDocument,
  updateDocument,
  getDocumentById,
} from "@/services/document.service";
import { InvoicePreviewData } from "@/hooks/use-template-customizer";

// ============================================
// TYPES
// ============================================

export type CreatorStep = "template" | "editor";

export interface UseDocumentCreatorOptions {
  documentId?: string;
  initialTemplateId?: string;
  onSuccess?: (document: DocumentWithItems) => void;
  onError?: (error: string) => void;
}

export interface UseDocumentCreatorReturn {
  // Navigation entre étapes
  step: CreatorStep;
  setStep: (step: CreatorStep) => void;
  goToTemplateSelection: () => void;
  goToEditor: () => void;

  // Template sélectionné
  selectedTemplate: Template | null;
  selectTemplate: (template: Template) => void;

  // Configuration du template (personnalisation)
  templateConfig: TemplateConfig;
  updateTemplateConfig: (config: Partial<TemplateConfig>) => void;
  resetTemplateConfig: () => void;

  // Formulaire de document
  formData: DocumentFormData;
  setFormData: (data: DocumentFormData) => void;
  updateField: <K extends keyof DocumentFormData>(
    field: K,
    value: DocumentFormData[K],
  ) => void;
  errors: Record<string, string>;

  // Gestion des lignes
  items: DocumentItemFormData[];
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (
    index: number,
    field: keyof DocumentItemFormData,
    value: string | number,
  ) => void;

  // Calculs
  subtotal: number;
  taxAmount: number;
  total: number;

  // Preview en temps réel
  previewData: InvoicePreviewData;

  // États
  isLoading: boolean;
  isSaving: boolean;
  isEditMode: boolean;

  // Actions
  save: () => Promise<boolean>;
  validate: () => boolean;
  reset: () => void;
}

// ============================================
// CONFIGURATION PAR DÉFAUT DU TEMPLATE
// ============================================

const defaultTemplateConfig: TemplateConfig = {
  primaryColor: "#1f2937",
  secondaryColor: "#6b7280",
  fontFamily: "Inter",
  fontSize: 12,
  layout: "classic",
  showLogo: true,
  logoUrl: null,
  headerPosition: "left",
  footerText: "Merci pour votre confiance.",
};

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useDocumentCreator(
  options: UseDocumentCreatorOptions = {},
): UseDocumentCreatorReturn {
  const { documentId, initialTemplateId, onSuccess, onError } = options;
  const isEditMode = !!documentId;

  // ============================================
  // ÉTATS
  // ============================================

  // Étape actuelle
  const [step, setStep] = useState<CreatorStep>(
    isEditMode ? "editor" : "template",
  );

  // Template sélectionné
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );

  // Configuration du template (personnalisation)
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig>(
    defaultTemplateConfig,
  );
  const [originalTemplateConfig, setOriginalTemplateConfig] =
    useState<TemplateConfig>(defaultTemplateConfig);

  // Formulaire
  const [formData, setFormData] = useState<DocumentFormData>({
    ...DEFAULT_DOCUMENT_FORM_DATA,
    templateId: initialTemplateId || null,
  });

  // États de chargement
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================
  // CHARGEMENT DU DOCUMENT EN MODE ÉDITION
  // ============================================

  useEffect(() => {
    if (documentId) {
      loadDocument(documentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  const loadDocument = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await getDocumentById(id);
      if (result.success && result.data) {
        const document = result.data as DocumentWithItems;
        setFormData({
          name: document.name,
          // Infos émetteur
          companyName: document.companyName,
          companyAddress: document.companyAddress,
          companyCity: document.companyCity,
          companyPostalCode: document.companyPostalCode,
          companyCountry: document.companyCountry,
          companyPhone: document.companyPhone,
          companyEmail: document.companyEmail,
          companySiret: document.companySiret,
          companyVatNumber: document.companyVatNumber,
          companyLogo: document.companyLogo,
          // Infos client
          clientName: document.clientName,
          clientEmail: document.clientEmail,
          clientPhone: document.clientPhone,
          clientAddress: document.clientAddress,
          clientCity: document.clientCity,
          clientPostalCode: document.clientPostalCode,
          clientCountry: document.clientCountry,
          clientSiret: document.clientSiret,
          clientVatNumber: document.clientVatNumber,
          // Infos facture
          invoiceNumber: document.invoiceNumber,
          issueDate: document.issueDate
            ? new Date(document.issueDate)
            : new Date(),
          dueDate: document.dueDate ? new Date(document.dueDate) : null,
          // Montants
          taxRate: document.taxRate ? Number(document.taxRate) : 20,
          discount: document.discount ? Number(document.discount) : 0,
          currency: document.currency || "EUR",
          // Options
          notes: document.notes,
          terms: document.terms,
          templateId: document.templateId,
          styleConfig: document.styleConfig as StyleConfig | null,
          // Lignes
          items: document.items.map((item, index) => ({
            id: item.id,
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            total: Number(item.total),
            order: item.order ?? index,
          })),
        });

        // Charger la config de style si présente
        if (document.styleConfig) {
          const styleConfig = document.styleConfig as StyleConfig;
          const mergedConfig = { ...defaultTemplateConfig, ...styleConfig };
          setTemplateConfig(mergedConfig);
          setOriginalTemplateConfig(mergedConfig);
        }
      } else {
        const errorMessage =
          result.message || "Erreur lors du chargement du document";
        toast.error(errorMessage);
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = "Une erreur inattendue s'est produite";
      toast.error(errorMessage);
      onError?.(errorMessage);
      console.error("Erreur de chargement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // NAVIGATION ENTRE ÉTAPES
  // ============================================

  const goToTemplateSelection = useCallback(() => {
    setStep("template");
  }, []);

  const goToEditor = useCallback(() => {
    if (!selectedTemplate && !isEditMode) {
      toast.error("Veuillez d'abord sélectionner un modèle");
      return;
    }
    setStep("editor");
  }, [selectedTemplate, isEditMode]);

  // ============================================
  // SÉLECTION DU TEMPLATE
  // ============================================

  const selectTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);

    // Extraire la config du template
    const config = (template.config || {}) as TemplateConfig;
    const mergedConfig = { ...defaultTemplateConfig, ...config };

    setTemplateConfig(mergedConfig);
    setOriginalTemplateConfig(mergedConfig);

    // Mettre à jour le templateId dans le formulaire
    setFormData((prev) => ({ ...prev, templateId: template.id }));

    // Passer à l'étape suivante
    setStep("editor");
  }, []);

  // ============================================
  // PERSONNALISATION DU TEMPLATE
  // ============================================

  const updateTemplateConfig = useCallback(
    (partial: Partial<TemplateConfig>) => {
      setTemplateConfig((prev) => ({ ...prev, ...partial }));
    },
    [],
  );

  const resetTemplateConfig = useCallback(() => {
    setTemplateConfig(originalTemplateConfig);
  }, [originalTemplateConfig]);

  // ============================================
  // GESTION DU FORMULAIRE
  // ============================================

  const updateField = useCallback(
    <K extends keyof DocumentFormData>(
      field: K,
      value: DocumentFormData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Effacer l'erreur du champ
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors],
  );

  // ============================================
  // GESTION DES LIGNES DE DOCUMENT
  // ============================================

  const items = formData.items;

  const addItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          ...DEFAULT_DOCUMENT_ITEM,
          order: prev.items.length,
        },
      ],
    }));
  }, []);

  const removeItem = useCallback((index: number) => {
    setFormData((prev) => {
      if (prev.items.length <= 1) {
        toast.error("Le document doit contenir au moins une ligne");
        return prev;
      }
      const newItems = prev.items.filter((_, i) => i !== index);
      return {
        ...prev,
        items: newItems.map((item, i) => ({ ...item, order: i })),
      };
    });
  }, []);

  const updateItem = useCallback(
    (
      index: number,
      field: keyof DocumentItemFormData,
      value: string | number,
    ) => {
      setFormData((prev) => {
        const newItems = [...prev.items];
        const item = { ...newItems[index] };

        if (field === "quantity" || field === "unitPrice") {
          const numValue =
            typeof value === "string" ? parseFloat(value) || 0 : value;
          item[field] = numValue;
          item.total = calculateItemTotal(
            field === "quantity" ? numValue : item.quantity,
            field === "unitPrice" ? numValue : item.unitPrice,
          );
        } else if (field === "description") {
          item.description = value as string;
        }

        newItems[index] = item;
        return { ...prev, items: newItems };
      });

      // Effacer l'erreur des items
      if (errors[`items.${index}.${field}`]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`items.${index}.${field}`];
          return newErrors;
        });
      }
    },
    [errors],
  );

  // ============================================
  // CALCULS AUTOMATIQUES
  // ============================================

  const { subtotal, taxAmount, total } = useMemo(() => {
    return calculateInvoiceTotals(
      items.map((item) => ({
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      formData.taxRate ?? 20,
      formData.discount ?? 0,
    );
  }, [items, formData.taxRate, formData.discount]);

  // ============================================
  // PREVIEW EN TEMPS RÉEL
  // ============================================

  const previewData: InvoicePreviewData = useMemo(() => {
    const formatDate = (date: Date | null | undefined): string => {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("fr-FR");
    };

    return {
      invoiceNumber: formData.invoiceNumber || "FAC-XXXX-XXXX",
      issueDate: formatDate(formData.issueDate),
      dueDate: formData.dueDate ? formatDate(formData.dueDate) : "-",

      // Entreprise (infos émetteur du formulaire) - valeurs par défaut pour les champs requis
      companyName: formData.companyName || "Votre Société",
      companyAddress: formData.companyAddress || "Adresse",
      companyCity: formData.companyCity || "Ville",
      companyPostalCode: formData.companyPostalCode || "00000",
      companyCountry: formData.companyCountry || "France",
      companyPhone: formData.companyPhone || undefined,
      companyEmail: formData.companyEmail || undefined,
      companySiret: formData.companySiret || undefined,
      companyVatNumber: formData.companyVatNumber || undefined,
      companyLogo: formData.companyLogo || undefined,

      // Client
      clientName: formData.clientName || "Nom du client",
      clientAddress: formData.clientAddress || undefined,
      clientCity: formData.clientCity || undefined,
      clientPostalCode: formData.clientPostalCode || undefined,
      clientCountry: formData.clientCountry || undefined,
      clientEmail: formData.clientEmail || undefined,
      clientPhone: formData.clientPhone || undefined,
      clientSiret: formData.clientSiret || undefined,
      clientVatNumber: formData.clientVatNumber || undefined,

      // Lignes
      items:
        items.length > 0 && items[0].description
          ? items.map((item) => ({
              description: item.description || "Description",
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total || 0,
            }))
          : [
              {
                description: "Prestation de service",
                quantity: 1,
                unitPrice: 500,
                total: 500,
              },
            ],

      // Totaux
      subtotal,
      taxRate: formData.taxRate ?? 20,
      taxAmount,
      discount: formData.discount ?? 0,
      total,
      currency: formData.currency || "EUR",

      // Notes
      notes: formData.notes || undefined,
      terms: formData.terms || undefined,
    };
  }, [formData, items, subtotal, taxAmount, total]);

  // ============================================
  // VALIDATION
  // ============================================

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Valider le nom du document
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Le nom du document est requis";
    }

    // Valider le nom du client
    if (!formData.clientName || formData.clientName.trim() === "") {
      newErrors.clientName = "Le nom du client est requis";
    }

    // Valider l'email du client (si fourni)
    if (formData.clientEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.clientEmail)) {
        newErrors.clientEmail = "L'email client est invalide";
      }
    }

    // Valider l'email de l'entreprise (si fourni)
    if (formData.companyEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.companyEmail)) {
        newErrors.companyEmail = "L'email entreprise est invalide";
      }
    }

    // Valider le SIRET client (si fourni)
    if (formData.clientSiret) {
      const siretRegex = /^[0-9]{14}$/;
      if (!siretRegex.test(formData.clientSiret)) {
        newErrors.clientSiret = "Le SIRET client doit contenir 14 chiffres";
      }
    }

    // Valider le SIRET entreprise (si fourni)
    if (formData.companySiret) {
      const siretRegex = /^[0-9]{14}$/;
      if (!siretRegex.test(formData.companySiret)) {
        newErrors.companySiret =
          "Le SIRET entreprise doit contenir 14 chiffres";
      }
    }

    // Valider le numéro de TVA client (si fourni)
    if (formData.clientVatNumber) {
      const vatRegex = /^[A-Z]{2}[0-9A-Z]{2,13}$/;
      if (!vatRegex.test(formData.clientVatNumber)) {
        newErrors.clientVatNumber = "Le numéro de TVA client est invalide";
      }
    }

    // Valider le numéro de TVA entreprise (si fourni)
    if (formData.companyVatNumber) {
      const vatRegex = /^[A-Z]{2}[0-9A-Z]{2,13}$/;
      if (!vatRegex.test(formData.companyVatNumber)) {
        newErrors.companyVatNumber = "Le numéro de TVA entreprise est invalide";
      }
    }

    // Valider les items
    if (formData.items.length === 0) {
      newErrors.items = "Le document doit contenir au moins une ligne";
    } else {
      formData.items.forEach((item, index) => {
        if (!item.description || item.description.trim() === "") {
          newErrors[`items.${index}.description`] =
            "La description est requise";
        }
        if (item.quantity <= 0) {
          newErrors[`items.${index}.quantity`] =
            "La quantité doit être positive";
        }
        if (item.unitPrice < 0) {
          newErrors[`items.${index}.unitPrice`] =
            "Le prix ne peut pas être négatif";
        }
      });
    }

    // Valider le taux de TVA
    if (formData.taxRate !== null && formData.taxRate !== undefined) {
      if (formData.taxRate < 0 || formData.taxRate > 100) {
        newErrors.taxRate = "Le taux de TVA doit être entre 0 et 100";
      }
    }

    // Valider la remise
    if (formData.discount !== null && formData.discount !== undefined) {
      if (formData.discount < 0) {
        newErrors.discount = "La remise ne peut pas être négative";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ============================================
  // SAUVEGARDE
  // ============================================

  const save = useCallback(async (): Promise<boolean> => {
    // Valider le formulaire
    if (!validate()) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return false;
    }

    setIsSaving(true);

    try {
      // Préparer les données
      const documentData = {
        name: formData.name,
        // Infos émetteur
        companyName: formData.companyName || null,
        companyAddress: formData.companyAddress || null,
        companyCity: formData.companyCity || null,
        companyPostalCode: formData.companyPostalCode || null,
        companyCountry: formData.companyCountry || null,
        companyPhone: formData.companyPhone || null,
        companyEmail: formData.companyEmail || null,
        companySiret: formData.companySiret || null,
        companyVatNumber: formData.companyVatNumber || null,
        companyLogo: formData.companyLogo || null,
        // Infos client
        clientName: formData.clientName,
        clientEmail: formData.clientEmail || null,
        clientPhone: formData.clientPhone || null,
        clientAddress: formData.clientAddress || null,
        clientCity: formData.clientCity || null,
        clientPostalCode: formData.clientPostalCode || null,
        clientCountry: formData.clientCountry || null,
        clientSiret: formData.clientSiret || null,
        clientVatNumber: formData.clientVatNumber || null,
        // Infos facture
        invoiceNumber: formData.invoiceNumber || null,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate || null,
        // Montants
        taxRate: formData.taxRate ?? 20,
        discount: formData.discount ?? 0,
        currency: formData.currency || "EUR",
        // Options
        notes: formData.notes || null,
        terms: formData.terms || null,
        templateId: formData.templateId || null,
        styleConfig: templateConfig,
        // Lignes
        items: formData.items.map((item, index) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          order: item.order ?? index,
        })),
      };

      let result;

      if (isEditMode && documentId) {
        result = await updateDocument(documentId, documentData);
      } else {
        result = await createDocument(documentData);
      }

      if (result.success && result.data) {
        const successMessage = isEditMode
          ? "Document mis à jour avec succès"
          : "Document créé avec succès";
        toast.success(successMessage);
        onSuccess?.(result.data as DocumentWithItems);
        return true;
      } else {
        const errorMessage = result.message || "Erreur lors de la sauvegarde";
        toast.error(errorMessage);
        onError?.(errorMessage);
        return false;
      }
    } catch (error) {
      const errorMessage = "Une erreur inattendue s'est produite";
      toast.error(errorMessage);
      onError?.(errorMessage);
      console.error("Erreur de sauvegarde:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    formData,
    templateConfig,
    validate,
    isEditMode,
    documentId,
    onSuccess,
    onError,
  ]);

  // ============================================
  // RESET
  // ============================================

  const reset = useCallback(() => {
    setStep("template");
    setSelectedTemplate(null);
    setTemplateConfig(defaultTemplateConfig);
    setOriginalTemplateConfig(defaultTemplateConfig);
    setFormData({ ...DEFAULT_DOCUMENT_FORM_DATA });
    setErrors({});
  }, []);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Navigation
    step,
    setStep,
    goToTemplateSelection,
    goToEditor,

    // Template
    selectedTemplate,
    selectTemplate,

    // Configuration template
    templateConfig,
    updateTemplateConfig,
    resetTemplateConfig,

    // Formulaire
    formData,
    setFormData,
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
    validate,
    reset,
  };
}
