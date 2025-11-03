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
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { TopicsFilterDrawer } from "@/components/bank/topics-filter-drawer";
import { Badge } from "@/components/ui/badge";

const TopicBadge = lazy(async () => ({
  default: ({ count }: { count: number }) => (
    <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
      {count} Topics
    </Badge>
  ),
}));

const QuestionBadge = lazy(async () => ({
  default: ({ count }: { count: number }) => (
    <Badge className="rounded-full px-2 py-0.5 text-xs">
      {count} Questions
    </Badge>
  ),
}));

export default function BankDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bankId = params.id as string;
  const queryClient = useQueryClient();
  const { toast, success } = useToast();
  const { user } = useSessionContext();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [topicFilter, setTopicFilter] = useState<"all" | "none" | string[]>(
    "all",
  );

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

  const { data: backendTopics = [], isLoading: topicsLoading } = useQuery<
    string[]
  >({
    queryKey: ["bank-topics", bankId],
    queryFn: () => bankQueries.getTopics(bankId),
  });

  const deleteMutation = useMutation({
    mutationFn: (questionId: string) =>
      questionQueries.bank.deleteQuestion(bankId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-questions", bankId] });
      success("Question deleted successfully");
    },
    onError: () => toast("Failed to delete question"),
  });

  const canEdit =
    bank &&
    user &&
    (bank.owner.id === user.id ||
      bank.permission === "EDIT" ||
      bank.permission === "MANAGE");

  const filteredQuestions = useMemo(() => {
    if (topicFilter === "all") return questions;
    if (topicFilter === "none")
      return questions.filter((q) => !q.topics || q.topics.length === 0);
    if (Array.isArray(topicFilter))
      return questions.filter((q) =>
        q.topics?.some((t) => topicFilter.includes(t)),
      );
    return questions;
  }, [questions, topicFilter]);

  const virtualizer = useWindowVirtualizer({
    count: filteredQuestions.length,
    estimateSize: () => 400,
    overscan: 3,
    getItemKey: (i) => filteredQuestions[i]?.id ?? i,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [filteredQuestions.length, virtualizer]);

  const measureRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) virtualizer.measureElement(el);
    },
    [virtualizer],
  );

  const handleEdit = (id: string) => router.push(`/bank/${bankId}/${id}`);
  const handleDelete = (id: string) => deleteMutation.mutate(id);

  const handleAddTopic = async (topic: string) => {
    try {
      await bankQueries.addTopic(bankId, topic);
      await queryClient.invalidateQueries({
        queryKey: ["bank-topics", bankId],
      });
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } | string };
      };
      const message =
        (typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message) || "Failed to add topic";
      throw new Error(message);
    }
  };

  const handleUpdateTopic = async (oldTopic: string, newTopic: string) => {
    try {
      await bankQueries.updateTopic(bankId, oldTopic, newTopic);
      await queryClient.invalidateQueries({
        queryKey: ["bank-topics", bankId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["bank-questions", bankId],
      });
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } | string };
      };
      const message =
        (typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message) || "Failed to update topic";
      throw new Error(message);
    }
  };

  const handleDeleteTopic = async (topic: string) => {
    try {
      await bankQueries.deleteTopic(bankId, topic);
      await queryClient.invalidateQueries({
        queryKey: ["bank-topics", bankId],
      });
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } | string };
      };
      const message =
        (typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message) ||
        "Cannot delete topic. It may be in use by questions.";
      throw new Error(message);
    }
  };

  const topicCount =
    (backendTopics?.length && backendTopics.length > 0
      ? backendTopics.length
      : bank?.topics?.length) ?? 0;
  const questionCount = questions.length;

  if (bankLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b px-6 py-4 mb-6">
          <div className="container mx-auto flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-5 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
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
      <div className="border-b px-6 py-4 mb-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-3">
                <h1 className="text-3xl font-bold">{bank?.name}</h1>
                {topicsLoading ? (
                  <Skeleton className="h-5 w-24 rounded-full" />
                ) : (
                  <Suspense
                    fallback={
                      <Badge
                        variant="secondary"
                        className="rounded-full px-2 py-0.5 text-xs opacity-60"
                      >
                        ...
                      </Badge>
                    }
                  >
                    <TopicBadge count={topicCount} />
                  </Suspense>
                )}
                {questionsLoading ? (
                  <Skeleton className="h-5 w-28 rounded-full" />
                ) : (
                  <Suspense
                    fallback={<Skeleton className="h-5 w-28 rounded-full" />}
                  >
                    <QuestionBadge count={questionCount} />
                  </Suspense>
                )}
              </div>
              {bank?.description && (
                <p className="text-muted-foreground mt-1">{bank.description}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <TopicsFilterDrawer
                topics={backendTopics}
                selectedTopics={selectedTopics}
                onTopicsChange={setSelectedTopics}
                onAddTopic={handleAddTopic}
                onUpdateTopic={handleUpdateTopic}
                onDeleteTopic={handleDeleteTopic}
                onFilterChange={setTopicFilter}
                currentFilter={topicFilter}
                canEdit={!!canEdit}
              />
              {canEdit && (
                <Button onClick={() => router.push(`/bank/${bankId}/create`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              )}
            </div>
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
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No questions match the selected filter
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setTopicFilter("all")}
            >
              Clear Filter
            </Button>
          </div>
        ) : (
          <div
            style={{
              height: virtualizer.getTotalSize(),
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((vi) => {
              const q = filteredQuestions[vi.index];
              return (
                <div
                  key={q.id}
                  ref={measureRef}
                  data-index={vi.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${vi.start}px)`,
                  }}
                >
                  <div className="pb-6">
                    <QuestionRenderer
                      question={q}
                      questionNumber={vi.index + 1}
                      showCorrectAnswer
                      showStudentAnswer={false}
                      onEdit={canEdit ? () => handleEdit(q.id) : undefined}
                      onDelete={canEdit ? () => handleDelete(q.id) : undefined}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
