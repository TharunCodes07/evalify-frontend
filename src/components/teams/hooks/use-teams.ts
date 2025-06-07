import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Team } from "@/types/types";
import axiosInstance from "@/lib/axios/axios-client";

interface DataTableResponse {
  data: Team[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useTeams = (
  searchQuery?: string,
  page: number = 0,
  size: number = 10
) => {
  const { data: session } = useSession();
  const user = session?.user;

  const query = useQuery({
    queryKey: ["teams", user?.id, user?.role, searchQuery, page, size],
    queryFn: async (): Promise<DataTableResponse> => {
      if (!user) throw new Error("User not authenticated");

      let endpoint = "/teams";
      const params: { [key: string]: string } = {};

      if (searchQuery) {
        endpoint = `/teams/search`;
        params.query = searchQuery;
      } else {
        params.page = page.toString();
        params.size = size.toString();

        if (user.role === "STUDENT") {
          endpoint = `/teams/user/${user.id}`;
        }
      }

      const response = await axiosInstance.get(endpoint, { params });
      const backendResponse = response.data;

      if (backendResponse.pagination) {
        return backendResponse as DataTableResponse;
      }

      const teams = Array.isArray(backendResponse)
        ? backendResponse
        : backendResponse.data || [];

      return {
        data: teams,
        pagination: {
          total_pages: 1,
          current_page: 1,
          per_page: teams.length,
          total_count: teams.length,
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
