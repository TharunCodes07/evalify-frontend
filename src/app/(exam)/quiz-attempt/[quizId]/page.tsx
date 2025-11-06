"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import studentQuizAPI from "@/repo/quiz-queries/student-quiz-queries";
import { QuizRenderer } from "@/components/questions/quiz-renderer/quiz-renderer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function QuizAttemptPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = params.quizId as string;
  const attemptId = searchParams.get("attemptId");

  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ["quiz-config", quizId],
    queryFn: () => studentQuizAPI.getQuizConfig(quizId),
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ["quiz-questions", quizId],
    queryFn: () => studentQuizAPI.getQuizQuestions(quizId),
  });

  const {
    data: attemptData,
    isLoading: attemptLoading,
    error: attemptError,
  } = useQuery({
    queryKey: ["quiz-attempt", attemptId],
    queryFn: () => studentQuizAPI.getAttempt(attemptId!),
    enabled: !!attemptId,
  });

  const isLoading = configLoading || questionsLoading || attemptLoading;

  if (isLoading) {
    return <QuizAttemptSkeleton />;
  }

  if (!attemptId) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            No attempt ID provided. Please start the quiz from the quizzes page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!config || !questions || !attemptData) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {attemptError
              ? `Failed to load quiz attempt: ${attemptError instanceof Error ? attemptError.message : "Unknown error"}`
              : "Failed to load quiz. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <QuizRenderer
      questions={questions}
      config={config}
      attemptData={attemptData}
    />
  );
}

function QuizAttemptSkeleton() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8" />
            ))}
          </div>
        </CardContent>
      </Card>

      {[...Array(3)].map((_, i) => (
        <Card key={i} className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
