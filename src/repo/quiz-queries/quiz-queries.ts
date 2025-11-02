import axiosInstance from "@/lib/axios/axios-client";
import {
  CreateQuizRequest,
  Quiz,
  QuizDetailResponse,
  UpdateQuizRequest,
} from "@/types/quiz";

const quizQueries = {
  // Create quiz as draft
  createDraft: async (data: CreateQuizRequest): Promise<Quiz> => {
    const response = await axiosInstance.post("/api/quiz/draft", data);
    return response.data;
  },

  // Create and publish quiz immediately
  createAndPublish: async (data: CreateQuizRequest): Promise<Quiz> => {
    const response = await axiosInstance.post("/api/quiz", data);
    return response.data;
  },

  // Publish a draft quiz
  publishQuiz: async (quizId: string): Promise<Quiz> => {
    const response = await axiosInstance.put(`/api/quiz/${quizId}/publish`);
    return response.data;
  },

  // Update quiz
  updateQuiz: async (
    quizId: string,
    data: UpdateQuizRequest,
  ): Promise<Quiz> => {
    const response = await axiosInstance.put(`/api/quiz/${quizId}`, data);
    return response.data;
  },

  // Get quiz by ID (with full details)
  getQuizById: async (quizId: string): Promise<QuizDetailResponse> => {
    const response = await axiosInstance.get(`/api/quiz/${quizId}`);
    return response.data;
  },

  // Get all quizzes (role-based)
  getAllQuizzes: async (): Promise<Quiz[]> => {
    const response = await axiosInstance.get("/api/quiz");
    return response.data;
  },

  // Get published quizzes
  getPublishedQuizzes: async (): Promise<Quiz[]> => {
    const response = await axiosInstance.get("/api/quiz/published");
    return response.data;
  },

  // Delete quiz
  deleteQuiz: async (quizId: string): Promise<void> => {
    await axiosInstance.delete(`/api/quiz/${quizId}`);
  },
};

export default quizQueries;
