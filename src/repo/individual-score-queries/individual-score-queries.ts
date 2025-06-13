import axiosInstance from "@/lib/axios/axios-client";
import {
  CourseEvaluationData,
  CourseEvaluationSummary,
  IndividualScoreSubmission,
} from "@/types/types";

// Note: The userId should be passed from the frontend,
// ideally from a session or auth context.

const fetchEvaluationSummary = async (
  reviewId: string,
  projectId: string,
  userId: string
): Promise<CourseEvaluationSummary> => {
  const response = await axiosInstance.post(
    `/api/individualScore/review/${reviewId}/project/${projectId}/summary`,
    { userId }
  );
  return response.data;
};

const fetchCourseEvaluationData = async (
  reviewId: string,
  projectId: string,
  courseId: string,
  userId: string
): Promise<CourseEvaluationData> => {
  const response = await axiosInstance.post(
    `/api/individualScore/review/${reviewId}/project/${projectId}/course/${courseId}/data`,
    { userId }
  );
  return response.data;
};

const submitCourseScores = async (
  submission: IndividualScoreSubmission
): Promise<any> => {
  const response = await axiosInstance.post(
    "/api/individualScore/course",
    submission
  );
  return response.data;
};

export const individualScoreQueries = {
  fetchEvaluationSummary,
  fetchCourseEvaluationData,
  submitCourseScores,
};
