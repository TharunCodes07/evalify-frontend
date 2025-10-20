import axiosInstance from "@/lib/axios/axios-client";

export interface CriterionScoreData {
  criterionId: string;
  score: number;
  comment: string | null;
}

export interface ParticipantScoreData {
  participantId: string;
  criterionScores: CriterionScoreData[];
}

export interface EvaluationDraft {
  reviewId: string;
  projectId: string;
  courseId: string;
  evaluatorId: string;
  scores: ParticipantScoreData[];
  lastUpdated: string;
  isSubmitted: boolean;
}

export interface SaveDraftRequest {
  reviewId: string;
  projectId: string;
  courseId: string;
  scores: ParticipantScoreData[];
}

export interface SaveDraftResponse {
  success: boolean;
  savedAt: string;
  message: string;
}

export interface GetDraftResponse {
  exists: boolean;
  draft: EvaluationDraft | null;
}

const getDraft = async (
  reviewId: string,
  projectId: string,
  courseId: string,
): Promise<GetDraftResponse> => {
  const response = await axiosInstance.get("/api/individualScore/draft", {
    params: {
      reviewId,
      projectId,
      courseId,
    },
  });
  return response.data;
};

const saveDraft = async (
  request: SaveDraftRequest,
): Promise<SaveDraftResponse> => {
  const response = await axiosInstance.post(
    "/api/individualScore/draft",
    request,
  );
  return response.data;
};

const clearDraft = async (
  reviewId: string,
  projectId: string,
  courseId: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete("/api/individualScore/draft", {
    params: {
      reviewId,
      projectId,
      courseId,
    },
  });
  return response.data;
};

export const evaluationDraftQueries = {
  getDraft,
  saveDraft,
  clearDraft,
};
