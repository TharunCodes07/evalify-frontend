"use client";

import { useState } from "react";
import { CourseEvaluationData } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { ScoreSlider } from "./ScoreSlider";

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

interface StudentViewProps {
  evaluationData: CourseEvaluationData;
  formData: FormData;
  commonCriteriaData: CommonCriteriaData;
  isCriterionCommon: (criterionId: string) => boolean;
  updateScore: (
    participantId: string,
    criterionId: string,
    field: "score" | "comment",
    value: number | string,
  ) => void;
  updateCommonCriteriaScore: (
    criterionId: string,
    field: "score" | "comment",
    value: number | string,
  ) => void;
}

export function StudentView({
  evaluationData,
  formData,
  commonCriteriaData,
  isCriterionCommon,
  updateScore,
  updateCommonCriteriaScore,
}: StudentViewProps) {
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(
    new Set<string>(
      evaluationData.teamMembers[0]?.id
        ? [evaluationData.teamMembers[0].id]
        : [],
    ),
  );

  const toggleStudent = (studentId: string) => {
    setExpandedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const getStudentProgress = (studentId: string) => {
    const totalCriteria = evaluationData.criteria.length;
    const completedCriteria = evaluationData.criteria.filter((criterion) => {
      if (isCriterionCommon(criterion.id)) {
        return (commonCriteriaData[criterion.id]?.score || 0) > 0;
      }
      return (formData[studentId][criterion.id].score || 0) > 0;
    }).length;

    return totalCriteria > 0 ? (completedCriteria / totalCriteria) * 100 : 0;
  };

  const getStudentTotalScore = (studentId: string) => {
    return evaluationData.criteria.reduce((total, criterion) => {
      if (isCriterionCommon(criterion.id)) {
        return total + (commonCriteriaData[criterion.id]?.score ?? 0);
      }
      return total + (formData[studentId]?.[criterion.id]?.score ?? 0);
    }, 0);
  };
  const getTotalMaxScore = () => {
    return evaluationData.criteria.reduce(
      (total, criterion) => total + criterion.maxScore,
      0,
    );
  };

  // Check if there are any common criteria to show them separately
  const commonCriteria = evaluationData.criteria.filter((c) =>
    isCriterionCommon(c.id),
  );
  const individualCriteria = evaluationData.criteria.filter(
    (c) => !isCriterionCommon(c.id),
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Student Evaluations</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setExpandedStudents(
                new Set(evaluationData.teamMembers.map((m) => m.id)),
              )
            }
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedStudents(new Set())}
          >
            Collapse All
          </Button>
        </div>
      </div>

      {/* Common Criteria Section */}
      {commonCriteria.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-lg">Common Criteria</CardTitle>
                <CardDescription>
                  These scores apply to all team members
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {commonCriteria.map((criterion) => (
              <div
                key={criterion.id}
                className="border rounded-lg p-4 space-y-4 bg-card"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {criterion.name}
                      <Badge variant="secondary" className="text-xs">
                        Common
                      </Badge>
                    </h4>
                    {criterion.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {criterion.description}
                      </p>
                    )}
                  </div>
                </div>

                <ScoreSlider
                  score={commonCriteriaData[criterion.id]?.score || 0}
                  maxScore={criterion.maxScore}
                  onChange={(value) =>
                    updateCommonCriteriaScore(criterion.id, "score", value)
                  }
                />

                <div className="space-y-2">
                  <Label className="text-sm">Comments (optional)</Label>
                  <Textarea
                    value={commonCriteriaData[criterion.id]?.comment || ""}
                    onChange={(e) =>
                      updateCommonCriteriaScore(
                        criterion.id,
                        "comment",
                        e.target.value,
                      )
                    }
                    placeholder="Add your comments here..."
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Individual Students */}
      {evaluationData.teamMembers.map((student) => {
        const isExpanded = expandedStudents.has(student.id);
        const progress = getStudentProgress(student.id);
        const totalScore = getStudentTotalScore(student.id);
        const maxScore = getTotalMaxScore();

        return (
          <Card key={student.id}>
            <CardHeader className="pb-3">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleStudent(student.id)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>{student.email}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {totalScore} / {maxScore}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Score
                    </div>
                  </div>
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
                <CardContent className="space-y-4">
                  {individualCriteria.map((criterion) => {
                    const currentScore =
                      formData[student.id]?.[criterion.id]?.score ?? 0;
                    const currentComment =
                      formData[student.id]?.[criterion.id]?.comment ?? "";

                    return (
                      <div
                        key={criterion.id}
                        className="border rounded-lg p-4 space-y-4 bg-card"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h4 className="font-medium">{criterion.name}</h4>
                            {criterion.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {criterion.description}
                              </p>
                            )}
                            <div className="flex gap-2 mt-2">
                              {criterion.courseSpecific && (
                                <Badge variant="outline" className="text-xs">
                                  Course Specific
                                </Badge>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                Max: {criterion.maxScore}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <ScoreSlider
                          score={currentScore}
                          maxScore={criterion.maxScore}
                          onChange={(value) =>
                            updateScore(
                              student.id,
                              criterion.id,
                              "score",
                              value,
                            )
                          }
                        />

                        <div className="space-y-2">
                          <Label className="text-sm">Comments (optional)</Label>
                          <Textarea
                            value={currentComment}
                            onChange={(e) =>
                              updateScore(
                                student.id,
                                criterion.id,
                                "comment",
                                e.target.value,
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
  );
}
