"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { evaluationQueries } from "@/repo/evaluation-queries";
import { EvaluationCriteria, ProjectWithTeam } from "@/types/types";
import { projectQueries } from "@/repo/project-queries/project-queries";
import { EvaluationForm } from "@/components/evaluations/EvaluationForm";

export default function EvaluationPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const reviewId = params.reviewId as string;

  const {
    data: evaluationCriteria,
    isLoading: isLoadingCriteria,
    error: errorCriteria,
  } = useQuery<EvaluationCriteria>({
    queryKey: ["evaluationCriteria", reviewId],
    queryFn: () => evaluationQueries.fetchEvaluationCriteria(reviewId),
    enabled: !!reviewId,
  });

  const {
    data: project,
    isLoading: isLoadingProject,
    error: errorProject,
  } = useQuery<ProjectWithTeam>({
    queryKey: ["project", projectId],
    queryFn: () => projectQueries.fetchProjectByProjectId(projectId),
    enabled: !!projectId,
  });

  const isLoading = isLoadingCriteria || isLoadingProject;
  const error = errorCriteria || errorProject;

  if (isLoading)
    return (
      <div className="container mx-auto p-4 text-center">
        Loading evaluation form...
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        Error loading evaluation data.
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {evaluationCriteria?.reviewName}
        </h1>
        <p className="text-lg text-muted-foreground">
          Evaluating project:{" "}
          <span className="font-semibold">{project?.title}</span>
        </p>
      </div>

      {evaluationCriteria && project && (
        <EvaluationForm
          evaluationCriteria={evaluationCriteria}
          project={project}
        />
      )}
    </div>
  );
}
