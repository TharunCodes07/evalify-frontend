import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios/axios-client";
import { Project } from "@/types/types";
import { useSession } from "next-auth/react";

interface DataTableResponse {
  data: Project[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export const useProjectsByCourse = (
  courseId: string,
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
      "projects",
      courseId,
      user?.id,
      searchQuery,
      page,
      size,
      sortBy,
      sortOrder,
    ],
    queryFn: async (): Promise<DataTableResponse> => {
      let endpoint = `/projects/course/${courseId}`;
      const params: { [key: string]: string } = {};

      if (sortBy) {
        params.sort_by = sortBy;
      }
      if (sortOrder) {
        params.sort_order = sortOrder;
      }

      if (searchQuery && searchQuery.length > 0) {
        endpoint = `/projects/course/${courseId}/search`;
        params.query = searchQuery;
      } else {
        params.page = page.toString();
        params.size = size.toString();
      }

      const response = await axiosInstance.get(endpoint, { params });
      const backendResponse = response.data;

      if (backendResponse.pagination) {
        return backendResponse as DataTableResponse;
      }

      const projects = Array.isArray(backendResponse)
        ? backendResponse
        : backendResponse.data || [];

      return {
        data: projects,
        pagination: {
          total_pages: 1,
          current_page: 1,
          per_page: projects.length,
          total_count: projects.length,
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
