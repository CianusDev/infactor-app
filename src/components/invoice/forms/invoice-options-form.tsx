"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Settings2,
  StickyNote,
  Percent,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { DocumentFormData } from "@/types/document";

export interface InvoiceOptionsFormProps {
  formData: DocumentFormData;
  errors: Record<string, string>;
  onUpdate: <K extends keyof DocumentFormData>(
    field: K,
    value: DocumentFormData[K],
  ) => void;
  className?: string;
}

/**
 * Taux de TVA prédéfinis
 */
const TAX_RATES = [
  { value: 0, label: "0% (Exonéré)" },
  { value: 5.5, label: "5.5% (Taux réduit)" },
  { value: 10, label: "10% (Taux intermédiaire)" },
  { value: 20, label: "20% (Taux normal)" },
];

/**
 * Devises disponibles
 */
const CURRENCIES = [
  { value: "EUR", label: "EUR (€)" },
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CHF", label: "CHF (Fr.)" },
];

/**
 * Composant formulaire pour les options de facture
 * Inclut : dates, TVA, remise, devise, notes
 */
export function InvoiceOptionsForm({
  formData,
  errors,
  onUpdate,
  className,
}: InvoiceOptionsFormProps) {
  const [showNotes, setShowNotes] = useState(
    !!(formData.notes || formData.terms),
  );

  // Formater une date pour l'affichage
  const formatDisplayDate = (date: Date | undefined | null): string => {
    if (!date) return "Sélectionner une date";
    return format(date, "dd MMMM yyyy", { locale: fr });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dates et montants */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings2 className="h-5 w-5" />
            Options
          </CardTitle>
          <CardDescription>
            Dates, TVA et paramètres de la facture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date d'émission */}
            <div className="space-y-2">
              <Label htmlFor="issueDate">Date d&apos;émission</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="issueDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.issueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDisplayDate(formData.issueDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.issueDate}
                    onSelect={(date) => onUpdate("issueDate", date)}
                    locale={fr}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date d'échéance */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d&apos;échéance</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dueDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate
                      ? formatDisplayDate(formData.dueDate)
                      : "Aucune échéance"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate || undefined}
                    onSelect={(date) => onUpdate("dueDate", date || null)}
                    locale={fr}
                    initialFocus
                    disabled={(date) =>
                      formData.issueDate ? date < formData.issueDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* TVA et Devise */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Taux de TVA */}
            <div className="space-y-2">
              <Label htmlFor="taxRate" className="flex items-center gap-1">
                <Percent className="h-3.5 w-3.5" />
                Taux de TVA
              </Label>
              <Select
                value={formData.taxRate?.toString() || "20"}
                onValueChange={(value) =>
                  onUpdate("taxRate", parseFloat(value))
                }
              >
                <SelectTrigger id="taxRate">
                  <SelectValue placeholder="Sélectionner un taux" />
                </SelectTrigger>
                <SelectContent>
                  {TAX_RATES.map((rate) => (
                    <SelectItem key={rate.value} value={rate.value.toString()}>
                      {rate.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.taxRate && (
                <p className="text-sm text-destructive">{errors.taxRate}</p>
              )}
            </div>

            {/* Devise */}
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select
                value={formData.currency || "EUR"}
                onValueChange={(value) => onUpdate("currency", value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Remise */}
          <div className="space-y-2">
            <Label htmlFor="discount">Remise (montant)</Label>
            <div className="relative">
              <Input
                id="discount"
                type="number"
                min="0"
                step="0.01"
                value={formData.discount || 0}
                onChange={(e) =>
                  onUpdate("discount", parseFloat(e.target.value) || 0)
                }
                className={cn("pr-12", errors.discount && "border-destructive")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {formData.currency || "EUR"}
              </span>
            </div>
            {errors.discount && (
              <p className="text-sm text-destructive">{errors.discount}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes et conditions */}
      <Collapsible open={showNotes} onOpenChange={setShowNotes}>
        <Card>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto hover:bg-transparent"
              >
                <CardTitle className="flex items-center gap-2 text-lg">
                  <StickyNote className="h-5 w-5" />
                  Notes et conditions
                </CardTitle>
                {showNotes ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CardDescription>
              Informations complémentaires visibles sur la facture
            </CardDescription>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => onUpdate("notes", e.target.value || null)}
                  placeholder="Informations complémentaires pour le client..."
                  rows={3}
                />
              </div>

              {/* Conditions de paiement */}
              <div className="space-y-2">
                <Label htmlFor="terms">Conditions de paiement</Label>
                <Textarea
                  id="terms"
                  value={formData.terms || ""}
                  onChange={(e) => onUpdate("terms", e.target.value || null)}
                  placeholder="Paiement à réception, par virement bancaire..."
                  rows={3}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}

/**
 * Composant pour afficher les totaux de la facture
 */
export function InvoiceTotals({
  subtotal,
  taxRate,
  taxAmount,
  discount,
  total,
  currency = "EUR",
  className,
}: {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency?: string;
  className?: string;
}) {
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Récapitulatif</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Sous-total */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Sous-total HT</span>
          <span className="font-medium">{formatAmount(subtotal)}</span>
        </div>

        {/* Remise */}
        {discount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span>Remise</span>
            <span>-{formatAmount(discount)}</span>
          </div>
        )}

        {/* TVA */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">TVA ({taxRate}%)</span>
          <span className="font-medium">{formatAmount(taxAmount)}</span>
        </div>

        {/* Séparateur */}
        <div className="border-t border-border my-2" />

        {/* Total TTC */}
        <div className="flex items-center justify-between text-lg">
          <span className="font-semibold">Total TTC</span>
          <span className="font-bold">{formatAmount(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
