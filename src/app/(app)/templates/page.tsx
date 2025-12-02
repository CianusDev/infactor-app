import { Metadata } from "next";
import { TemplateList } from "@/components/templates";

export const metadata: Metadata = {
  title: "Modèles de factures",
  description: "Gérez vos modèles de factures",
};

export default function TemplatesPage() {
  return (
    <div className="container mx-auto py-6">
      <TemplateList
        title="Modèles de factures"
        description="Choisissez parmi nos modèles professionnels pour personnaliser vos factures."
        showSearch
        showRefresh
        columns={3}
        showCardActions
      />
    </div>
  );
}
