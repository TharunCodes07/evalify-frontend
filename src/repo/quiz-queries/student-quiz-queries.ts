import axiosInstance from "@/lib/axios/axios-client";
import type { StudentQuestion } from "@/types/student-questions";
import type {
  LiveQuiz,
  CompletedQuiz,
  MissedQuiz,
  ValidateQuizPasswordResponse,
  StudentQuizConfig,
} from "@/types/quiz";

export type {
  LiveQuiz,
  CompletedQuiz,
  MissedQuiz,
  ValidateQuizPasswordResponse,
  StudentQuizConfig,
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
};

export default studentQuizAPI;
