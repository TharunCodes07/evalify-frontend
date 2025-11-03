import axiosInstance from "@/lib/axios/axios-client";
import {
  CreateQuizRequest,
  Quiz,
  QuizDetailResponse,
  UpdateQuizRequest,
  QuizShare,
  ShareQuizRequest,
  BulkAddQuestionsRequest,
} from "@/types/quiz";
import { BankSummary } from "@/types/bank";
import { Question } from "@/types/questions";

const quizQueries = {
  // Get quiz by ID
  getQuizById: async (quizId: string): Promise<QuizDetailResponse> => {
    const response = await axiosInstance.get(`/api/quiz/${quizId}`);
    return response.data;
  },

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

  // Delete quiz
  deleteQuiz: async (quizId: string): Promise<void> => {
    await axiosInstance.delete(`/api/quiz/${quizId}`);
  },

  // Share quiz with users
  shareQuiz: async (quizId: string, data: ShareQuizRequest): Promise<void> => {
    await axiosInstance.post(`/api/quiz/${quizId}/share`, data);
  },

  // Remove share from user
  removeShare: async (quizId: string, userId: string): Promise<void> => {
    await axiosInstance.delete(`/api/quiz/${quizId}/share/${userId}`);
  },

  // Update share permission
  updateSharePermission: async (
    quizId: string,
    userId: string,
    permission: "VIEW" | "EDIT",
  ): Promise<void> => {
    await axiosInstance.put(`/api/quiz/${quizId}/share/${userId}`, {
      permission,
    });
  },

  // Get quiz shares
  getQuizShares: async (quizId: string): Promise<QuizShare[]> => {
    const response = await axiosInstance.get(`/api/quiz/${quizId}/shares`);
    return response.data;
  },

  // Search users for sharing
  searchUsers: async (
    query: string,
  ): Promise<{ id: string; name: string; email: string }[]> => {
    const response = await axiosInstance.get("/api/user/search", {
      params: { query, size: 50 },
    });
    return response.data.data || [];
  },

  // Bank Integration APIs
  searchBanksForQuiz: async (
    quizId: string,
    query?: string,
  ): Promise<BankSummary[]> => {
    const response = await axiosInstance.get(
      `/api/quiz/${quizId}/bank/search`,
      {
        params: { query },
      },
    );
    return response.data;
  },

  getBankQuestionsForQuiz: async (
    quizId: string,
    bankId: string,
  ): Promise<Question[]> => {
    const response = await axiosInstance.get(
      `/api/quiz/${quizId}/bank/banks/${bankId}/questions`,
    );
    return response.data;
  },

  bulkAddQuestionsToQuiz: async (
    quizId: string,
    data: BulkAddQuestionsRequest,
  ): Promise<void> => {
    await axiosInstance.post(`/api/quiz/${quizId}/bank/add-questions`, data);
  },
};

export default quizQueries;
