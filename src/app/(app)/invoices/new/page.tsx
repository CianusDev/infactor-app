"use client";

import { InvoiceCreator } from "@/components/invoice/creator";

export default function NewInvoicePage() {
  return (
    <div className="-m-4 h-[calc(100vh-64px)]">
      <InvoiceCreator />
    </div>
  );
}
