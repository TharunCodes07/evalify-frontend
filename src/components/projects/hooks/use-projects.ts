import { useQuery } from "@tanstack/react-query";
import { Project } from "@/types/types";
import axiosInstance from "@/lib/axios/axios-client";

interface DataTableResponse {
  data: Project[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export const useProjects = (
  teamId: string,
  searchQuery?: string,
  page: number = 0,
  size: number = 10
) => {
  const query = useQuery({
    queryKey: ["projects", teamId, searchQuery, page, size],
    queryFn: async (): Promise<DataTableResponse> => {
      let endpoint = `/projects/team/${teamId}`;
      const params: { [key: string]: string } = {};

      if (searchQuery) {
        endpoint = `/projects/team/${teamId}/search`;
        params.query = searchQuery;
      } else {
        params.page = page.toString();
        params.size = size.toString();
      }

      const response = await axiosInstance.get(endpoint, { params });
      return response.data;
    },
    enabled: !!teamId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
  const queryWithFlag = query as typeof query & { isQueryHook: boolean };
  queryWithFlag.isQueryHook = true;
  return queryWithFlag;
};
