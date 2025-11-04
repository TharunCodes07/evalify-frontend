import axiosInstance from "@/lib/axios/axios-client";
import type {
  LiveQuiz,
  CompletedQuiz,
  MissedQuiz,
  ValidateQuizPasswordResponse,
} from "@/types/quiz";

// Re-export types for backwards compatibility
export type {
  LiveQuiz,
  CompletedQuiz,
  MissedQuiz,
  ValidateQuizPasswordResponse,
} from "@/types/quiz";

// API calls
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
};

export default studentQuizAPI;
