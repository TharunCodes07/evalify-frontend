import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/types";
import { useSession } from "next-auth/react";

interface DataTableResponse {
  data: User[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useUsers = (
  searchQuery?: string,
  page: number = 0,
  size: number = 10,
  columnFilters?: Record<string, string[]>
) => {
  const { data: session } = useSession();
  const user = session?.user;

  const role = columnFilters?.role?.[0];
  const query = useQuery({
    queryKey: [
      "users",
      user?.id,
      user?.role,
      searchQuery,
      page,
      size,
      columnFilters,
    ],
    queryFn: async (): Promise<DataTableResponse> => {
      if (!user) throw new Error("User not authenticated");

      let endpoint = "/api/user";
      const params = new URLSearchParams();
      if (role && role !== "ALL") {
        params.append("role", role);
      }

      if (searchQuery) {
        if (role && role !== "ALL") {
        } else {
          endpoint = `/api/user/search`;
          params.append("query", searchQuery);
          params.append("page", page.toString());
          params.append("size", size.toString());
        }
      } else if (!role || role === "ALL") {
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

        if (Array.isArray(backendResponse)) {
          let filteredData = backendResponse;

          if (searchQuery && role && role !== "ALL") {
            filteredData = backendResponse.filter(
              (user: User) =>
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
        }

        if (backendResponse.pagination) {
          return backendResponse as DataTableResponse;
        } else {
          const users = backendResponse.data || [];
          return {
            data: users,
            pagination: {
              total_pages: 1,
              current_page: 0,
              per_page: users.length,
              total_count: users.length,
            },
          };
        }
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
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
  const queryWithFlag = query as typeof query & { isQueryHook: boolean };
  queryWithFlag.isQueryHook = true;
  return queryWithFlag;
};
