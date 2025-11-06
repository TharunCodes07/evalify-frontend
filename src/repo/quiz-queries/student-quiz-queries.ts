import axiosInstance from "@/lib/axios/axios-client";
import type { StudentQuestion } from "@/types/student-questions";
import type {
  LiveQuiz,
  CompletedQuiz,
  MissedQuiz,
  ValidateQuizPasswordResponse,
  StudentQuizConfig,
  StartAttemptRequest,
  StartAttemptResponse,
  SaveAnswerRequest,
  SaveAnswerResponse,
  AttemptResponse,
  SubmitResponse,
  SubmissionResultResponse,
  ExtensionRequest,
  ExtensionResponse,
  AttemptSummary,
  UpdateViolationRequest,
  UpdateViolationResponse,
} from "@/types/quiz";

export type {
  LiveQuiz,
  CompletedQuiz,
  MissedQuiz,
  ValidateQuizPasswordResponse,
  StudentQuizConfig,
  StartAttemptRequest,
  StartAttemptResponse,
  SaveAnswerRequest,
  SaveAnswerResponse,
  AttemptResponse,
  SubmitResponse,
  SubmissionResultResponse,
  ExtensionRequest,
  ExtensionResponse,
  AttemptSummary,
  UpdateViolationRequest,
  UpdateViolationResponse,
} from "@/types/quiz";
export type { StudentQuestion } from "@/types/student-questions";

const studentQuizAPI = {
  getLiveQuizzes: async (): Promise<LiveQuiz[]> => {
    const response = await axiosInstance.get("/api/student/quizzes/live");
    return response.data;
  },

  getCompletedQuizzes: async (): Promise<CompletedQuiz[]> => {
    const response = await axiosInstance.get("/api/student/quizzes/completed");
    return response.data;
  },

  getMissedQuizzes: async (): Promise<MissedQuiz[]> => {
    const response = await axiosInstance.get("/api/student/quizzes/missed");
    return response.data;
  },

  validateQuizPassword: async (
    quizId: string,
    password: string,
  ): Promise<ValidateQuizPasswordResponse> => {
    const response = await axiosInstance.post(
      `/api/student/quizzes/${quizId}/validate-password`,
      { password },
    );
    return response.data;
  },

  getQuizConfig: async (quizId: string): Promise<StudentQuizConfig> => {
    const response = await axiosInstance.get(
      `/api/student/quizzes/${quizId}/config`,
    );
    return response.data;
  },

  getQuizQuestions: async (quizId: string): Promise<StudentQuestion[]> => {
    const response = await axiosInstance.get(
      `/api/student/quizzes/${quizId}/questions`,
    );
    return response.data;
  },

  // Redis-first Quiz Attempt API
  startQuizAttempt: async (
    quizId: string,
    request: StartAttemptRequest = {},
  ): Promise<StartAttemptResponse> => {
    const response = await axiosInstance.post(
      `/api/student/quiz/${quizId}/start`,
      request,
    );
    return response.data;
  },

  saveAnswer: async (
    request: SaveAnswerRequest,
  ): Promise<SaveAnswerResponse> => {
    const response = await axiosInstance.post(
      `/api/student/quiz/answer`,
      request,
    );
    return response.data;
  },

  getAttempt: async (attemptId: string): Promise<AttemptResponse> => {
    const response = await axiosInstance.get(
      `/api/student/quiz/attempt/${attemptId}`,
    );
    return response.data;
  },

  submitQuiz: async (attemptId: string): Promise<SubmitResponse> => {
    const response = await axiosInstance.post(`/api/student/quiz/submit`, {
      attemptId,
    });
    return response.data;
  },

  getSubmissionResult: async (
    attemptId: string,
  ): Promise<SubmissionResultResponse> => {
    const response = await axiosInstance.get(
      `/api/student/quiz/result/${attemptId}`,
    );
    return response.data;
  },

  // Update violation count for an attempt
  updateViolationCount: async (
    attemptId: string,
    request: UpdateViolationRequest,
  ): Promise<UpdateViolationResponse> => {
    const response = await axiosInstance.put(
      `/api/student/quiz/attempt/${attemptId}/violations`,
      request,
    );
    return response.data;
  },

  // Faculty endpoints for managing quiz attempts
  getActiveAttempts: async (quizId: string): Promise<AttemptSummary[]> => {
    const response = await axiosInstance.get(
      `/api/faculty/quiz/${quizId}/attempts`,
    );
    return response.data;
  },

  grantExtension: async (
    attemptId: string,
    request: ExtensionRequest,
  ): Promise<ExtensionResponse> => {
    const response = await axiosInstance.post(
      `/api/faculty/quiz/attempt/${attemptId}/extend`,
      request,
    );
    return response.data;
  },
};

export default studentQuizAPI;
