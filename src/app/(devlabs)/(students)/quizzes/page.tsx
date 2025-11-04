"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import studentQuizAPI from "@/repo/quiz-queries/student-quiz-queries";
import type { LiveQuiz, CompletedQuiz, MissedQuiz } from "@/types/quiz";
import { LiveQuizCard } from "@/components/quiz/student/live-quiz-card";
import { CompletedQuizCard } from "@/components/quiz/student/completed-quiz-card";
import { MissedQuizCard } from "@/components/quiz/student/missed-quiz-card";
import { QuizListSkeleton } from "@/components/quiz/student/quiz-skeleton";
import { StartQuizModal } from "@/components/quiz/student/start-quiz-modal";
import { useRouter } from "next/navigation";
import { Play, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

export default function StudentQuizzesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"live" | "completed" | "missed">(
    "live",
  );
  const [selectedQuiz, setSelectedQuiz] = useState<LiveQuiz | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // React Query hooks - in the page component
  const liveQuizzes = useQuery({
    queryKey: ["student", "quizzes", "live"],
    queryFn: studentQuizAPI.getLiveQuizzes,
    enabled: activeTab === "live",
    refetchOnMount: true,
  });

  const completedQuizzes = useQuery({
    queryKey: ["student", "quizzes", "completed"],
    queryFn: studentQuizAPI.getCompletedQuizzes,
    enabled: activeTab === "completed",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const missedQuizzes = useQuery({
    queryKey: ["student", "quizzes", "missed"],
    queryFn: studentQuizAPI.getMissedQuizzes,
    enabled: activeTab === "missed",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get active query based on tab
  const activeQuery =
    activeTab === "live"
      ? liveQuizzes
      : activeTab === "completed"
        ? completedQuizzes
        : missedQuizzes;

  // Get active data
  const activeData = useMemo(() => {
    return (activeQuery.data || []) as (
      | LiveQuiz
      | CompletedQuiz
      | MissedQuiz
    )[];
  }, [activeQuery.data]);

  // Virtualization setup
  const virtualizer = useWindowVirtualizer({
    count: activeData.length,
    estimateSize: () => 300,
    overscan: 2,
    getItemKey: (i) => {
      const item = activeData[i];
      if (!item) return i;
      if ("attemptId" in item) return `${item.attemptId}`;
      return item.quizId;
    },
  });

  useEffect(() => {
    virtualizer.measure();
  }, [activeData.length, virtualizer]);

  const measureRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) virtualizer.measureElement(el);
    },
    [virtualizer],
  );

  // Handler functions
  const handleLiveQuizClick = (quiz: LiveQuiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleStartQuiz = async () => {
    if (!selectedQuiz) return;

    setIsStarting(true);
    try {
      // Navigate to quiz page
      router.push(`/quizzes/${selectedQuiz.quizId}`);
    } catch (error) {
      console.error("Failed to start quiz:", error);
      setIsStarting(false);
    }
  };

  const handleCompletedQuizClick = (quizId: string) => {
    router.push(`/quiz/${quizId}/completed`);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your live, completed, and missed quizzes
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "live" | "completed" | "missed")
        }
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live" className="gap-2">
            <Play className="h-4 w-4" />
            Live
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="missed" className="gap-2">
            <XCircle className="h-4 w-4" />
            Missed
          </TabsTrigger>
        </TabsList>

        {/* Loading State */}
        {activeQuery.isLoading && <QuizListSkeleton count={3} />}

        {/* Error State */}
        {activeQuery.isError && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to load quizzes. Please try again later.</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => activeQuery.refetch()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!activeQuery.isLoading &&
          !activeQuery.isError &&
          activeData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                {activeTab === "live" ? (
                  <Play className="h-12 w-12 text-muted-foreground" />
                ) : activeTab === "completed" ? (
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
                ) : (
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {activeTab === "live"
                  ? "No Live Quizzes"
                  : activeTab === "completed"
                    ? "No Completed Quizzes"
                    : "Great Job!"}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {activeTab === "live"
                  ? "You don't have any active quizzes at the moment. Check back later or contact your instructor."
                  : activeTab === "completed"
                    ? "You haven't completed any quizzes yet. Start taking quizzes from the Live tab!"
                    : "You haven't missed any quizzes. Keep up the good work!"}
              </p>
            </div>
          )}

        {/* Virtualized Content */}
        {!activeQuery.isLoading &&
          !activeQuery.isError &&
          activeData.length > 0 && (
            <TabsContent value={activeTab} className="mt-0">
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const item = activeData[virtualItem.index];
                  if (!item) return null;

                  return (
                    <div
                      key={virtualItem.key}
                      ref={measureRef}
                      data-index={virtualItem.index}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <div className="pb-4">
                        {activeTab === "live" && (
                          <LiveQuizCard
                            quiz={item as LiveQuiz}
                            onClick={() =>
                              handleLiveQuizClick(item as LiveQuiz)
                            }
                          />
                        )}
                        {activeTab === "completed" && (
                          <CompletedQuizCard
                            quiz={item as CompletedQuiz}
                            onClick={() =>
                              handleCompletedQuizClick(
                                (item as CompletedQuiz).quizId,
                              )
                            }
                          />
                        )}
                        {activeTab === "missed" && (
                          <MissedQuizCard quiz={item as MissedQuiz} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          )}
      </Tabs>

      {/* Start Quiz Modal */}
      <StartQuizModal
        quiz={selectedQuiz}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleStartQuiz}
        isStarting={isStarting}
      />

      {/* Refresh Button */}
      <div className="fixed bottom-8 right-8">
        <Button
          onClick={() => activeQuery.refetch()}
          size="lg"
          className="rounded-full shadow-lg"
          disabled={activeQuery.isRefetching}
        >
          <RefreshCw
            className={`h-4 w-4 ${activeQuery.isRefetching ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
    </div>
  );
}
