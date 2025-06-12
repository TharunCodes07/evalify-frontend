"use client";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  EvaluationCriteria,
  ProjectWithTeam,
  EvaluationSubmission,
} from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { evaluationQueries } from "@/repo/evaluation-queries";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface EvaluationFormProps {
  evaluationCriteria: EvaluationCriteria;
  project: ProjectWithTeam;
}

type FormValues = {
  overallComment: string;
  criteria: {
    criterionId: string;
    isCommon: boolean;
    commonScore?: number;
    commonComment?: string;
    memberScores?: {
      memberId: string;
      score: number;
      comment?: string;
    }[];
  }[];
};

export function EvaluationForm({
  evaluationCriteria,
  project,
}: EvaluationFormProps) {
  const user = useCurrentUser();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const storageKey = `evaluation-draft-${user?.id}-${project.id}-${evaluationCriteria.reviewId}`;

  const [draft, setDraft] = useLocalStorage<FormValues | null>(
    storageKey,
    null
  );

  const [selectedCriterionIndex, setSelectedCriterionIndex] = useState(-1); // -1 for overall comments

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: draft || {
      overallComment: "",
      criteria: evaluationCriteria.criteria.map((c) => ({
        criterionId: c.id,
        isCommon: c.isCommon,
        commonScore: 0,
        commonComment: "",
        memberScores: c.isCommon
          ? []
          : project.teamMembers.map((member) => ({
              memberId: member.id,
              score: 0,
              comment: "",
            })),
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "criteria",
  });

  const watchedFields = watch();
  const debouncedDraft = useDebounce(watchedFields, 500);

  useEffect(() => {
    if (debouncedDraft) {
      setDraft(debouncedDraft);
    }
  }, [debouncedDraft, setDraft]);

  const _mutation = useMutation({
    mutationFn: (evaluation: EvaluationSubmission) => {
      if (!user) throw new Error("User not found");
      return evaluationQueries.submitEvaluation({
        evaluation,
        userId: user.id,
      });
    },
    onSuccess: () => {
      success("Evaluation submitted successfully.");
      setDraft(null); // Clear draft from local storage
      reset(); // Reset form state
      queryClient.invalidateQueries({
        queryKey: ["projectReviews", project.id],
      });
      // TODO: Redirect user
    },
    onError: (err) => {
      error(`Failed to submit evaluation: ${err.message}`);
    },
  });

  const onSubmit = (data: FormValues) => {
    const evaluationData: EvaluationSubmission = {
      reviewId: evaluationCriteria.reviewId,
      projectId: project.id,
      comments: data.overallComment,
      criterionScores: data.criteria
        .filter((c) => c.isCommon)
        .map((c) => ({
          criterionId: c.criterionId,
          score: c.commonScore || 0,
          comment: c.commonComment,
        })),
    };

    console.log("Submitting data:", evaluationData);
    // info("Submission logic is not fully implemented. Check console for data.");
    _mutation.mutate(evaluationData);
  };

  const handleSaveDraft = () => {
    setDraft(watch());
    success("Your progress has been saved as a draft.");
  };

  const selectedCriterion =
    selectedCriterionIndex >= 0
      ? evaluationCriteria.criteria[selectedCriterionIndex]
      : null;
  const selectedField =
    selectedCriterionIndex >= 0 ? fields[selectedCriterionIndex] : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex gap-8 items-start">
        <aside className="w-1/4 space-y-2 sticky top-20">
          <h2 className="text-lg font-semibold mb-3">Criteria</h2>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setSelectedCriterionIndex(-1)}
            className={cn(
              "w-full justify-start text-left",
              selectedCriterionIndex === -1 &&
                "bg-accent text-accent-foreground"
            )}
          >
            Overall Comments
          </Button>
          {evaluationCriteria.criteria.map((criterion, index) => (
            <Button
              key={criterion.id}
              type="button"
              variant="ghost"
              onClick={() => setSelectedCriterionIndex(index)}
              className={cn(
                "w-full justify-start text-left h-auto whitespace-normal",
                selectedCriterionIndex === index &&
                  "bg-accent text-accent-foreground"
              )}
            >
              {criterion.name}
            </Button>
          ))}
        </aside>

        <main className="w-3/4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCriterion
                  ? selectedCriterion.name
                  : "Overall Comments"}
              </CardTitle>
              {selectedCriterion && (
                <>
                  <p className="text-sm text-gray-500">
                    {selectedCriterion.description}
                  </p>
                  <p className="text-sm font-bold">
                    Max Score: {selectedCriterion.maxScore}
                  </p>
                </>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedCriterionIndex === -1 && (
                <div>
                  <Label htmlFor="overallComment">
                    Provide overall feedback for the project
                  </Label>
                  <Textarea
                    id="overallComment"
                    {...register("overallComment")}
                    placeholder="Add any overall comments for the project..."
                    rows={8}
                  />
                </div>
              )}

              {selectedField && selectedCriterion && (
                <>
                  {selectedField.isCommon ? (
                    <div className="space-y-4">
                      <div>
                        <Label>
                          Score (
                          {watch(
                            `criteria.${selectedCriterionIndex}.commonScore`
                          )}
                          )
                        </Label>
                        <Controller
                          name={`criteria.${selectedCriterionIndex}.commonScore`}
                          control={control}
                          render={({ field }) => (
                            <Slider
                              min={0}
                              max={selectedCriterion.maxScore}
                              step={0.5}
                              onValueChange={(value) =>
                                field.onChange(value[0])
                              }
                              defaultValue={[field.value ?? 0]}
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Label>Comment</Label>
                        <Textarea
                          {...register(
                            `criteria.${selectedCriterionIndex}.commonComment`
                          )}
                          placeholder="Comment on this criterion..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {project.teamMembers.map((member, memberIndex) => (
                        <div
                          key={member.id}
                          className="space-y-4 p-4 border rounded-lg"
                        >
                          <h4 className="font-semibold">{member.name}</h4>
                          <div>
                            <Label>
                              Score (
                              {watch(
                                `criteria.${selectedCriterionIndex}.memberScores.${memberIndex}.score`
                              )}
                              )
                            </Label>
                            <Controller
                              name={`criteria.${selectedCriterionIndex}.memberScores.${memberIndex}.score`}
                              control={control}
                              render={({ field }) => (
                                <Slider
                                  min={0}
                                  max={selectedCriterion.maxScore}
                                  step={0.5}
                                  onValueChange={(value) =>
                                    field.onChange(value[0])
                                  }
                                  defaultValue={[field.value ?? 0]}
                                />
                              )}
                            />
                          </div>
                          <div>
                            <Label>Comment</Label>
                            <Textarea
                              {...register(
                                `criteria.${selectedCriterionIndex}.memberScores.${memberIndex}.comment`
                              )}
                              placeholder={`Comment for ${member.name}...`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button
          variant="outline"
          type="button"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          Save Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Evaluation"}
        </Button>
      </div>
    </form>
  );
}
