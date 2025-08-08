"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { individualScoreQueries } from "@/repo/individual-score-queries/individual-score-queries";
import { CourseEvaluationData, IndividualScoreSubmission } from "@/types/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  AlertCircle,
  Save,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Target,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface CourseEvaluationFormProps {
  evaluationData: CourseEvaluationData;
  reviewData?: any;
  projectId: string;
  reviewId: string;
}

interface FormData {
  [participantId: string]: {
    [criterionId: string]: {
      score: number;
      comment: string;
    };
  };
}

interface CommonCriteriaData {
  [criterionId: string]: {
    score: number;
    comment: string;
  };
}

export function CourseEvaluationForm({
  evaluationData,
  reviewData,
  projectId,
  reviewId,
}: CourseEvaluationFormProps) {
  const user = useCurrentUser();
  const queryClient = useQueryClient();

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
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(
    new Set([evaluationData.criteria[0]?.id])
  );

  const submitMutation = useMutation({
    mutationFn: (submission: IndividualScoreSubmission) =>
      individualScoreQueries.submitCourseScores(submission),
    onSuccess: () => {
      toast.success("Evaluation submitted successfully");
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
      toast.error("Failed to submit evaluation. Please try again.");
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

  const toggleCriterion = (criterionId: string) => {
    setExpandedCriteria((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(criterionId)) {
        newSet.delete(criterionId);
      } else {
        newSet.add(criterionId);
      }
      return newSet;
    });
  };

  const getScoreIndicator = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    const checkpoints = [];
    const numCheckpoints = Math.min(maxScore, 10); // Max 10 checkpoints for readability

    for (let i = 1; i <= numCheckpoints; i++) {
      const checkpointValue = (i / numCheckpoints) * maxScore;
      const isActive = score >= checkpointValue;
      const isCurrent =
        score > 0 && Math.ceil(score) === Math.ceil(checkpointValue);

      checkpoints.push({
        value: i,
        isActive,
        isCurrent,
        position: (i / numCheckpoints) * 100,
      });
    }

    return { percentage, checkpoints };
  };

  const ScoreIndicator = ({
    score,
    maxScore,
  }: {
    score: number;
    maxScore: number;
  }) => {
    const { percentage, checkpoints } = getScoreIndicator(score, maxScore);

    return (
      <div className="relative">
        {/* Base track */}
        <div className="w-full h-2 bg-muted rounded-full relative overflow-hidden">
          {/* Progress fill */}
          <div
            className="h-full bg-slate-700 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        {/* Checkpoints */}
        <div className="relative mt-3">
          <div className="flex justify-between text-xs">
            {checkpoints.map((checkpoint, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center"
                style={{ marginLeft: index === 0 ? "0" : "-6px" }}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full border transition-all duration-200 ${
                    checkpoint.isActive
                      ? "bg-slate-700 border-slate-700 shadow-sm"
                      : "bg-background border-muted-foreground/40"
                  } ${
                    checkpoint.isCurrent
                      ? "ring-2 ring-slate-700/30 scale-110"
                      : ""
                  }`}
                />
                <span
                  className={`mt-1.5 text-xs ${
                    checkpoint.isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {checkpoint.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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

  const totalFields = evaluationData.criteria.reduce((acc, criterion) => {
    return (
      acc +
      (isCriterionCommon(criterion.id) ? 1 : evaluationData.teamMembers.length)
    );
  }, 0);

  const completedFields = evaluationData.criteria.reduce((acc, criterion) => {
    if (isCriterionCommon(criterion.id)) {
      const commonScore = commonCriteriaData[criterion.id]?.score || 0;
      return acc + (commonScore > 0 ? 1 : 0);
    } else {
      return (
        acc +
        evaluationData.teamMembers.filter(
          (member) => formData[member.id][criterion.id].score > 0
        ).length
      );
    }
  }, 0);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-xl font-bold">{evaluationData.courseName}</h1>
          {evaluationData.isPublished && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This evaluation has been published. Changes may not be reflected
                in final results.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
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
              <div className="text-2xl font-bold text-foreground">
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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Evaluation Criteria</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setExpandedCriteria(
                  new Set(evaluationData.criteria.map((c) => c.id))
                )
              }
            >
              Expand All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedCriteria(new Set())}
            >
              Collapse All
            </Button>
          </div>
        </div>
        {evaluationData.criteria.map((criterion) => {
          const isExpanded = expandedCriteria.has(criterion.id);
          const progress = getCriterionProgress(criterion.id);

          return (
            <Card key={criterion.id}>
              <CardHeader className="pb-3">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCriterion(criterion.id)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        {criterion.name}
                      </CardTitle>
                      {criterion.description && (
                        <CardDescription className="mt-1">
                          {criterion.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {criterion.courseSpecific && (
                      <Badge variant="outline" className="text-xs">
                        Course Specific
                      </Badge>
                    )}
                    {isCriterionCommon(criterion.id) && (
                      <Badge variant="secondary" className="text-xs">
                        Common Score
                      </Badge>
                    )}
                    <Badge variant="secondary">Max: {criterion.maxScore}</Badge>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardHeader>

              <Collapsible open={isExpanded}>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    {isCriterionCommon(criterion.id) ? (
                      <div className="border rounded-lg p-4 space-y-4 bg-card border-blue-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h4 className="font-medium text-blue-700">
                              Team Score (Common)
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              This score will be applied to all team members
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Label className="text-sm">Score:</Label>
                            <Input
                              type="number"
                              min="0"
                              max={criterion.maxScore}
                              value={
                                commonCriteriaData[criterion.id]?.score || ""
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value === "" ||
                                  (/^\d+$/.test(value) &&
                                    parseInt(value) <= criterion.maxScore)
                                ) {
                                  updateCommonCriteriaScore(
                                    criterion.id,
                                    "score",
                                    value === "" ? 0 : parseInt(value)
                                  );
                                }
                              }}
                              onWheel={(e) => e.currentTarget.blur()}
                              onFocus={(e) => e.target.select()}
                              className="w-20 text-center"
                              placeholder="0"
                            />
                            <span className="text-sm text-muted-foreground">
                              / {criterion.maxScore}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Score Progress</span>
                            <span className="font-medium">
                              {commonCriteriaData[criterion.id]?.score || 0} /{" "}
                              {criterion.maxScore}
                            </span>
                          </div>
                          <ScoreIndicator
                            score={commonCriteriaData[criterion.id]?.score || 0}
                            maxScore={criterion.maxScore}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">Comments (optional)</Label>
                          <Textarea
                            value={
                              commonCriteriaData[criterion.id]?.comment || ""
                            }
                            onChange={(e) =>
                              updateCommonCriteriaScore(
                                criterion.id,
                                "comment",
                                e.target.value
                              )
                            }
                            placeholder="Add your comments here..."
                            className="min-h-[80px] resize-none"
                          />
                        </div>
                      </div>
                    ) : (
                      // Individual criteria - separate input for each team member
                      evaluationData.teamMembers.map((member) => {
                        const currentScore =
                          formData[member.id][criterion.id].score;
                        const currentComment =
                          formData[member.id][criterion.id].comment;

                        return (
                          <div
                            key={member.id}
                            className="border rounded-lg p-4 space-y-4 bg-card"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div>
                                <h4 className="font-medium">{member.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {member.email}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Label className="text-sm">Score:</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max={criterion.maxScore}
                                  value={currentScore || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (
                                      value === "" ||
                                      (/^\d+$/.test(value) &&
                                        parseInt(value) <= criterion.maxScore)
                                    ) {
                                      updateScore(
                                        member.id,
                                        criterion.id,
                                        "score",
                                        value === "" ? 0 : parseInt(value)
                                      );
                                    }
                                  }}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  onFocus={(e) => e.target.select()}
                                  className="w-20 text-center"
                                  placeholder="0"
                                />
                                <span className="text-sm text-muted-foreground">
                                  / {criterion.maxScore}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Score Progress</span>
                                <span className="font-medium">
                                  {currentScore} / {criterion.maxScore}
                                </span>
                              </div>
                              <ScoreIndicator
                                score={currentScore}
                                maxScore={criterion.maxScore}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm">
                                Comments (optional)
                              </Label>
                              <Textarea
                                value={currentComment}
                                onChange={(e) =>
                                  updateScore(
                                    member.id,
                                    criterion.id,
                                    "comment",
                                    e.target.value
                                  )
                                }
                                placeholder="Add your comments here..."
                                className="min-h-[80px] resize-none"
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {completedFields < totalFields && (
                <p className="text-xs text-muted-foreground mt-1">
                  You can submit with incomplete scores and edit later
                </p>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              size="lg"
              className="w-full sm:w-auto"
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
        </CardContent>
      </Card>
    </div>
  );
}
