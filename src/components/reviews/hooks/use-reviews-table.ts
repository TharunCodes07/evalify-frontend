import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Review } from "@/types/types";
import axiosInstance from "@/lib/axios/axios-client";

interface DataTableResponse {
  data: Review[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export const useReviews = (
  searchQuery?: string,
  page: number = 0,
  size: number = 10,
  sortBy?: string,
  sortOrder?: "asc" | "desc"
) => {
  const { data: session } = useSession();
  const user = session?.user;

  const query = useQuery({
    queryKey: [
      "reviews",
      user?.id,
      user?.role,
      searchQuery,
      page,
      size,
      sortBy,
      sortOrder,
    ],
    queryFn: async (): Promise<DataTableResponse> => {
      if (!user) throw new Error("User not authenticated");

      let endpoint = "/api/review";
      const params: { [key: string]: string | number } = {};

      if (sortBy) {
        params.sort_by = sortBy;
      }

      if (sortOrder) {
        params.sort_order = sortOrder;
      }

      if (searchQuery) {
        endpoint = `/api/review/search`;
        params.name = searchQuery;
      } else {
        params.page = page.toString();
        params.size = size.toString();

        if (user.role === "STUDENT") {
          endpoint = `/api/review/user`;
          params.userId = user.id;
        }
      }

      const response = await axiosInstance.get(endpoint, { params });
      const backendResponse = response.data;

      if (backendResponse.pagination) {
        return backendResponse as DataTableResponse;
      }

      const reviews = Array.isArray(backendResponse)
        ? backendResponse
        : backendResponse.data || [];

      return {
        data: reviews,
        pagination: {
          total_pages: 1,
          current_page: 1,
          per_page: reviews.length,
          total_count: reviews.length,
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
