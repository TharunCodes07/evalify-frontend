"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { individualScoreQueries } from "@/repo/individual-score-queries/individual-score-queries";
import { CourseEvaluationData, IndividualScoreSubmission } from "@/types/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { AlertCircle, Save, BarChart3, Target } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CriteriaView } from "./CriteriaView";
import { StudentView } from "./StudentView";
import { ViewToggle, useViewMode } from "./ViewToggle";

type FormData = {
  [participantId: string]: {
    [criterionId: string]: {
      score: number;
      comment: string;
    };
  };
};

type CommonCriteriaData = {
  [criterionId: string]: {
    score: number;
    comment: string;
  };
};

interface CourseEvaluationFormProps {
  evaluationData: CourseEvaluationData;
  reviewData?: any;
  projectId: string;
  reviewId: string;
}

export function CourseEvaluationForm({
  evaluationData,
  reviewData,
  projectId,
  reviewId,
}: CourseEvaluationFormProps) {
  const user = useCurrentUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useViewMode();

  const isCriterionCommon = (criterionId: string): boolean => {
    if (!reviewData?.rubricsInfo?.criteria) return false;
    const rubricCriterion = reviewData.rubricsInfo.criteria.find(
      (c: any) => c.id === criterionId
    );
    return rubricCriterion?.isCommon === true;
  };

  const initializeFormData = (): FormData => {
    const data: FormData = {};

    evaluationData.teamMembers.forEach((member) => {
      data[member.id] = {};
      evaluationData.criteria.forEach((criterion) => {
        const existingScore = evaluationData.existingScores
          ?.find((score) => score.participantId === member.id)
          ?.criterionScores.find((cs) => cs.criterionId === criterion.id);

        data[member.id][criterion.id] = {
          score: existingScore?.score ?? 0,
          comment: existingScore?.comment ?? "",
        };
      });
    });

    return data;
  };

  const initializeCommonCriteriaData = (): CommonCriteriaData => {
    const data: CommonCriteriaData = {};

    evaluationData.criteria.forEach((criterion) => {
      if (isCriterionCommon(criterion.id)) {
        const existingScore =
          evaluationData.existingScores?.[0]?.criterionScores.find(
            (cs) => cs.criterionId === criterion.id
          );

        data[criterion.id] = {
          score: existingScore?.score ?? 0,
          comment: existingScore?.comment ?? "",
        };
      }
    });

    return data;
  };

  const [formData, setFormData] = useState<FormData>(initializeFormData);
  const [commonCriteriaData, setCommonCriteriaData] =
    useState<CommonCriteriaData>(initializeCommonCriteriaData);

  const submitMutation = useMutation({
    mutationFn: (submission: IndividualScoreSubmission) =>
      individualScoreQueries.submitCourseScores(submission),
    onSuccess: () => {
      toast("Evaluation submitted successfully");
      queryClient.invalidateQueries({
        queryKey: [
          "courseEvaluationData",
          reviewId,
          projectId,
          evaluationData.courseId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["evaluationSummary", reviewId, projectId],
      });
    },
    onError: (error) => {
      toast("Failed to submit evaluation. Please try again.");
    },
  });

  const updateScore = (
    participantId: string,
    criterionId: string,
    field: "score" | "comment",
    value: number | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        [criterionId]: {
          ...prev[participantId][criterionId],
          [field]: value,
        },
      },
    }));
  };

  const updateCommonCriteriaScore = (
    criterionId: string,
    field: "score" | "comment",
    value: number | string
  ) => {
    setCommonCriteriaData((prev) => ({
      ...prev,
      [criterionId]: {
        ...prev[criterionId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    const scores = evaluationData.teamMembers.map((member) => ({
      participantId: member.id,
      criterionScores: evaluationData.criteria.map((criterion) => ({
        criterionId: criterion.id,
        score: isCriterionCommon(criterion.id)
          ? commonCriteriaData[criterion.id]?.score || 0
          : formData[member.id][criterion.id].score,
        comment: isCriterionCommon(criterion.id)
          ? commonCriteriaData[criterion.id]?.comment || undefined
          : formData[member.id][criterion.id].comment || undefined,
      })),
    }));

    const submission: IndividualScoreSubmission = {
      userId: user.id,
      reviewId,
      projectId,
      courseId: evaluationData.courseId,
      scores,
    };

    submitMutation.mutate(submission);
  };

  const getCriterionProgress = (criterionId: string) => {
    if (isCriterionCommon(criterionId)) {
      const commonScore = commonCriteriaData[criterionId]?.score || 0;
      return commonScore > 0 ? 100 : 0;
    }

    const completedCount = evaluationData.teamMembers.filter(
      (member) => formData[member.id][criterionId].score > 0
    ).length;
    return (completedCount / evaluationData.teamMembers.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{evaluationData.courseName}</h1>
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </div>

        {evaluationData.isPublished && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This evaluation has been published. Changes may not be reflected
              in final results.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-xl font-semibold text-foreground">
                {evaluationData.teamMembers.length > 0
                  ? Math.round(
                      evaluationData.teamMembers.reduce(
                        (totalSum, member) =>
                          totalSum +
                          evaluationData.criteria.reduce(
                            (criteriaSum, criterion) =>
                              criteriaSum +
                              (isCriterionCommon(criterion.id)
                                ? commonCriteriaData[criterion.id]?.score || 0
                                : formData[member.id][criterion.id].score || 0),
                            0
                          ),
                        0
                      ) / evaluationData.teamMembers.length
                    )
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">Team Average</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-xl font-semibold text-foreground">
                {evaluationData.criteria.reduce(
                  (sum, criterion) => sum + criterion.maxScore,
                  0
                )}
              </div>
              <div className="text-sm text-muted-foreground">Maximum Score</div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "criteria" ? (
        <CriteriaView
          evaluationData={evaluationData}
          formData={formData}
          commonCriteriaData={commonCriteriaData}
          isCriterionCommon={isCriterionCommon}
          updateScore={updateScore}
          updateCommonCriteriaScore={updateCommonCriteriaScore}
          getCriterionProgress={getCriterionProgress}
        />
      ) : (
        <StudentView
          evaluationData={evaluationData}
          formData={formData}
          commonCriteriaData={commonCriteriaData}
          isCriterionCommon={isCriterionCommon}
          updateScore={updateScore}
          updateCommonCriteriaScore={updateCommonCriteriaScore}
        />
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
          size="lg"
        >
          {submitMutation.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Evaluation
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
