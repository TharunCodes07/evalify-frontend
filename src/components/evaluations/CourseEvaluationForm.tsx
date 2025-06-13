"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseEvaluationData, IndividualScoreSubmission } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { individualScoreQueries } from "@/repo/individual-score-queries/individual-score-queries";

interface CourseEvaluationFormProps {
  evaluationData: CourseEvaluationData;
  projectId: string;
  reviewId: string;
}

type FormValues = {
  scores: {
    participantId: string;
    criterionScores: {
      criterionId: string;
      score: number;
      comment: string;
    }[];
  }[];
};

export function CourseEvaluationForm({
  evaluationData,
  projectId,
  reviewId,
}: CourseEvaluationFormProps) {
  const user = useCurrentUser();
  const { success, error, info } = useToast();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      scores: evaluationData.teamMembers.map((member) => {
        const existingMemberScores = evaluationData.existingScores?.find(
          (s) => s.participantId === member.id
        );
        return {
          participantId: member.id,
          criterionScores: evaluationData.criteria.map((criterion) => {
            const existingCriterionScore =
              existingMemberScores?.criterionScores.find(
                (cs) => cs.criterionId === criterion.id
              );
            return {
              criterionId: criterion.id,
              score: existingCriterionScore?.score ?? 0,
              comment: existingCriterionScore?.comment ?? "",
            };
          }),
        };
      }),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "scores",
  });

  const mutation = useMutation({
    mutationFn: (submission: IndividualScoreSubmission) =>
      individualScoreQueries.submitCourseScores(submission),
    onSuccess: () => {
      success("Evaluation submitted successfully!");
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
    onError: (err) => {
      error(`Failed to submit: ${err.message}`);
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!user) {
      error("You must be logged in to submit an evaluation.");
      return;
    }

    const submission: IndividualScoreSubmission = {
      userId: user.id,
      reviewId,
      projectId,
      courseId: evaluationData.courseId,
      scores: data.scores,
    };
    mutation.mutate(submission);
  };

  if (evaluationData.isPublished) {
    info("This evaluation is published and cannot be edited.");
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Evaluation Form</CardTitle>
          <CardDescription>Course: {evaluationData.courseName}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={evaluationData.teamMembers[0]?.id}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              {evaluationData.teamMembers.map((member) => (
                <TabsTrigger key={member.id} value={member.id}>
                  {member.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {fields.map((field, memberIndex) => (
              <TabsContent key={field.id} value={field.participantId}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Evaluating: {evaluationData.teamMembers[memberIndex].name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {evaluationData.criteria.map(
                      (criterion, criterionIndex) => {
                        const scoreValue = watch(
                          `scores.${memberIndex}.criterionScores.${criterionIndex}.score`
                        );
                        return (
                          <div key={criterion.id} className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="font-semibold">
                                {criterion.name}
                              </Label>
                              <span className="text-sm font-bold">
                                Score: {scoreValue} / {criterion.maxScore}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {criterion.description}
                            </p>
                            <Controller
                              control={control}
                              name={`scores.${memberIndex}.criterionScores.${criterionIndex}.score`}
                              render={({ field }) => (
                                <Slider
                                  disabled={evaluationData.isPublished}
                                  min={0}
                                  max={criterion.maxScore}
                                  step={0.5}
                                  value={[field.value]}
                                  onValueChange={(value) =>
                                    field.onChange(value[0])
                                  }
                                />
                              )}
                            />
                            <Controller
                              control={control}
                              name={`scores.${memberIndex}.criterionScores.${criterionIndex}.comment`}
                              render={({ field }) => (
                                <Textarea
                                  {...field}
                                  disabled={evaluationData.isPublished}
                                  placeholder={`Comment for ${criterion.name}...`}
                                />
                              )}
                            />
                          </div>
                        );
                      }
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting || evaluationData.isPublished || !isDirty}
          >
            {isSubmitting ? "Submitting..." : "Submit Evaluation"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
