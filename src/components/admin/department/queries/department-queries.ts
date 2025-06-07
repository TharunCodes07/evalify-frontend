import { Department } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface CreateDepartmentRequest {
  name: string;
}

interface UpdateDepartmentRequest extends CreateDepartmentRequest {
  id: string;
}

interface DepartmentResponse {
  id: string;
  name: string;
  batches?: any[];
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

const departmentQueries = {
  createDepartment: () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: CreateDepartmentRequest): Promise<DepartmentResponse> => {
        const response = await fetch(`${API_BASE_URL}/api/department`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.error || "Failed to create department");
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
      },
    });
  },

  updateDepartment: () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (data: UpdateDepartmentRequest): Promise<DepartmentResponse> => {
        const { id, ...updateData } = data;
        const response = await fetch(`${API_BASE_URL}/api/department/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.error || "Failed to update department");
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
      },
    });
  },

  deleteDepartment: () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (departmentId: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/api/department/${departmentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.error || "Failed to delete department");
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
      },
    });
  },

  getAllDepartments: () => {
    const { data: session } = useSession();

    return useMutation({
      mutationFn: async (params?: {
        page?: number;
        size?: number;
      }): Promise<PaginatedResponse<DepartmentResponse>> => {
        const searchParams = new URLSearchParams();
        if (params?.page !== undefined) searchParams.append("page", params.page.toString());
        if (params?.size !== undefined) searchParams.append("size", params.size.toString());

        const url = `${API_BASE_URL}/api/department${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.error || "Failed to fetch departments");
        }

        return response.json();
      },
    });
  },

  searchDepartments: () => {
    const { data: session } = useSession();

    return useMutation({
      mutationFn: async (params: {
        query: string;
        page?: number;
        size?: number;
      }): Promise<PaginatedResponse<DepartmentResponse>> => {
        const searchParams = new URLSearchParams();
        searchParams.append("query", params.query);
        if (params?.page !== undefined) searchParams.append("page", params.page.toString());
        if (params?.size !== undefined) searchParams.append("size", params.size.toString());

        const response = await fetch(`${API_BASE_URL}/api/department/search?${searchParams.toString()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.error || "Failed to search departments");
        }

        return response.json();
      },
    });
  },

  getDepartmentBatches: () => {
    const { data: session } = useSession();

    return useMutation({
      mutationFn: async (departmentId: string) => {
        const response = await fetch(`${API_BASE_URL}/api/department/${departmentId}/batches`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.error || "Failed to fetch department batches");
        }

        return response.json();
      },
    });
  },
};

export default departmentQueries; 