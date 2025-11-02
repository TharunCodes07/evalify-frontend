import axiosInstance from "@/lib/axios/axios-client";
import {
  CreateBankQuestionRequest,
  UpdateBankQuestionRequest,
  BankQuestionResponse,
} from "@/types/bank";
import {
  CreateQuizQuestionRequest,
  UpdateQuizQuestionRequest,
  QuizQuestionResponse,
} from "@/types/quiz";

// Bank Question Queries
export const bankQuestionQueries = {
  createQuestion: async (
    bankId: string,
    data: CreateBankQuestionRequest,
  ): Promise<BankQuestionResponse> => {
    const response = await axiosInstance.post(
      `/api/bank/${bankId}/questions`,
      data,
    );
    return response.data;
  },

  getQuestion: async (
    bankId: string,
    questionId: string,
  ): Promise<BankQuestionResponse> => {
    const response = await axiosInstance.get(
      `/api/bank/${bankId}/questions/${questionId}`,
    );
    return response.data;
  },

  getAllQuestions: async (bankId: string): Promise<BankQuestionResponse[]> => {
    const response = await axiosInstance.get(`/api/bank/${bankId}/questions`);
    return response.data;
  },

  updateQuestion: async (
    bankId: string,
    questionId: string,
    data: UpdateBankQuestionRequest,
  ): Promise<BankQuestionResponse> => {
    const response = await axiosInstance.put(
      `/api/bank/${bankId}/questions/${questionId}`,
      data,
    );
    return response.data;
  },

  deleteQuestion: async (bankId: string, questionId: string): Promise<void> => {
    await axiosInstance.delete(`/api/bank/${bankId}/questions/${questionId}`);
  },
};

// Quiz Question Queries
export const quizQuestionQueries = {
  createQuestion: async (
    quizId: string,
    data: CreateQuizQuestionRequest,
  ): Promise<QuizQuestionResponse> => {
    const response = await axiosInstance.post(
      `/api/quiz/${quizId}/questions`,
      data,
    );
    return response.data;
  },

  getQuestion: async (
    quizId: string,
    questionId: string,
  ): Promise<QuizQuestionResponse> => {
    const response = await axiosInstance.get(
      `/api/quiz/${quizId}/questions/${questionId}`,
    );
    return response.data;
  },

  getAllQuestions: async (quizId: string): Promise<QuizQuestionResponse[]> => {
    const response = await axiosInstance.get(`/api/quiz/${quizId}/questions`);
    return response.data;
  },

  updateQuestion: async (
    quizId: string,
    questionId: string,
    data: UpdateQuizQuestionRequest,
  ): Promise<QuizQuestionResponse> => {
    const response = await axiosInstance.put(
      `/api/quiz/${quizId}/questions/${questionId}`,
      data,
    );
    return response.data;
  },

  deleteQuestion: async (quizId: string, questionId: string): Promise<void> => {
    await axiosInstance.delete(`/api/quiz/${quizId}/questions/${questionId}`);
  },
};

const questionQueries = {
  bank: bankQuestionQueries,
  quiz: quizQuestionQueries,
};

export default questionQueries;
