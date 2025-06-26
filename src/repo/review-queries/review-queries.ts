import axiosInstance from "@/lib/axios/axios-client";
import { CreateReviewRequest, UpdateReviewRequest } from "./review-types";

const reviewQueries = {
  createReview: async (data: CreateReviewRequest) => {
    const response = await axiosInstance.post("/api/review", data);
    return response.data;
  },

  getReviewById: async (reviewId: string) => {
    const response = await axiosInstance.get(`/api/review/${reviewId}`);
    return response.data;
  },

  updateReview: async (reviewId: string, data: UpdateReviewRequest) => {
    const response = await axiosInstance.put(`/api/review/${reviewId}`, data);
    return response.data;
  },

  deleteReview: async (reviewId: string, userId: string) => {
    const response = await axiosInstance.delete(`/api/review/${reviewId}`, {
      data: { userId },
    });
    return response.data;
  },
};

export default reviewQueries;
