"use client";

import { useParams } from "next/navigation";

export default function BankDetailPage() {
  const params = useParams();
  const bankId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Bank Details</h1>
      <p className="text-muted-foreground">Bank ID: {bankId}</p>
      <p className="text-muted-foreground mt-4">
        This page is under construction.
      </p>
    </div>
  );
}
