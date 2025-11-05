"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import studentQuizAPI, {
  StudentQuizConfig,
} from "@/repo/quiz-queries/student-quiz-queries";
import { QuestionRenderer } from "@/components/quiz/QuestionRenderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Clock, FileQuestion, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function QuizAttemptPage() {
  const params = useParams();
  const quizId = params.quizId as string;

  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ["quiz-config", quizId],
    queryFn: () => studentQuizAPI.getQuizConfig(quizId),
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ["quiz-questions", quizId],
    queryFn: () => studentQuizAPI.getQuizQuestions(quizId),
  });

  const isLoading = configLoading || questionsLoading;

  if (isLoading) {
    return <QuizAttemptSkeleton />;
  }

  if (!config || !questions) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load quiz. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">Quiz Attempt</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileQuestion className="h-4 w-4" />
                  <span>{questions.length} Questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{totalMarks} Total Marks</span>
                </div>
              </div>
            </div>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Submit Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <QuizConfigDisplay config={config} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <QuestionRenderer
            key={question.id}
            question={question}
            questionNumber={index + 1}
          />
        ))}
      </div>

      <Card className="mt-6 sticky bottom-4 border-2 shadow-lg">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Progress: {questions.length} questions
            </div>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Submit Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuizConfigDisplay({ config }: { config: StudentQuizConfig }) {
  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return "Not set";
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b">
        <div className="flex items-start gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Start Time</p>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(config.startTime)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">End Time</p>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(config.endTime)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Duration</p>
            <p className="text-sm text-muted-foreground">
              {config.durationMinutes} minutes
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {config.shuffleQuestions && (
          <Badge variant="outline" className="justify-center py-2">
            Questions Shuffled
          </Badge>
        )}
        {config.shuffleOptions && (
          <Badge variant="outline" className="justify-center py-2">
            Options Shuffled
          </Badge>
        )}
        {config.showQuestionsOneByOne && (
          <Badge variant="outline" className="justify-center py-2">
            One Question at a Time
          </Badge>
        )}
        {config.requireFullScreen && (
          <Badge variant="destructive" className="justify-center py-2">
            Full Screen Required
          </Badge>
        )}
        {config.preventQuestionCopy && (
          <Badge variant="secondary" className="justify-center py-2">
            Copy Disabled
          </Badge>
        )}
        {config.preventTabSwitch && (
          <Badge variant="destructive" className="justify-center py-2">
            Tab Switch: {config.tabSwitchLimit || 0} allowed
          </Badge>
        )}
        {config.calculatorAccess && (
          <Badge variant="outline" className="justify-center py-2">
            Calculator Available
          </Badge>
        )}
        {config.autoSubmit && (
          <Badge variant="destructive" className="justify-center py-2">
            Auto Submit Enabled
          </Badge>
        )}
      </div>
    </div>
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
