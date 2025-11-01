import { useQuery } from "@tanstack/react-query";
import { QuestionBank } from "@/types/bank";
import axiosInstance from "@/lib/axios/axios-client";

interface DataTableResponse {
  data: QuestionBank[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export const useBanks = (
  searchQuery?: string,
  page: number = 0,
  size: number = 10,
  columnFilters?: Record<string, string[]>,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
) => {
  const query = useQuery({
    queryKey: [
      "banks",
      searchQuery,
      page,
      size,
      columnFilters,
      sortBy,
      sortOrder,
    ],
    queryFn: async (): Promise<DataTableResponse> => {
      const endpoint = searchQuery ? "/api/bank/search" : "/api/bank";
      const params: { [key: string]: string | number | undefined } = {
        page: page,
        size: size,
      };

      if (sortBy) {
        params.sort_by = sortBy;
      }

      if (sortOrder) {
        params.sort_order = sortOrder;
      }

      if (searchQuery) {
        params.query = searchQuery;
      }

      try {
        const response = await axiosInstance.get(endpoint, { params });
        const backendResponse = response.data;

        if (backendResponse.data && backendResponse.pagination) {
          return {
            data: backendResponse.data,
            pagination: backendResponse.pagination,
          };
        }

        if (Array.isArray(backendResponse)) {
          let filteredData = backendResponse;

          if (searchQuery) {
            filteredData = filteredData.filter(
              (bank: QuestionBank) =>
                bank.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bank.description
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()),
            );
          }

          return {
            data: filteredData,
            pagination: {
              total_pages: Math.ceil(filteredData.length / size),
              current_page: page,
              per_page: size,
              total_count: filteredData.length,
            },
          };
        }

        return {
          data: [],
          pagination: {
            total_pages: 0,
            current_page: page,
            per_page: size,
            total_count: 0,
          },
        };
      } catch (error) {
        console.error("Error fetching banks:", error);
        return {
          data: [],
          pagination: {
            total_pages: 0,
            current_page: page,
            per_page: size,
            total_count: 0,
          },
        };
      }
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const queryWithFlag = query as typeof query & { isQueryHook: boolean };
  queryWithFlag.isQueryHook = true;
  return queryWithFlag;
};
