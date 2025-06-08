import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Batch, User } from "@/types/types";
import { useSession } from "next-auth/react";
import batchQueries from "@/repo/batch-queries/batch-queries";
import axiosInstance from "@/lib/axios/axios-client";

interface BatchDataTableResponse {
  data: Batch[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

interface StudentDataTableResponse {
  data: User[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export const useAssignStudentsToBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { batchId: string; userIds: (string | number)[] }) => {
      return batchQueries.assignUsersToBatch({
        batchId: data.batchId,
        userIds: data.userIds,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["batchStudents", variables.batchId],
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useBatches = (
  searchQuery?: string,
  page: number = 0,
  size: number = 10,
  columnFilters?: Record<string, string[]>
) => {
  const { data: session } = useSession();
  const user = session?.user;
  const isActiveFilter = columnFilters?.isActive?.[0];

  const query = useQuery({
    queryKey: ["batches", user?.id, searchQuery, page, size, isActiveFilter],
    queryFn: async (): Promise<BatchDataTableResponse> => {
      if (!user) throw new Error("User not authenticated");

      const params: { [key: string]: string | number } = {
        page: page,
        size: size,
      };

      if (searchQuery) {
        params.query = searchQuery;
      }

      const endpoint = searchQuery ? "/api/batch/search" : "/api/batch";
      const response = await axiosInstance.get(endpoint, { params });

      const backendResponse = response.data;
      if (backendResponse.data && backendResponse.pagination) {
        return backendResponse as BatchDataTableResponse;
      }

      const batches = Array.isArray(backendResponse)
        ? backendResponse
        : backendResponse.data || [];
      let filteredData = batches;

      if (isActiveFilter !== undefined) {
        const isActiveValue = isActiveFilter === "true";
        filteredData = filteredData.filter(
          (batch: Batch) => batch.isActive === isActiveValue
        );
      }

      return {
        data: filteredData,
        pagination: {
          total_pages: 1,
          current_page: 0,
          per_page: filteredData.length,
          total_count: filteredData.length,
        },
      };
    },
    enabled: !!user,
  });

  return { ...query, isQueryHook: true };
};

export const useBatchById = (batchId: string) => {
  return useQuery({
    queryKey: ["batch", batchId],
    queryFn: async (): Promise<Batch> => {
      return batchQueries.getBatchById(batchId);
    },
    enabled: !!batchId,
  });
};

export const useBatchStudents = (
  batchId: string,
  searchQuery?: string,
  page: number = 0,
  size: number = 10
) => {
  const query = useQuery({
    queryKey: ["batchStudents", batchId, searchQuery, page, size],
    queryFn: async (): Promise<StudentDataTableResponse> => {
      const response = await batchQueries.getBatchStudents(
        batchId,
        page,
        size,
        searchQuery
      );
      return response;
    },
    enabled: !!batchId,
  });

  return { ...query, isQueryHook: true };
};
