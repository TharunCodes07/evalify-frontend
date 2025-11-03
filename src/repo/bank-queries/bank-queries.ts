import axiosInstance from "@/lib/axios/axios-client";

interface CreateQuestionBankRequest {
  name: string;
  description?: string;
  topics: string[];
  isPublic: boolean;
}

interface UpdateQuestionBankRequest extends Partial<CreateQuestionBankRequest> {
  id: string;
}

interface ShareQuestionBankRequest {
  userIds: string[];
  permission: string;
}

const bankQueries = {
  createBank: async (data: CreateQuestionBankRequest) => {
    const response = await axiosInstance.post("/api/bank", data);
    return response.data;
  },

  updateBank: async (data: UpdateQuestionBankRequest) => {
    const { id, ...updateData } = data;
    const response = await axiosInstance.put(`/api/bank/${id}`, updateData);
    return response.data;
  },

  deleteBank: async (bankId: string) => {
    const response = await axiosInstance.delete(`/api/bank/${bankId}`);
    return response.data;
  },

  getBankById: async (bankId: string) => {
    const response = await axiosInstance.get(`/api/bank/${bankId}`);
    return response.data;
  },

  shareBank: async (bankId: string, data: ShareQuestionBankRequest) => {
    const response = await axiosInstance.post(
      `/api/bank/${bankId}/share`,
      data,
    );
    return response.data;
  },

  removeShare: async (bankId: string, userId: string) => {
    const response = await axiosInstance.delete(
      `/api/bank/${bankId}/share/${userId}`,
    );
    return response.data;
  },

  updateSharePermission: async (
    bankId: string,
    userId: string,
    permission: "VIEW" | "EDIT",
  ) => {
    const response = await axiosInstance.put(
      `/api/bank/${bankId}/share/${userId}`,
      { permission },
    );
    return response.data;
  },

  getBankShares: async (bankId: string) => {
    const response = await axiosInstance.get(`/api/bank/${bankId}/shares`);
    return response.data;
  },

  searchUsers: async (
    query: string,
    roles: string[] = ["FACULTY", "MANAGER", "ADMIN"],
  ) => {
    const response = await axiosInstance.get("/api/user/search", {
      params: {
        query,
        page: 0,
        size: 50,
      },
    });

    if (response.data.data) {
      return response.data.data.filter((user: { role: string }) =>
        roles.includes(user.role),
      );
    }
    return [];
  },

  // Topic management
  getTopics: async (bankId: string): Promise<string[]> => {
    const response = await axiosInstance.get(`/api/v1/banks/${bankId}/topics`);
    return response.data;
  },

  addTopic: async (bankId: string, topic: string): Promise<string[]> => {
    const response = await axiosInstance.post(
      `/api/v1/banks/${bankId}/topics`,
      {
        topic,
      },
    );
    return response.data;
  },

  updateTopic: async (
    bankId: string,
    oldTopic: string,
    newTopic: string,
  ): Promise<string[]> => {
    const response = await axiosInstance.put(
      `/api/v1/banks/${bankId}/topics/${encodeURIComponent(oldTopic)}`,
      { newTopic },
    );
    return response.data;
  },

  deleteTopic: async (bankId: string, topic: string): Promise<string[]> => {
    const response = await axiosInstance.delete(
      `/api/v1/banks/${bankId}/topics/${encodeURIComponent(topic)}`,
    );
    return response.data;
  },
};

export default bankQueries;
