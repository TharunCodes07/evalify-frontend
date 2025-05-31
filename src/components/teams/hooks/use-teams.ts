import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Team } from "@/types/types";

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
      const params = new URLSearchParams();

      if (searchQuery) {
        endpoint = `/teams/search`;
        params.append("query", searchQuery);
      } else {
        params.append("page", page.toString());
        params.append("size", size.toString());

        if (user.role === "STUDENT") {
          endpoint = `/teams/user/${user.id}`;
        }
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
      } catch (error) {
        console.error("Error parsing response:", error);
        return {
          data: [],
          pagination: {
            total_pages: 0,
            current_page: 0,
            per_page: size,
            total_count: 0,
          },
        };
      }
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
