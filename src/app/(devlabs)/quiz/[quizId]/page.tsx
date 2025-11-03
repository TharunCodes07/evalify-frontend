"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuizDetailResponse, QuizQuestionResponse } from "@/types/quiz";
import quizQueries from "@/repo/quiz-queries/quiz-queries";
import questionQueries from "@/repo/question-queries/question-queries";
import { QuestionRenderer } from "@/components/questions/question-renderer/question-renderer";
import { QuestionListSkeleton } from "@/components/questions/question-renderer/question-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Clock,
  CalendarClock,
  Award,
  Settings,
  Eye,
  ArrowLeft,
  Puzzle,
  Library,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@/lib/session-context";
import { useMemo, useCallback, useEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;
  const queryClient = useQueryClient();
  const { toast, success } = useToast();
  const { user } = useSessionContext();

  const { data: quiz, isLoading: quizLoading } = useQuery<QuizDetailResponse>({
    queryKey: ["quiz", quizId],
    queryFn: () => quizQueries.getQuizById(quizId),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });

  const { data: questions = [], isLoading: questionsLoading } = useQuery<
    QuizQuestionResponse[]
  >({
    queryKey: ["quiz-questions", quizId],
    queryFn: () => questionQueries.quiz.getAllQuestions(quizId),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (questionId: string) =>
      questionQueries.quiz.deleteQuestion(quizId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      success("Question deleted successfully");
    },
    onError: () => toast("Failed to delete question"),
  });

  // Check edit permissions
  const canEdit = useMemo(() => {
    if (!quiz || !user) return false;
    const isOwner = quiz.createdBy.id === user.id;
    const isAdminOrManager = user.role === "ADMIN" || user.role === "MANAGER";
    return isOwner || isAdminOrManager;
  }, [quiz, user]);

  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [questions]);

  // Calculate total marks from questions
  const totalMarks = useMemo(() => {
    return questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  }, [questions]);

  const virtualizer = useWindowVirtualizer({
    count: sortedQuestions.length,
    estimateSize: () => 400,
    overscan: 3,
    getItemKey: (i) => sortedQuestions[i]?.id ?? i,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [sortedQuestions.length, virtualizer]);

  const measureRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) virtualizer.measureElement(el);
    },
    [virtualizer],
  );

  const handleEdit = (id: string) => {
    router.push(`/quiz/${quizId}/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (quizLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b px-6 py-4 mb-6">
          <div className="container mx-auto">
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>
        <div className="container mx-auto px-6 pb-10">
          <QuestionListSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz not found</h2>
          <p className="text-muted-foreground mb-4">
            The quiz you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Button onClick={() => router.push("/quiz")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  const quizStatus = quiz.isPublished ? "Published" : "Draft";
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">{quiz.title}</h1>
                <Badge
                  variant={quiz.isPublished ? "default" : "secondary"}
                  className="rounded-full"
                >
                  {quizStatus}
                </Badge>
              </div>

              {quiz.description && (
                <p className="text-muted-foreground">{quiz.description}</p>
              )}

              {/* Metadata Row */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                {quiz.startTime && quiz.endTime && (
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    <span>
                      {new Date(quiz.startTime).toLocaleDateString()} -{" "}
                      {new Date(quiz.endTime).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{quiz.durationMinutes} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Puzzle className="h-4 w-4" />
                  <span>
                    {totalQuestions}{" "}
                    {totalQuestions === 1 ? "question" : "questions"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  {questionsLoading ? (
                    <Skeleton className="h-4 w-16" />
                  ) : (
                    <span>
                      {totalMarks} {totalMarks === 1 ? "mark" : "marks"}
                    </span>
                  )}
                </div>
              </div>

              {/* Participants Section */}
              {quiz && (
                <div className="flex flex-wrap gap-2">
                  {quiz.courses.map((course) => (
                    <Badge key={course.id} variant="outline" className="gap-1">
                      <span className="text-xs text-muted-foreground">
                        Course:
                      </span>
                      {course.name}
                      {course.additionalInfo && (
                        <span className="text-xs text-muted-foreground">
                          ({course.additionalInfo})
                        </span>
                      )}
                    </Badge>
                  ))}
                  {quiz.batches.map((batch) => (
                    <Badge key={batch.id} variant="outline" className="gap-1">
                      <span className="text-xs text-muted-foreground">
                        Batch:
                      </span>
                      {batch.name}
                    </Badge>
                  ))}
                  {quiz.semesters.map((semester) => (
                    <Badge
                      key={semester.id}
                      variant="outline"
                      className="gap-1"
                    >
                      <span className="text-xs text-muted-foreground">
                        Semester:
                      </span>
                      {semester.name}
                    </Badge>
                  ))}
                  {quiz.labs.map((lab) => (
                    <Badge key={lab.id} variant="outline" className="gap-1">
                      <span className="text-xs text-muted-foreground">
                        Lab:
                      </span>
                      {lab.name}
                    </Badge>
                  ))}
                  {quiz.students.map((student) => (
                    <Badge key={student.id} variant="outline" className="gap-1">
                      <span className="text-xs text-muted-foreground">
                        Student:
                      </span>
                      {student.name}
                      {student.additionalInfo && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({student.additionalInfo})
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {canEdit && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/quiz/${quizId}/edit`)}
                  >
                    <Settings className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Settings</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/quiz/${quizId}/bank`)}
                  >
                    <Library className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">From Bank</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/quiz/${quizId}/create`)}
                  >
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Question</span>
                  </Button>
                </>
              )}
              {!canEdit && (
                <Badge variant="outline" className="gap-2">
                  <Eye className="h-3 w-3" />
                  View Only
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="container mx-auto px-6 py-8">
        {questionsLoading ? (
          <QuestionListSkeleton count={3} />
        ) : totalQuestions === 0 ? (
          <div className="text-center py-20">
            <Puzzle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No questions yet</h3>
            <p className="text-muted-foreground mb-6">
              {canEdit
                ? "Start building your quiz by adding questions"
                : "This quiz doesn't have any questions yet"}
            </p>
            {canEdit && (
              <div className="flex gap-3 justify-center">
                <Button onClick={() => router.push(`/quiz/${quizId}/create`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/quiz/${quizId}/bank`)}
                >
                  <Library className="h-4 w-4 mr-2" />
                  Add from Bank
                </Button>
              </div>
            )}
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
              const q = sortedQuestions[vi.index];
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
