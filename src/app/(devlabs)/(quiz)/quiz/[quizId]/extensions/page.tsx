"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AttemptSummary, ExtensionRequest } from "@/types/quiz";
import studentQuizAPI from "@/repo/quiz-queries/student-quiz-queries";
import { useToast } from "@/hooks/use-toast";
import { ExtensionsTable } from "@/components/quiz/extensions/extensions-table";
import { Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExtensionsPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const queryClient = useQueryClient();
  const { toast, success } = useToast();

  const {
    data: attempts = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery<AttemptSummary[]>({
    queryKey: ["quiz-attempts", quizId],
    queryFn: () => studentQuizAPI.getActiveAttempts(quizId),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0, // Consider data immediately stale
    gcTime: 0, // Don't cache in garbage collection
  });

  const extensionMutation = useMutation({
    mutationFn: ({
      attemptId,
      request,
    }: {
      attemptId: string;
      request: ExtensionRequest;
    }) => studentQuizAPI.grantExtension(attemptId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-attempts", quizId] });
      refetch(); // Force immediate refetch
      success("Extension granted successfully");
    },
    onError: () => {
      toast("Failed to grant extension");
    },
  });

  const handleGrantExtension = (
    attemptId: string,
    request: ExtensionRequest,
  ) => {
    extensionMutation.mutate({ attemptId, request });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Grant Extensions</h1>
              </div>
              <p className="text-muted-foreground mt-1">
                Manage time extensions for active quiz attempts
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <ExtensionsTable
          attempts={attempts}
          isLoading={isLoading}
          onGrantExtension={handleGrantExtension}
          isGrantingExtension={extensionMutation.isPending}
        />
      </div>
    </div>
  );
}
