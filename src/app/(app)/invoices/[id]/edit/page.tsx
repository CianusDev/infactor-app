"use client";

import { use } from "react";
import { InvoiceCreator } from "@/components/invoice/creator";

interface EditDocumentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditDocumentPage({ params }: EditDocumentPageProps) {
  const { id } = use(params);

  return (
    <div className="-m-4 h-[calc(100vh-64px)]">
      <InvoiceCreator documentId={id} />
    </div>
  );
}
