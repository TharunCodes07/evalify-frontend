import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/types";
import userQueries from "@/components/admin/users/queries/user-queries";
import axiosInstance from "@/lib/axios/axios-client";

interface DataTableResponse {
  data: User[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export const useUsers = (
  searchQuery?: string,
  page: number = 0,
  size: number = 10,
  columnFilters?: Record<string, string[]>
) => {
  const role = columnFilters?.role?.[0];
  const query = useQuery({
    queryKey: ["users", role, searchQuery, page, size, columnFilters],
    queryFn: async (): Promise<DataTableResponse> => {
      let endpoint = "/api/user";
      const params: { [key: string]: string } = {};
      if (role && role !== "ALL") {
        params.role = role;
      }

      if (searchQuery) {
        if (role && role !== "ALL") {
          // This block is empty, which is suspicious, but I will keep the logic as is.
        } else {
          endpoint = `/api/user/search`;
          params.query = searchQuery;
          params.page = page.toString();
          params.size = size.toString();
        }
      } else if (!role || role === "ALL") {
        params.page = page.toString();
        params.size = size.toString();
      }
      const response = await axiosInstance.get(endpoint, { params });
      const backendResponse = response.data;

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
    },
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

export const useUsersByRole = (role: string) => {
  return useQuery({
    queryKey: ["users", role],
    queryFn: async () => {
      return userQueries.fetchUsersByRole(role);
    },
    enabled: !!role,
  });
};
