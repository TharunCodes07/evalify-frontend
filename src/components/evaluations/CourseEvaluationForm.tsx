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
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Target,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface CourseEvaluationFormProps {
  evaluationData: CourseEvaluationData;
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

export function CourseEvaluationForm({
  evaluationData,
  projectId,
  reviewId,
}: CourseEvaluationFormProps) {
  const user = useCurrentUser();
  const queryClient = useQueryClient();

  // Initialize form data with existing scores
  const initializeFormData = (): FormData => {
    const data: FormData = {};

    evaluationData.teamMembers.forEach((member) => {
      data[member.id] = {};
      evaluationData.criteria.forEach((criterion) => {
        // Find existing score for this participant and criterion
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

  const [formData, setFormData] = useState<FormData>(initializeFormData);
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
      console.error("Error submitting evaluation:", error);
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

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    if (percentage >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  const handleSubmit = async () => {
    if (!user) return;

    const scores = evaluationData.teamMembers.map((member) => ({
      participantId: member.id,
      criterionScores: evaluationData.criteria.map((criterion) => ({
        criterionId: criterion.id,
        score: formData[member.id][criterion.id].score,
        comment: formData[member.id][criterion.id].comment || undefined,
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

  // Calculate progress per criterion
  const getCriterionProgress = (criterionId: string) => {
    const completedCount = evaluationData.teamMembers.filter(
      (member) => formData[member.id][criterionId].score > 0
    ).length;
    return (completedCount / evaluationData.teamMembers.length) * 100;
  };

  // Calculate overall progress
  const totalFields =
    evaluationData.teamMembers.length * evaluationData.criteria.length;
  const completedFields = evaluationData.teamMembers.reduce(
    (acc, member) =>
      acc +
      evaluationData.criteria.filter(
        (criterion) => formData[member.id][criterion.id].score > 0
      ).length,
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">
                {evaluationData.courseName}
              </CardTitle>
              <CardDescription>
                Team members: {evaluationData.teamMembers.length} • Criteria:
                {evaluationData.criteria.length}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">
                {completedFields}/{totalFields} completed
              </Badge>
              {evaluationData.isPublished && (
                <Badge variant="secondary">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Published
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        {evaluationData.isPublished && (
          <CardContent className="pt-0">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This evaluation has been published. Changes may not be reflected
                in final results.
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      {/* Team Statistics */}
      <div className="flex flex-col sm:flex-row gap-25 py-4">
        {/* Team Average */}
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
                            (formData[member.id][criterion.id].score || 0),
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

        {/* Maximum Score */}
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

      {/* Criteria-based Evaluation */}
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
                    {evaluationData.teamMembers.map((member) => {
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

                          {/* Color-coded Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Score Progress</span>
                              <span className="font-medium">
                                {currentScore} / {criterion.maxScore}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ease-out ${getScoreColor(
                                  currentScore,
                                  criterion.maxScore
                                )}`}
                                style={{
                                  width: `${Math.min(
                                    (currentScore / criterion.maxScore) * 100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Poor</span>
                              <span>Average</span>
                              <span>Good</span>
                              <span>Excellent</span>
                            </div>
                          </div>

                          {/* Comment */}
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
                    })}
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
              <p className="text-sm text-muted-foreground">
                Progress: {completedFields} of {totalFields} scores completed
              </p>
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
