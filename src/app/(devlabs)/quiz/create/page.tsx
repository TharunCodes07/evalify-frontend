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
import { useState } from "react";
import { QuizMetadataForm } from "@/components/quiz/quiz-metadata-form";
import { QuizParticipantsForm } from "@/components/quiz/quiz-participants-form";
import { QuizSettingsForm } from "@/components/quiz/quiz-settings-form";
import { QuizSummary } from "@/components/quiz/quiz-summary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import quizQueries from "@/repo/quiz-queries/quiz-queries";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CreateQuizRequest } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function CreateQuizPage() {
  const user = useCurrentUser();
  const { success, error } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("metadata");

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

  const { mutate: createDraft, isPending: isDraftPending } = useMutation({
    mutationFn: (data: CreateQuizRequest) => quizQueries.createDraft(data),
    onSuccess: () => {
      success("Quiz draft saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      router.push("/quiz");
    },
    onError: (err) => {
      error(`Failed to save draft: ${err.message}`);
    },
  });

  const { mutate: createAndPublish, isPending: isPublishPending } = useMutation(
    {
      mutationFn: (data: CreateQuizRequest) =>
        quizQueries.createAndPublish(data),
      onSuccess: () => {
        success("Quiz created and published successfully!");
        queryClient.invalidateQueries({ queryKey: ["quizzes"] });
        router.push("/quiz");
      },
      onError: (err) => {
        error(`Failed to create quiz: ${err.message}`);
      },
    },
  );

  const isPending = isDraftPending || isPublishPending;

  async function handleSaveDraft() {
    const data = form.getValues();

    if (!user) {
      error("You must be logged in to create a quiz.");
      return;
    }

    if (!data.title) {
      error("Quiz title is required to save a draft.");
      return;
    }

    const requestData: CreateQuizRequest = {
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
      createdById: user.id,
    };

    createDraft(requestData);
  }

  async function onSubmit(data: CreateQuizSchema) {
    if (!user) {
      error("You must be logged in to create a quiz.");
      return;
    }

    const requestData: CreateQuizRequest = {
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
      createdById: user.id,
    };
    createAndPublish(requestData);
  }

  const isMetadataComplete =
    form.watch("title") &&
    form.watch("startTime") &&
    form.watch("endTime") &&
    form.watch("durationMinutes");

  const tabs = [
    { value: "metadata", label: "Metadata", component: <QuizMetadataForm /> },
    {
      value: "participants",
      label: "Participants",
      component: <QuizParticipantsForm />,
    },
    { value: "settings", label: "Settings", component: <QuizSettingsForm /> },
    { value: "review", label: "Review & Create", component: <QuizSummary /> },
  ];

  const currentTabIndex = tabs.findIndex((tab) => tab.value === activeTab);

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].value);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].value);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Quiz</h1>
            <p className="text-muted-foreground mt-1">
              Set up a new quiz for your students
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-8">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{tab.label}</CardTitle>
                      <CardDescription>
                        {tab.value === "metadata" &&
                          "Enter basic quiz information"}
                        {tab.value === "participants" &&
                          "Select who can take this quiz"}
                        {tab.value === "settings" &&
                          "Configure quiz behavior and rules"}
                        {tab.value === "review" &&
                          "Review all details before creating"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>{tab.component}</CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/quiz")}
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
                  onClick={handleSaveDraft}
                  disabled={isPending || !form.watch("title")}
                >
                  {isDraftPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
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
                  <Button
                    type="submit"
                    disabled={isPending || !isMetadataComplete}
                    size="lg"
                  >
                    {isPublishPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      "Create & Publish Quiz"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
