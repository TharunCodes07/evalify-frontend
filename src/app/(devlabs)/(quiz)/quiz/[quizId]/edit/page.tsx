"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createQuizSchema,
  CreateQuizSchema,
} from "@/components/quiz/create-quiz-schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { QuizMetadataForm } from "@/components/quiz/quiz-metadata-form";
import { QuizParticipantsForm } from "@/components/quiz/quiz-participants-form";
import { QuizSummary } from "@/components/quiz/quiz-summary";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import quizQueries from "@/repo/quiz-queries/quiz-queries";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { QuizDetailResponse, UpdateQuizRequest } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";

export default function EditQuizPage() {
  const user = useCurrentUser();
  const { success, error } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;
  const [activeTab, setActiveTab] = useState("metadata");

  const { data: quiz, isLoading: quizLoading } = useQuery<QuizDetailResponse>({
    queryKey: ["quiz", quizId],
    queryFn: () => quizQueries.getQuizById(quizId),
  });

  const form = useForm<CreateQuizSchema>({
    resolver: zodResolver(createQuizSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
      startTime: undefined,
      endTime: undefined,
      durationMinutes: 60,
      semesters: [],
      batches: [],
      courses: [],
      students: [],
      labs: [],
      config: {
        showQuestionsOneByOne: false,
        allowQuestionNavigation: true,
        maxAttempts: 1,
        canReattemptIfFailed: false,
        passingPercentage: undefined,
        shuffleQuestions: false,
        shuffleOptions: false,
        randomizeQuestions: false,
        negativeMarkingEnabled: false,
        negativeMarksValue: undefined,
        negativeMarkingQuestionTypes: undefined,
        requireFullScreen: false,
        preventQuestionCopy: true,
        preventTabSwitch: false,
        tabSwitchLimit: undefined,
        calculatorAccess: false,
        autoSubmit: false,
        passwordProtected: false,
        password: undefined,
      },
    },
  });

  // Populate form with quiz data
  useEffect(() => {
    if (quiz) {
      form.reset({
        title: quiz.title,
        description: quiz.description || "",
        startTime: quiz.startTime ? new Date(quiz.startTime) : undefined,
        endTime: quiz.endTime ? new Date(quiz.endTime) : undefined,
        durationMinutes: quiz.durationMinutes,
        semesters: quiz.semesters,
        batches: quiz.batches,
        courses: quiz.courses,
        students: quiz.students,
        labs: quiz.labs,
        config: {
          showQuestionsOneByOne:
            quiz.config.display?.showQuestionsOneByOne || false,
          allowQuestionNavigation:
            quiz.config.display?.allowQuestionNavigation ?? true,
          maxAttempts: quiz.config.attempts?.maxAttempts || 1,
          canReattemptIfFailed:
            quiz.config.attempts?.canReattemptIfFailed || false,
          passingPercentage: quiz.config.attempts?.passingPercentage,
          shuffleQuestions:
            quiz.config.randomization?.shuffleQuestions || false,
          shuffleOptions: quiz.config.randomization?.shuffleOptions || false,
          randomizeQuestions:
            quiz.config.randomization?.randomizeQuestions || false,
          negativeMarkingEnabled:
            quiz.config.scoring?.negativeMarkingEnabled || false,
          negativeMarksValue: quiz.config.scoring?.negativeMarksValue,
          negativeMarkingQuestionTypes:
            quiz.config.scoring?.negativeMarkingQuestionTypes,
          requireFullScreen:
            quiz.config.antiCheating?.requireFullScreen || false,
          preventQuestionCopy:
            quiz.config.antiCheating?.preventQuestionCopy ?? true,
          preventTabSwitch: quiz.config.antiCheating?.preventTabSwitch || false,
          tabSwitchLimit: quiz.config.antiCheating?.tabSwitchLimit,
          calculatorAccess: quiz.config.antiCheating?.calculatorAccess || false,
          autoSubmit: quiz.config.antiCheating?.autoSubmit || false,
          passwordProtected: quiz.config.security?.passwordProtected || false,
          password: quiz.config.security?.password,
        },
      });
    }
  }, [quiz, form]);

  const { mutate: updateQuiz, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateQuizRequest) =>
      quizQueries.updateQuiz(quizId, data),
    onSuccess: () => {
      success("Quiz updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      router.push(`/quiz/${quizId}`);
    },
    onError: (err) => {
      error(`Failed to update quiz: ${err.message}`);
    },
  });

  const { mutate: publishQuiz, isPending: isPublishPending } = useMutation({
    mutationFn: () => quizQueries.publishQuiz(quizId),
    onSuccess: () => {
      success("Quiz published successfully!");
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      router.push(`/quiz/${quizId}`);
    },
    onError: (err) => {
      error(`Failed to publish quiz: ${err.message}`);
    },
  });

  const isPending = isUpdatePending || isPublishPending;

  async function handleSaveChanges() {
    const data = form.getValues();

    if (!user) {
      error("You must be logged in to update a quiz.");
      return;
    }

    if (!data.title) {
      error("Quiz title is required.");
      return;
    }

    const requestData: UpdateQuizRequest = {
      title: data.title,
      description: data.description,
      startTime: data.startTime
        ? data.startTime.toISOString()
        : new Date().toISOString(),
      endTime: data.endTime
        ? data.endTime.toISOString()
        : new Date().toISOString(),
      durationMinutes: data.durationMinutes || 60,
      semesterIds: data.semesters?.map((s) => s.id) || [],
      batchIds: data.batches?.map((b) => b.id) || [],
      courseIds: data.courses?.map((c) => c.id) || [],
      studentIds: data.students?.map((s) => s.id) || [],
      labIds: data.labs?.map((l) => l.id) || [],
      config: {
        display: {
          showQuestionsOneByOne: data.config.showQuestionsOneByOne,
          allowQuestionNavigation: data.config.allowQuestionNavigation,
        },
        attempts: {
          maxAttempts: data.config.maxAttempts,
          canReattemptIfFailed: data.config.canReattemptIfFailed,
          passingPercentage: data.config.passingPercentage,
        },
        randomization: {
          shuffleQuestions: data.config.shuffleQuestions,
          shuffleOptions: data.config.shuffleOptions,
          randomizeQuestions: data.config.randomizeQuestions,
        },
        scoring: {
          negativeMarkingEnabled: data.config.negativeMarkingEnabled,
          negativeMarksValue: data.config.negativeMarksValue,
          negativeMarkingQuestionTypes:
            data.config.negativeMarkingQuestionTypes,
        },
        antiCheating: {
          requireFullScreen: data.config.requireFullScreen,
          preventQuestionCopy: data.config.preventQuestionCopy,
          preventTabSwitch: data.config.preventTabSwitch,
          tabSwitchLimit: data.config.tabSwitchLimit,
          calculatorAccess: data.config.calculatorAccess,
          autoSubmit: data.config.autoSubmit,
        },
        security: {
          passwordProtected: data.config.passwordProtected,
          password: data.config.password,
        },
      },
    };

    updateQuiz(requestData);
  }

  async function onSubmit(data: CreateQuizSchema) {
    if (!user) {
      error("You must be logged in to update a quiz.");
      return;
    }

    const requestData: UpdateQuizRequest = {
      title: data.title,
      description: data.description,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
      durationMinutes: data.durationMinutes,
      semesterIds: data.semesters.map((s) => s.id),
      batchIds: data.batches.map((b) => b.id),
      courseIds: data.courses.map((c) => c.id),
      studentIds: data.students.map((s) => s.id),
      labIds: data.labs.map((l) => l.id),
      config: {
        display: {
          showQuestionsOneByOne: data.config.showQuestionsOneByOne,
          allowQuestionNavigation: data.config.allowQuestionNavigation,
        },
        attempts: {
          maxAttempts: data.config.maxAttempts,
          canReattemptIfFailed: data.config.canReattemptIfFailed,
          passingPercentage: data.config.passingPercentage,
        },
        randomization: {
          shuffleQuestions: data.config.shuffleQuestions,
          shuffleOptions: data.config.shuffleOptions,
          randomizeQuestions: data.config.randomizeQuestions,
        },
        scoring: {
          negativeMarkingEnabled: data.config.negativeMarkingEnabled,
          negativeMarksValue: data.config.negativeMarksValue,
          negativeMarkingQuestionTypes:
            data.config.negativeMarkingQuestionTypes,
        },
        antiCheating: {
          requireFullScreen: data.config.requireFullScreen,
          preventQuestionCopy: data.config.preventQuestionCopy,
          preventTabSwitch: data.config.preventTabSwitch,
          tabSwitchLimit: data.config.tabSwitchLimit,
          calculatorAccess: data.config.calculatorAccess,
          autoSubmit: data.config.autoSubmit,
        },
        security: {
          passwordProtected: data.config.passwordProtected,
          password: data.config.password,
        },
      },
    };

    // First update, then publish
    updateQuiz(requestData, {
      onSuccess: () => {
        publishQuiz();
      },
    });
  }

  const isMetadataComplete =
    form.watch("title") &&
    form.watch("startTime") &&
    form.watch("endTime") &&
    form.watch("durationMinutes");

  const tabs = [
    {
      value: "metadata",
      label: "Metadata & Settings",
      component: <QuizMetadataForm />,
    },
    {
      value: "participants",
      label: "Participants",
      component: <QuizParticipantsForm />,
    },
    {
      value: "review",
      label: "Review & Save",
      component: <QuizSummary />,
    },
  ];

  const currentTabIndex = tabs.findIndex((tab) => tab.value === activeTab);

  const handleNext = async () => {
    // Validate current tab before moving forward
    if (activeTab === "metadata") {
      const isValid = await form.trigger([
        "title",
        "startTime",
        "endTime",
        "durationMinutes",
      ]);
      if (!isValid) {
        error("Please fill in all required metadata fields correctly.");
        return;
      }
    } else if (activeTab === "participants") {
      const isValid = await form.trigger([
        "semesters",
        "batches",
        "courses",
        "students",
      ]);
      if (!isValid) {
        error("Please select at least one participant group.");
        return;
      }
    }

    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].value);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].value);
    }
  };

  const handlePublishQuiz = () => {
    // Only allow publishing from the review tab
    if (activeTab !== "review") {
      error("Please complete all steps before publishing the quiz.");
      return;
    }
    // Manually trigger form validation and submission
    form.handleSubmit(onSubmit)();
  };

  if (quizLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz not found</h2>
          <p className="text-muted-foreground mb-4">
            The quiz you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/quiz")}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background"
      onKeyDown={(e) => {
        // Prevent Enter key from triggering any form submission
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Quiz</h1>
            <p className="text-muted-foreground mt-1">
              Update quiz settings and configuration
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }}
            onKeyDown={(e) => {
              // Prevent Enter key from triggering form submission
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  {tab.component}
                </TabsContent>
              ))}
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/quiz/${quizId}`)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                {currentTabIndex > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isPending}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveChanges}
                  disabled={isPending || !form.watch("title")}
                >
                  {isUpdatePending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>

                {currentTabIndex < tabs.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isPending}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <>
                    {!quiz.isPublished && (
                      <Button
                        type="button"
                        onClick={handlePublishQuiz}
                        disabled={isPending || !isMetadataComplete}
                        size="lg"
                      >
                        {isPublishPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          "Update & Publish Quiz"
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
