"use client";

import { useParams } from "next/navigation";
import QuestionRendererDemoComprehensive from "@/components/questions/question-renderer/demo-comprehensive";

export default function BankDetailPage() {
  const params = useParams();
  const bankId = params.id as string;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/30 px-6 py-4 mb-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Question Bank Demo</h1>
          <p className="text-muted-foreground">Bank ID: {bankId}</p>
        </div>
      </div>

      <QuestionRendererDemoComprehensive />
    </div>
  );
}
