import { useQuery } from "@tanstack/react-query";
import { useSessionContext } from "@/lib/session-context";
import axiosInstance from "@/lib/axios/axios-client";
import { QuizListResponse } from "@/types/quiz";

interface DataTableResponse {
  data: QuizListResponse[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export const useQuizzes = (
  searchQuery?: string,
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
) => {
  const { user } = useSessionContext();

  const query = useQuery({
    queryKey: ["quizzes", searchQuery, page, size, sortBy, sortOrder],

    queryFn: async (): Promise<DataTableResponse> => {
      if (!user) throw new Error("User not authenticated");

      let endpoint: string;
      const params: { [key: string]: string | number } = {};

      // Add pagination parameters
      params.page = page.toString();
      params.size = size.toString();

      // Add sorting parameters
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;

      // Use different endpoints based on whether we're searching or not
      if (searchQuery && searchQuery.trim().length > 0) {
        // Use search endpoint when there's a search query
        endpoint = `/api/quiz/search`;
        params.query = searchQuery;
      } else {
        // Use regular endpoint for listing quizzes (role-based via JWT)
        endpoint = `/api/quiz`;
      }

      const response = await axiosInstance.get(endpoint, { params });
      const backendResponse = response.data;

      // The backend always returns paginated responses
      if (backendResponse.pagination) {
        return backendResponse as DataTableResponse;
      }

      // Fallback for any legacy responses
      const quizzes = Array.isArray(backendResponse)
        ? backendResponse
        : backendResponse.data || [];

      return {
        data: quizzes,
        pagination: {
          total_pages: 1,
          current_page: page,
          per_page: quizzes.length,
          total_count: quizzes.length,
        },
      };
    },
    enabled: !!user,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const queryWithFlag = query as typeof query & { isQueryHook: boolean };
  queryWithFlag.isQueryHook = true;

  return queryWithFlag;
};
