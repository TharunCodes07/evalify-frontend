import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Project } from "@/types/types";

interface DataTableResponse {
  data: Project[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const useProjects = (
  teamId: string,
  searchQuery?: string,
  page: number = 0,
  size: number = 10
) => {
  const { data: session } = useSession();
  const user = session?.user;
  const query = useQuery({
    queryKey: ["projects", teamId, searchQuery, page, size],
    queryFn: async (): Promise<DataTableResponse> => {
      if (!user) throw new Error("User not authenticated");
      let endpoint = `/projects/team/${teamId}`;
      const params = new URLSearchParams();
      if (searchQuery) {
        endpoint = `/projects/team/${teamId}/search`;
        params.append("query", searchQuery);
      } else {
        params.append("page", page.toString());
        params.append("size", size.toString());
      }

      const url = `${API_BASE_URL}${endpoint}?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      try {
        const backendResponse = await response.json();
        return backendResponse as DataTableResponse;
      } catch (error) {
        throw new Error(`Failed to parse response: ${error}`);
      }
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
