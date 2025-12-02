"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DocumentFormData } from "@/types/document";

export interface ClientInfoFormProps {
  formData: DocumentFormData;
  errors: Record<string, string>;
  onUpdate: <K extends keyof DocumentFormData>(
    field: K,
    value: DocumentFormData[K],
  ) => void;
  className?: string;
}

/**
 * Composant formulaire pour les informations du client
 * Inclut : nom, email, téléphone, adresse, SIRET, TVA
 */
export function ClientInfoForm({
  formData,
  errors,
  onUpdate,
  className,
}: ClientInfoFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Vérifier si des champs avancés sont remplis
  const hasAdvancedData = !!(
    formData.clientAddress ||
    formData.clientCity ||
    formData.clientPostalCode ||
    formData.clientCountry ||
    formData.clientSiret ||
    formData.clientVatNumber
  );

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5" />
          Informations client
        </CardTitle>
        <CardDescription>
          Renseignez les coordonnées de votre client
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Champs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nom du client */}
          <div className="space-y-2">
            <Label htmlFor="clientName" className="flex items-center gap-1">
              Nom du client <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => onUpdate("clientName", e.target.value)}
                placeholder="Nom de l'entreprise ou du client"
                className={cn(
                  "pl-9",
                  errors.clientName && "border-destructive",
                )}
              />
            </div>
            {errors.clientName && (
              <p className="text-sm text-destructive">{errors.clientName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail || ""}
                onChange={(e) =>
                  onUpdate("clientEmail", e.target.value || null)
                }
                placeholder="email@exemple.com"
                className={cn(
                  "pl-9",
                  errors.clientEmail && "border-destructive",
                )}
              />
            </div>
            {errors.clientEmail && (
              <p className="text-sm text-destructive">{errors.clientEmail}</p>
            )}
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="clientPhone">Téléphone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="clientPhone"
                type="tel"
                value={formData.clientPhone || ""}
                onChange={(e) =>
                  onUpdate("clientPhone", e.target.value || null)
                }
                placeholder="+33 1 23 45 67 89"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Section avancée (adresse, SIRET, TVA) */}
        <Collapsible
          open={showAdvanced || hasAdvancedData}
          onOpenChange={setShowAdvanced}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse et informations fiscales
              </span>
              {showAdvanced || hasAdvancedData ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="pt-4 space-y-4">
            {/* Adresse */}
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Adresse</Label>
              <Input
                id="clientAddress"
                value={formData.clientAddress || ""}
                onChange={(e) =>
                  onUpdate("clientAddress", e.target.value || null)
                }
                placeholder="123 rue de la Paix"
              />
            </div>

            {/* Ville, Code postal, Pays */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientCity">Ville</Label>
                <Input
                  id="clientCity"
                  value={formData.clientCity || ""}
                  onChange={(e) =>
                    onUpdate("clientCity", e.target.value || null)
                  }
                  placeholder="Paris"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPostalCode">Code postal</Label>
                <Input
                  id="clientPostalCode"
                  value={formData.clientPostalCode || ""}
                  onChange={(e) =>
                    onUpdate("clientPostalCode", e.target.value || null)
                  }
                  placeholder="75001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientCountry">Pays</Label>
                <Input
                  id="clientCountry"
                  value={formData.clientCountry || ""}
                  onChange={(e) =>
                    onUpdate("clientCountry", e.target.value || null)
                  }
                  placeholder="France"
                />
              </div>
            </div>

            {/* SIRET et TVA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientSiret">SIRET</Label>
                <Input
                  id="clientSiret"
                  value={formData.clientSiret || ""}
                  onChange={(e) =>
                    onUpdate("clientSiret", e.target.value || null)
                  }
                  placeholder="12345678901234"
                  maxLength={14}
                  className={cn(errors.clientSiret && "border-destructive")}
                />
                {errors.clientSiret && (
                  <p className="text-sm text-destructive">
                    {errors.clientSiret}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientVatNumber">Numéro de TVA</Label>
                <Input
                  id="clientVatNumber"
                  value={formData.clientVatNumber || ""}
                  onChange={(e) =>
                    onUpdate(
                      "clientVatNumber",
                      e.target.value?.toUpperCase() || null,
                    )
                  }
                  placeholder="FR12345678901"
                  className={cn(errors.clientVatNumber && "border-destructive")}
                />
                {errors.clientVatNumber && (
                  <p className="text-sm text-destructive">
                    {errors.clientVatNumber}
                  </p>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
