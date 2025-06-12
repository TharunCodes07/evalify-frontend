import axiosInstance from "@/lib/axios/axios-client";
import {
  EvaluationCriteria,
  EvaluationSubmission,
  SubmittedEvaluation,
  ProjectReviewsResponse,
} from "@/types/types";

const fetchReviewsForProject = async (
  projectId: string
): Promise<ProjectReviewsResponse> => {
  // This endpoint is assumed as it is not in the documentation.
  const response = await axiosInstance.get(`/projects/${projectId}/reviews`);
  return response.data;
};

const fetchEvaluationCriteria = async (
  reviewId: string
): Promise<EvaluationCriteria> => {
  const response = await axiosInstance.get(
    `/api/evaluations/review/${reviewId}/criteria`
  );
  return response.data;
};

const submitEvaluation = async ({
  evaluation,
  userId,
}: {
  evaluation: EvaluationSubmission;
  userId: string;
}): Promise<SubmittedEvaluation> => {
  const response = await axiosInstance.post(
    `/api/evaluations/submit?userId=${userId}`,
    evaluation
  );
  return response.data;
};

export const evaluationQueries = {
  fetchReviewsForProject,
  fetchEvaluationCriteria,
  submitEvaluation,
};
