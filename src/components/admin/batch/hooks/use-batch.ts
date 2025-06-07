import { useQuery } from "@tanstack/react-query";
import { Batch, User } from "@/types/types";
import { useSession } from "next-auth/react";
import batchQueries from "@/components/admin/batch/queries/batch-queries";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
      if (!user || !session?.accessToken)
        throw new Error("User not authenticated");

      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (searchQuery) {
        params.append("query", searchQuery);
      }

      const url = `${API_BASE_URL}/api/batch?${params.toString()}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const backendResponse = await response.json();
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
    enabled: !!user && !!session?.accessToken,
  });

  return { ...query, isQueryHook: true };
};

export const useBatchById = (batchId: string) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useQuery({
    queryKey: ["batch", batchId],
    queryFn: async (): Promise<Batch> => {
      if (!accessToken) throw new Error("User not authenticated");
      return batchQueries.getBatchById(batchId, accessToken);
    },
    enabled: !!accessToken && !!batchId,
  });
};

export const useBatchStudents = (
  batchId: string,
  searchQuery?: string,
  page: number = 0,
  size: number = 10
) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const query = useQuery({
    queryKey: ["batchStudents", batchId, searchQuery, page, size],
    queryFn: async (): Promise<StudentDataTableResponse> => {
      if (!accessToken) throw new Error("User not authenticated");

      const response = await batchQueries.getBatchStudents(
        batchId,
        accessToken,
        page,
        size,
        searchQuery
      );
      return response;
    },
    enabled: !!accessToken && !!batchId,
  });

  return { ...query, isQueryHook: true };
};
