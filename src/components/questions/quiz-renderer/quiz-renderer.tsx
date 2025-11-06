"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { StudentQuestion } from "@/types/student-questions";
import {
  AnswerData,
  StudentQuizConfig,
  StartAttemptResponse,
} from "@/types/quiz";
import studentQuizAPI from "@/repo/quiz-queries/student-quiz-queries";
import { SubmitConfirmDialog } from "./submit-confirm-dialog";
import { QuizHeader } from "./quiz-header";
import { QuestionPalette } from "./question-palette";
import { QuestionCard } from "./question-card";
import { QuestionActions } from "./question-actions";
import {
  shuffleArray,
  calculateTimeRemaining,
  createViolationHandlers,
  injectAntiCopyStyles,
  removeAntiCopyStyles,
} from "./quiz-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { Maximize } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionType } from "@/types/questions";

interface QuizRendererProps {
  questions: StudentQuestion[];
  config: StudentQuizConfig;
  attemptData: StartAttemptResponse;
}

export function QuizRenderer({
  questions,
  config,
  attemptData,
}: QuizRendererProps) {
  const router = useRouter();
  const { error: showError, success: showSuccess } = useToast();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const shuffledQuestions = React.useMemo(() => {
    if (config.shuffleQuestions) {
      return shuffleArray(questions, attemptData.attemptId);
    }
    return questions;
  }, [questions, config.shuffleQuestions, attemptData.attemptId]);

  const processedQuestions = React.useMemo(() => {
    if (!config.shuffleOptions) return shuffledQuestions;

    return shuffledQuestions.map((question) => {
      if (
        question.questionType === QuestionType.MCQ ||
        question.questionType === QuestionType.MMCQ
      ) {
        return {
          ...question,
          options: shuffleArray(
            question.options,
            `${attemptData.attemptId}-${question.id}`,
          ),
        };
      }

      if (question.questionType === QuestionType.MATCH_THE_FOLLOWING) {
        const leftPairs = question.options.filter(
          (opt) => opt.isCorrect === true,
        );
        const rightPairs = question.options.filter(
          (opt) => opt.isCorrect === false,
        );

        return {
          ...question,
          options: [
            ...shuffleArray(
              leftPairs,
              `${attemptData.attemptId}-${question.id}-left`,
            ),
            ...shuffleArray(
              rightPairs,
              `${attemptData.attemptId}-${question.id}-right`,
            ),
          ],
        };
      }

      return question;
    });
  }, [shuffledQuestions, config.shuffleOptions, attemptData.attemptId]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerData>>(
    attemptData.answers || {},
  );
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [violations, setViolations] = useState(attemptData.violationCount || 0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentQuestion = processedQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id];

  const submitMutation = useMutation({
    mutationFn: () => studentQuizAPI.submitQuiz(attemptData.attemptId),
    onSuccess: () => {
      showSuccess("Your quiz has been submitted successfully");
      router.push(`/quiz-result/${attemptData.attemptId}`);
    },
    onError: () => {
      showError("Failed to submit quiz. Please try again.");
    },
  });

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(attemptData.mustSubmitBy));
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(attemptData.mustSubmitBy);
      setTimeRemaining(remaining);
      if (remaining <= 0 && config.autoSubmit) {
        submitMutation.mutate();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [attemptData.mustSubmitBy, config.autoSubmit, submitMutation]);

  useEffect(() => {
    if (config.requireFullScreen) {
      const handleFullScreenChange = () => {
        const isCurrentlyFullScreen = !!document.fullscreenElement;
        setIsFullScreen(isCurrentlyFullScreen);

        if (!isCurrentlyFullScreen) {
          const newViolations = violations + 1;
          setViolations(newViolations);
          studentQuizAPI.updateViolationCount(attemptData.attemptId, {
            violationCount: newViolations,
          });
          showError(`Full Screen Exit: Violation ${newViolations}`);
        }
      };

      document.addEventListener("fullscreenchange", handleFullScreenChange);
      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullScreenChange,
        );
      };
    }
  }, [config.requireFullScreen, violations, showError, attemptData.attemptId]);

  useEffect(() => {
    if (config.preventTabSwitch) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          const newViolations = violations + 1;
          setViolations(newViolations);
          studentQuizAPI.updateViolationCount(attemptData.attemptId, {
            violationCount: newViolations,
          });
          showError(
            `Tab Switch Detected: Violation ${newViolations} of ${config.tabSwitchLimit || 0}`,
          );
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }
  }, [
    config.preventTabSwitch,
    violations,
    config.tabSwitchLimit,
    showError,
    attemptData.attemptId,
  ]);

  useEffect(() => {
    if (config.preventQuestionCopy) {
      const incrementViolation = (action: string) => {
        const newViolations = violations + 1;
        setViolations(newViolations);
        studentQuizAPI.updateViolationCount(attemptData.attemptId, {
          violationCount: newViolations,
        });
        showError(`${action} Detected: Violation ${newViolations}`);
      };

      const handlers = createViolationHandlers(incrementViolation);

      document.addEventListener("copy", handlers.handleCopy);
      document.addEventListener("cut", handlers.handleCut);
      document.addEventListener("keydown", handlers.handleKeyDown);
      document.addEventListener("selectstart", handlers.handleSelectStart);

      injectAntiCopyStyles();

      return () => {
        document.removeEventListener("copy", handlers.handleCopy);
        document.removeEventListener("cut", handlers.handleCut);
        document.removeEventListener("keydown", handlers.handleKeyDown);
        document.removeEventListener("selectstart", handlers.handleSelectStart);
        removeAntiCopyStyles();
      };
    }
  }, [
    config.preventQuestionCopy,
    violations,
    showError,
    attemptData.attemptId,
  ]);

  const saveAnswerMutation = useMutation({
    mutationFn: (data: {
      questionId: string;
      questionType: string;
      answerData: Partial<AnswerData>;
      markedForLater: boolean;
    }) =>
      studentQuizAPI.saveAnswer({
        attemptId: attemptData.attemptId,
        questionId: data.questionId,
        questionType: data.questionType,
        answerData: data.answerData,
        markedForLater: data.markedForLater,
      }),
  });

  const handleSubmitConfirmed = useCallback(() => {
    submitMutation.mutate();
  }, [submitMutation]);

  const debouncedAnswer = useDebounce(currentAnswer, 1000);
  const lastSavedAnswerRef = React.useRef<Record<string, string>>({});

  useEffect(() => {
    if (!debouncedAnswer || !currentQuestion) return;

    const shouldDebounce = [
      QuestionType.DESCRIPTIVE,
      QuestionType.CODING,
      QuestionType.FILL_IN_BLANKS,
    ].includes(currentQuestion.questionType as QuestionType);

    if (!shouldDebounce) return;

    const answerKey = JSON.stringify({
      qId: currentQuestion.id,
      text: debouncedAnswer.answerText || "",
      blanks: debouncedAnswer.blankValues || {},
    });

    if (lastSavedAnswerRef.current[currentQuestion.id] !== answerKey) {
      lastSavedAnswerRef.current[currentQuestion.id] = answerKey;

      saveAnswerMutation.mutate({
        questionId: currentQuestion.id,
        questionType: currentQuestion.questionType,
        answerData: debouncedAnswer,
        markedForLater: debouncedAnswer.markedForLater || false,
      });
    }
  }, [
    debouncedAnswer,
    currentQuestion?.id,
    currentQuestion?.questionType,
    saveAnswerMutation,
  ]);

  const handleAnswerChange = useCallback(
    (questionId: string, answerUpdate: Partial<AnswerData>) => {
      const updatedAnswer: AnswerData = {
        ...answers[questionId],
        ...answerUpdate,
        questionType: currentQuestion.questionType,
        answeredAt: Date.now(),
        markedForLater: answers[questionId]?.markedForLater || false,
      };

      setAnswers((prev) => ({
        ...prev,
        [questionId]: updatedAnswer,
      }));

      const shouldSaveImmediately = ![
        QuestionType.DESCRIPTIVE,
        QuestionType.CODING,
        QuestionType.FILL_IN_BLANKS,
      ].includes(currentQuestion.questionType as QuestionType);

      if (shouldSaveImmediately) {
        saveAnswerMutation.mutate({
          questionId,
          questionType: currentQuestion.questionType,
          answerData: answerUpdate,
          markedForLater: updatedAnswer.markedForLater,
        });
      }
    },
    [answers, currentQuestion, saveAnswerMutation],
  );

  const handleMarkForReview = () => {
    const updatedAnswer: AnswerData = {
      ...currentAnswer,
      markedForLater: !currentAnswer?.markedForLater,
      questionType: currentQuestion.questionType,
      answeredAt: Date.now(),
    };

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: updatedAnswer,
    }));

    saveAnswerMutation.mutate({
      questionId: currentQuestion.id,
      questionType: currentQuestion.questionType,
      answerData: currentAnswer || {},
      markedForLater: !currentAnswer?.markedForLater,
    });
  };

  const handleClearSelection = () => {
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestion.id];
      return updated;
    });

    saveAnswerMutation.mutate({
      questionId: currentQuestion.id,
      questionType: currentQuestion.questionType,
      answerData: {},
      markedForLater: false,
    });
  };

  const handleNavigate = (index: number) => {
    if (!config.showQuestionsOneByOne || config.allowQuestionNavigation) {
      setCurrentQuestionIndex(index);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < processedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    setShowSubmitDialog(true);
  };

  const handleEnterFullScreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } catch {
      showError("Unable to enter full screen mode");
    }
  };

  const getQuestionStatus = (questionId: string) => {
    const answer = answers[questionId];
    if (!answer) return "unanswered";
    if (answer.markedForLater) return "marked";
    const hasAnswer =
      answer.answerText ||
      (answer.selectedOptionIds && answer.selectedOptionIds.length > 0) ||
      (answer.blankValues && Object.keys(answer.blankValues).length > 0) ||
      (answer.matchPairs && Object.keys(answer.matchPairs).length > 0) ||
      (answer.fileUrls && answer.fileUrls.length > 0);
    return hasAnswer ? "answered" : "unanswered";
  };

  const answeredCount = processedQuestions.filter(
    (q) => getQuestionStatus(q.id) === "answered",
  ).length;
  const markedCount = processedQuestions.filter(
    (q) => getQuestionStatus(q.id) === "marked",
  ).length;

  if (config.requireFullScreen && !isFullScreen) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Card className="w-96">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Maximize className="h-5 w-5" />
              Full Screen Required
            </div>
            <p className="text-sm text-muted-foreground">
              This quiz requires full screen mode. Click the button below to
              enter full screen.
            </p>
            <Button onClick={handleEnterFullScreen} className="w-full">
              Enter Full Screen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900",
          config.preventQuestionCopy && "quiz-content",
        )}
      >
        <QuizHeader
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={processedQuestions.length}
          answeredCount={answeredCount}
          markedCount={markedCount}
          violations={violations}
          tabSwitchLimit={config.tabSwitchLimit}
          timeRemaining={timeRemaining}
          autoSubmit={config.autoSubmit}
          mounted={mounted}
          resolvedTheme={resolvedTheme}
          onThemeToggle={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          showViolations={
            !!(
              config.preventTabSwitch ||
              config.requireFullScreen ||
              config.preventQuestionCopy
            )
          }
        />

        <div className="container mx-auto px-4 sm:px-6 py-4 min-h-[calc(100vh-120px)]">
          {/* Main content area with responsive layout */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-full">
            {/* Question content - responsive width */}
            <div className="flex flex-col lg:w-[75%] xl:w-[80%] space-y-4 lg:space-y-6 min-h-[calc(100vh-120px)]">
              <div className="flex-1">
                <QuestionCard
                  question={currentQuestion}
                  answer={currentAnswer}
                  onAnswerChange={(update) =>
                    handleAnswerChange(currentQuestion.id, update)
                  }
                />
              </div>

              <div className="shrink-0">
                <QuestionActions
                  currentAnswer={currentAnswer}
                  isFirstQuestion={currentQuestionIndex === 0}
                  isLastQuestion={
                    currentQuestionIndex === processedQuestions.length - 1
                  }
                  canNavigate={
                    !config.showQuestionsOneByOne ||
                    config.allowQuestionNavigation
                  }
                  onClear={handleClearSelection}
                  onMarkForReview={handleMarkForReview}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>

            {/* Question palette - responsive width */}
            <div className="w-full lg:w-[25%] xl:w-[20%] shrink-0 order-first lg:order-last">
              <QuestionPalette
                questions={processedQuestions}
                currentQuestionIndex={currentQuestionIndex}
                getQuestionStatus={getQuestionStatus}
                onNavigate={handleNavigate}
                isNavigationDisabled={
                  config.showQuestionsOneByOne &&
                  !config.allowQuestionNavigation
                }
              />
            </div>
          </div>
        </div>
      </div>

      <SubmitConfirmDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        onConfirm={handleSubmitConfirmed}
        answeredCount={answeredCount}
        totalQuestions={processedQuestions.length}
        markedCount={markedCount}
      />
    </>
  );
}
