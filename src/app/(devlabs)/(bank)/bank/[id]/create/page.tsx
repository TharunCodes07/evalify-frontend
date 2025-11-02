"use client";

import { useParams } from "next/navigation";
import QuestionCreation from "@/components/questions/question-creation";
import { useToast } from "@/hooks/use-toast";

export default function CreateBankQuestionPage() {
  const params = useParams();
  const { success: _success } = useToast();
  const bankId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Question</h1>
        <p className="text-muted-foreground mt-2">
          Add a new question to the question bank
        </p>
      </div>

      <QuestionCreation context="bank" contextId={bankId} />
    </div>
  );
}
