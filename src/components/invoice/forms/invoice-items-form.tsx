"use client";

import { useCallback } from "react";
import { Plus, Trash2, GripVertical, Package } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentItemFormData } from "@/types/document";

export interface InvoiceItemsFormProps {
  items: DocumentItemFormData[];
  currency?: string;
  errors: Record<string, string>;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (
    index: number,
    field: keyof DocumentItemFormData,
    value: string | number,
  ) => void;
  onMoveItem?: (fromIndex: number, toIndex: number) => void;
  className?: string;
}

/**
 * Composant formulaire pour les lignes de facture
 * Permet d'ajouter, modifier et supprimer des lignes
 */
export function InvoiceItemsForm({
  items,
  currency = "EUR",
  errors,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onMoveItem,
  className,
}: InvoiceItemsFormProps) {
  // Gérer le changement de description
  const handleDescriptionChange = useCallback(
    (index: number, value: string) => {
      onUpdateItem(index, "description", value);
    },
    [onUpdateItem],
  );

  // Gérer le changement de quantité
  const handleQuantityChange = useCallback(
    (index: number, value: string) => {
      const numValue = parseFloat(value) || 0;
      onUpdateItem(index, "quantity", numValue);
    },
    [onUpdateItem],
  );

  // Gérer le changement de prix unitaire
  const handleUnitPriceChange = useCallback(
    (index: number, value: string) => {
      const numValue = parseFloat(value) || 0;
      onUpdateItem(index, "unitPrice", numValue);
    },
    [onUpdateItem],
  );

  // Obtenir l'erreur d'un champ d'item
  const getItemError = (index: number, field: string): string | undefined => {
    return errors[`items.${index}.${field}`];
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5" />
          Lignes de facture
        </CardTitle>
        <CardDescription>
          Ajoutez les produits ou services facturés
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Erreur globale des items */}
        {errors.items && (
          <p className="text-sm text-destructive">{errors.items}</p>
        )}

        {/* Version desktop - Tableau */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {onMoveItem && <TableHead className="w-10"></TableHead>}
                <TableHead className="min-w-[200px]">Description</TableHead>
                <TableHead className="w-28">Quantité</TableHead>
                <TableHead className="w-32">Prix unitaire</TableHead>
                <TableHead className="w-32 text-right">Total</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index} className="group">
                  {/* Poignée de déplacement */}
                  {onMoveItem && (
                    <TableCell className="cursor-grab">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  )}

                  {/* Description */}
                  <TableCell>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                      placeholder="Description du produit ou service"
                      className={cn(
                        "min-h-[38px] resize-none",
                        getItemError(index, "description") &&
                          "border-destructive",
                      )}
                      rows={1}
                    />
                    {getItemError(index, "description") && (
                      <p className="text-xs text-destructive mt-1">
                        {getItemError(index, "description")}
                      </p>
                    )}
                  </TableCell>

                  {/* Quantité */}
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      className={cn(
                        "text-right",
                        getItemError(index, "quantity") && "border-destructive",
                      )}
                    />
                    {getItemError(index, "quantity") && (
                      <p className="text-xs text-destructive mt-1">
                        {getItemError(index, "quantity")}
                      </p>
                    )}
                  </TableCell>

                  {/* Prix unitaire */}
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleUnitPriceChange(index, e.target.value)
                      }
                      className={cn(
                        "text-right",
                        getItemError(index, "unitPrice") &&
                          "border-destructive",
                      )}
                    />
                    {getItemError(index, "unitPrice") && (
                      <p className="text-xs text-destructive mt-1">
                        {getItemError(index, "unitPrice")}
                      </p>
                    )}
                  </TableCell>

                  {/* Total */}
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.total || 0, currency)}
                  </TableCell>

                  {/* Supprimer */}
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={items.length <= 1}
                      title="Supprimer cette ligne"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Version mobile - Cartes */}
        <div className="md:hidden space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border bg-card space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-muted-foreground">
                  Ligne {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveItem(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  disabled={items.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  placeholder="Description du produit ou service"
                  className={cn(
                    getItemError(index, "description") && "border-destructive",
                  )}
                  rows={2}
                />
                {getItemError(index, "description") && (
                  <p className="text-xs text-destructive">
                    {getItemError(index, "description")}
                  </p>
                )}
              </div>

              {/* Quantité et Prix */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                    className={cn(
                      getItemError(index, "quantity") && "border-destructive",
                    )}
                  />
                  {getItemError(index, "quantity") && (
                    <p className="text-xs text-destructive">
                      {getItemError(index, "quantity")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Prix unitaire</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleUnitPriceChange(index, e.target.value)
                    }
                    className={cn(
                      getItemError(index, "unitPrice") && "border-destructive",
                    )}
                  />
                  {getItemError(index, "unitPrice") && (
                    <p className="text-xs text-destructive">
                      {getItemError(index, "unitPrice")}
                    </p>
                  )}
                </div>
              </div>

              {/* Total de la ligne */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-semibold">
                  {formatCurrency(item.total || 0, currency)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton Ajouter une ligne */}
        <Button
          type="button"
          variant="outline"
          onClick={onAddItem}
          className="w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une ligne
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Composant compact pour afficher les lignes en lecture seule
 */
export function InvoiceItemsReadOnly({
  items,
  currency = "EUR",
  className,
}: {
  items: DocumentItemFormData[];
  currency?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border overflow-hidden",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Description</TableHead>
            <TableHead className="w-24 text-right">Qté</TableHead>
            <TableHead className="w-32 text-right">Prix unit.</TableHead>
            <TableHead className="w-32 text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.unitPrice, currency)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(item.total || 0, currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
