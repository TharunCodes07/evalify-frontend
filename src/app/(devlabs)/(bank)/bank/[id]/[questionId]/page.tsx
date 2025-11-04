"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import questionQueries from "@/repo/question-queries/question-queries";
import { BankQuestionResponse } from "@/types/bank";
import QuestionCreation from "@/components/questions/create-edit/question-creation";
import { QuestionSkeleton } from "@/components/questions/question-renderer/question-skeleton";

export default function EditBankQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const bankId = params.id as string;
  const questionId = params.questionId as string;

  const { data: question, isLoading } = useQuery<BankQuestionResponse>({
    queryKey: ["bank-question", bankId, questionId],
    queryFn: () => questionQueries.bank.getQuestion(bankId, questionId),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Question</h1>
          <p className="text-muted-foreground mt-2">
            Update the question details below
          </p>
        </div>
        <QuestionSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Question</h1>
        <p className="text-muted-foreground mt-2">
          Update the question details below
        </p>
      </div>

      <QuestionCreation
        context="bank"
        contextId={bankId}
        editingQuestion={question}
        onSave={() => router.push(`/bank/${bankId}`)}
      />
    </div>
  );
}
