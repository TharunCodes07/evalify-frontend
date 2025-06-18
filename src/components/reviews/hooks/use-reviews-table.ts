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
  sortOrder?: "asc" | "desc",
  courseId?: string,
  status?: string
) => {
  const { data: session } = useSession();
  const user = session?.user;
  const query = useQuery({
    queryKey: [
      "reviews",
      user?.id,
      user?.groups, // Using groups instead of role
      searchQuery,
      page,
      size,
      sortBy,
      sortOrder,
      courseId,
      status,
    ],
    queryFn: async (): Promise<DataTableResponse> => {
      if (!user) throw new Error("User not authenticated");

      let endpoint: string;
      const params: { [key: string]: string | number } = {};

      // Add pagination parameters
      params.page = page.toString();
      params.size = size.toString();

      // Add sorting parameters
      if (sortBy) {
        params.sortBy = sortBy;
      }

      if (sortOrder) {
        params.sortOrder = sortOrder;
      } // Use different endpoints based on whether we're searching or not
      if (searchQuery && searchQuery.trim().length > 0) {
        // Use search endpoint when there's a search query
        endpoint = `/api/review/search/${user.id}`;
        params.name = searchQuery;
      } else {
        // Use regular endpoint for listing all reviews based on user role
        const userGroups = user.groups || [];
        if ((userGroups as string[]).includes("student")) {
          endpoint = `/api/review/user`;
          params.userId = user.id;
        } else {
          endpoint = `/api/review`;
        }
      }

      // Add filter parameters only for search
      if (searchQuery && searchQuery.trim().length > 0) {
        if (courseId) {
          params.courseId = courseId;
        }

        if (status) {
          params.status = status;
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
