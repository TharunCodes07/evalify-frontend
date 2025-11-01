import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios/axios-client";

interface CreateLabRequest {
  name: string;
  block: string;
  ipSubnet: string;
}

interface UpdateLabRequest extends CreateLabRequest {
  id: string;
}

interface LabResponse {
  id: string;
  name: string;
  block: string;
  ipSubnet: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export const useCreateLab = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLabRequest): Promise<LabResponse> => {
      const response = await axiosInstance.post("/api/lab", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labs"] });
    },
  });
};

export const useUpdateLab = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateLabRequest): Promise<LabResponse> => {
      const { id, ...updateData } = data;
      const response = await axiosInstance.put(`/api/lab/${id}`, updateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labs"] });
    },
  });
};

export const useDeleteLab = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (labId: string): Promise<void> => {
      await axiosInstance.delete(`/api/lab/${labId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labs"] });
    },
  });
};

export const useSearchLabs = () => {
  return useMutation({
    mutationFn: async (params: {
      query: string;
      page?: number;
      size?: number;
    }): Promise<PaginatedResponse<LabResponse>> => {
      const response = await axiosInstance.get("/api/lab/search", {
        params,
      });
      return response.data;
    },
  });
};

const labQueries = {
  createLab: async (data: CreateLabRequest) => {
    const response = await axiosInstance.post("/api/lab", data);
    return response.data;
  },

  updateLab: async (data: UpdateLabRequest) => {
    const { id, ...updateData } = data;
    const response = await axiosInstance.put(`/api/lab/${id}`, updateData);
    return response.data;
  },

  deleteLab: async (labId: string) => {
    const response = await axiosInstance.delete(`/api/lab/${labId}`);
    return response.data;
  },

  getLabById: async (labId: string) => {
    const response = await axiosInstance.get(`/api/lab/${labId}`);
    return response.data;
  },

  getLabs: async () => {
    const response = await axiosInstance.get("/api/lab");
    return response.data;
  },
};

export default labQueries;
