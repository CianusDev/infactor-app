"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Building2,
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
import { LogoUpload } from "@/components/templates/logo-upload";

export interface CompanyInfoFormProps {
  formData: DocumentFormData;
  errors: Record<string, string>;
  onUpdate: <K extends keyof DocumentFormData>(
    field: K,
    value: DocumentFormData[K],
  ) => void;
  className?: string;
}

/**
 * Composant formulaire pour les informations de l'émetteur (entreprise/freelance)
 * Inclut : nom, email, téléphone, adresse, SIRET, TVA, logo
 */
export function CompanyInfoForm({
  formData,
  errors,
  onUpdate,
  className,
}: CompanyInfoFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Vérifier si des champs avancés sont remplis
  const hasAdvancedData = !!(
    formData.companyAddress ||
    formData.companyCity ||
    formData.companyPostalCode ||
    formData.companyCountry ||
    formData.companySiret ||
    formData.companyVatNumber ||
    formData.companyLogo
  );

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5" />
          Informations émetteur
        </CardTitle>
        <CardDescription>
          Vos coordonnées qui apparaîtront sur la facture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Champs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nom de l'entreprise */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center gap-1">
              Nom de l&apos;entreprise
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="companyName"
                value={formData.companyName || ""}
                onChange={(e) =>
                  onUpdate("companyName", e.target.value || null)
                }
                placeholder="Votre entreprise"
                className={cn(
                  "pl-9",
                  errors.companyName && "border-destructive",
                )}
              />
            </div>
            {errors.companyName && (
              <p className="text-sm text-destructive">{errors.companyName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="companyEmail">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="companyEmail"
                type="email"
                value={formData.companyEmail || ""}
                onChange={(e) =>
                  onUpdate("companyEmail", e.target.value || null)
                }
                placeholder="contact@entreprise.fr"
                className={cn(
                  "pl-9",
                  errors.companyEmail && "border-destructive",
                )}
              />
            </div>
            {errors.companyEmail && (
              <p className="text-sm text-destructive">{errors.companyEmail}</p>
            )}
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="companyPhone">Téléphone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="companyPhone"
                type="tel"
                value={formData.companyPhone || ""}
                onChange={(e) =>
                  onUpdate("companyPhone", e.target.value || null)
                }
                placeholder="+33 1 23 45 67 89"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Section avancée (adresse, SIRET, TVA, logo) */}
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
                Adresse, informations fiscales et logo
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
              <Label htmlFor="companyAddress">Adresse</Label>
              <Input
                id="companyAddress"
                value={formData.companyAddress || ""}
                onChange={(e) =>
                  onUpdate("companyAddress", e.target.value || null)
                }
                placeholder="123 rue de la Paix"
              />
            </div>

            {/* Ville, Code postal, Pays */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyCity">Ville</Label>
                <Input
                  id="companyCity"
                  value={formData.companyCity || ""}
                  onChange={(e) =>
                    onUpdate("companyCity", e.target.value || null)
                  }
                  placeholder="Paris"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPostalCode">Code postal</Label>
                <Input
                  id="companyPostalCode"
                  value={formData.companyPostalCode || ""}
                  onChange={(e) =>
                    onUpdate("companyPostalCode", e.target.value || null)
                  }
                  placeholder="75001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyCountry">Pays</Label>
                <Input
                  id="companyCountry"
                  value={formData.companyCountry || ""}
                  onChange={(e) =>
                    onUpdate("companyCountry", e.target.value || null)
                  }
                  placeholder="France"
                />
              </div>
            </div>

            {/* SIRET et TVA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companySiret">SIRET</Label>
                <Input
                  id="companySiret"
                  value={formData.companySiret || ""}
                  onChange={(e) =>
                    onUpdate("companySiret", e.target.value || null)
                  }
                  placeholder="12345678901234"
                  maxLength={14}
                  className={cn(errors.companySiret && "border-destructive")}
                />
                {errors.companySiret && (
                  <p className="text-sm text-destructive">
                    {errors.companySiret}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyVatNumber">Numéro de TVA</Label>
                <Input
                  id="companyVatNumber"
                  value={formData.companyVatNumber || ""}
                  onChange={(e) =>
                    onUpdate(
                      "companyVatNumber",
                      e.target.value?.toUpperCase() || null,
                    )
                  }
                  placeholder="FR12345678901"
                  className={cn(
                    errors.companyVatNumber && "border-destructive",
                  )}
                />
                {errors.companyVatNumber && (
                  <p className="text-sm text-destructive">
                    {errors.companyVatNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Logo de l&apos;entreprise
              </Label>
              <LogoUpload
                value={formData.companyLogo}
                onChange={(url) => onUpdate("companyLogo", url)}
              />
              {errors.companyLogo && (
                <p className="text-sm text-destructive">{errors.companyLogo}</p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
