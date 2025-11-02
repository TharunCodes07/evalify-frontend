"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuestionBank, BankQuestionResponse } from "@/types/bank";
import bankQueries from "@/repo/bank-queries/bank-queries";
import questionQueries from "@/repo/question-queries/question-queries";
import { QuestionRenderer } from "@/components/questions/question-renderer/question-renderer";
import { QuestionListSkeleton } from "@/components/questions/question-renderer/question-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@/lib/session-context";
import { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export default function BankDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bankId = params.id as string;
  const queryClient = useQueryClient();
  const { toast, success } = useToast();
  const { user } = useSessionContext();

  const { data: bank, isLoading: bankLoading } = useQuery<QuestionBank>({
    queryKey: ["bank", bankId],
    queryFn: () => bankQueries.getBankById(bankId),
  });

  const { data: questions = [], isLoading: questionsLoading } = useQuery<
    BankQuestionResponse[]
  >({
    queryKey: ["bank-questions", bankId],
    queryFn: () => questionQueries.bank.getAllQuestions(bankId),
  });

  const deleteMutation = useMutation({
    mutationFn: (questionId: string) =>
      questionQueries.bank.deleteQuestion(bankId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-questions", bankId] });
      success("Question deleted successfully");
    },
    onError: () => {
      toast("Failed to delete question");
    },
  });

  const canEdit = useMemo(
    () =>
      bank &&
      user &&
      (bank.owner.id === user.id ||
        bank.permission === "EDIT" ||
        bank.permission === "MANAGE"),
    [bank, user],
  );

  // Virtualizer setup
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: questions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400, // Estimate question card height
    overscan: 3,
    getItemKey: (index) => questions[index]?.id ?? index,
    measureElement: (el: Element) =>
      (el as HTMLElement).getBoundingClientRect().height,
  });

  const handleEdit = (questionId: string) => {
    router.push(`/bank/${bankId}/${questionId}`);
  };

  const handleDelete = (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate(questionId);
    }
  };

  if (bankLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-muted/30 px-6 py-4 mb-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-96" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 pb-10">
          <QuestionListSkeleton count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/30 px-6 py-4 mb-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{bank?.name}</h1>
              {bank?.description && (
                <p className="text-muted-foreground mt-1">{bank.description}</p>
              )}
            </div>
            {canEdit && (
              <Button onClick={() => router.push(`/bank/${bankId}/create`)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-10">
        {questionsLoading ? (
          <QuestionListSkeleton count={3} />
        ) : questions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No questions in this bank yet
            </p>
            {canEdit && (
              <Button
                className="mt-4"
                onClick={() => router.push(`/bank/${bankId}/create`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Question
              </Button>
            )}
          </div>
        ) : (
          <div
            ref={parentRef}
            className="overflow-y-auto"
            style={{ height: "calc(100vh - 250px)" }}
          >
            <div
              style={{
                height: virtualizer.getTotalSize(),
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const question = questions[virtualItem.index];
                return (
                  <div
                    key={question.id}
                    ref={virtualizer.measureElement}
                    data-index={virtualItem.index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <div className="pb-6">
                      <QuestionRenderer
                        question={question}
                        questionNumber={virtualItem.index + 1}
                        showCorrectAnswer={true}
                        showStudentAnswer={false}
                        onEdit={
                          canEdit ? () => handleEdit(question.id) : undefined
                        }
                        onDelete={
                          canEdit ? () => handleDelete(question.id) : undefined
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
