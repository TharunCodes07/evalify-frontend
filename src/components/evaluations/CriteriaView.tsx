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
import { ChevronDown, ChevronRight } from "lucide-react";
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

interface CriteriaViewProps {
  evaluationData: CourseEvaluationData;
  formData: FormData;
  commonCriteriaData: CommonCriteriaData;
  isCriterionCommon: (criterionId: string) => boolean;
  updateScore: (
    participantId: string,
    criterionId: string,
    field: "score" | "comment",
    value: number | string
  ) => void;
  updateCommonCriteriaScore: (
    criterionId: string,
    field: "score" | "comment",
    value: number | string
  ) => void;
  getCriterionProgress: (criterionId: string) => number;
}

export function CriteriaView({
  evaluationData,
  formData,
  commonCriteriaData,
  isCriterionCommon,
  updateScore,
  updateCommonCriteriaScore,
  getCriterionProgress,
}: CriteriaViewProps) {
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(
    new Set(
      evaluationData.criteria.length > 0 ? [evaluationData.criteria[0].id] : []
    )
  );

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

  return (
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
                    <CardTitle className="text-lg">{criterion.name}</CardTitle>
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
                    <div className="border rounded-lg p-4 space-y-4 bg-card">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            Team Score (Common)
                            <Badge variant="secondary" className="text-xs">
                              Common
                            </Badge>
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            This score will be applied to all team members
                          </p>
                        </div>
                      </div>

                      <ScoreSlider
                        score={commonCriteriaData[criterion.id]?.score || 0}
                        maxScore={criterion.maxScore}
                        onChange={(value) =>
                          updateCommonCriteriaScore(
                            criterion.id,
                            "score",
                            value
                          )
                        }
                      />

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
                    evaluationData.teamMembers.map((member) => {
                      const currentScore =
                        formData[member.id]?.[criterion.id]?.score ?? 0;
                      const currentComment =
                        formData[member.id]?.[criterion.id]?.comment ?? "";
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
                          </div>

                          <ScoreSlider
                            score={currentScore}
                            maxScore={criterion.maxScore}
                            onChange={(value) =>
                              updateScore(
                                member.id,
                                criterion.id,
                                "score",
                                value
                              )
                            }
                          />

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
  );
}
