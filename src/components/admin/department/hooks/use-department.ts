import { useQuery } from "@tanstack/react-query";
import { Department } from "@/types/types";
import { useSession } from "next-auth/react";
import departmentQueries from "../queries/department-queries";

interface DataTableResponse {
  data: Department[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

interface CreateDepartmentRequest {
  name: string;
}

interface UpdateDepartmentRequest {
  name: string;
}

interface DepartmentResponse {
  id: string;
  name: string;
  batches?: Array<{
    id: string;
    name: string;
    graduationYear: string;
    section: string;
  }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useDepartments = (
  searchQuery?: string,
  page: number = 0,
  size: number = 10,
  columnFilters?: Record<string, string[]>
) => {
  const { data: session } = useSession();
  const user = session?.user;

  const query = useQuery({
    queryKey: [
      "departments",
      user?.id,
      user?.role,
      searchQuery,
      page,
      size,
      columnFilters,
    ],
    queryFn: async (): Promise<DataTableResponse> => {
      if (!user) throw new Error("User not authenticated");

      let endpoint = searchQuery ? "/api/department/search" : "/api/department";
      const params = new URLSearchParams();

      params.append("page", page.toString());
      params.append("size", size.toString());

      if (searchQuery) {
        params.append("query", searchQuery);
      }

      const url = `${API_BASE_URL}${endpoint}?${params.toString()}`;
      console.log("Fetching departments from:", url);

      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              errorData.error ||
              `HTTP error! status: ${response.status}`
          );
        }

        const backendResponse = await response.json();
        console.log("Backend response:", backendResponse);

        // Handle the new response format with batches
        if (backendResponse.data && backendResponse.pagination) {
          const departments = backendResponse.data.map(
            (dept: DepartmentResponse) => ({
              id: dept.id,
              name: dept.name,
              batches: dept.batches || [],
            })
          );

          return {
            data: departments,
            pagination: backendResponse.pagination,
          };
        }

        // Fallback for array response
        if (Array.isArray(backendResponse)) {
          let filteredData = backendResponse;

          // Apply search filter if needed
          if (searchQuery) {
            filteredData = filteredData.filter((department: Department) =>
              department.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }

          return {
            data: filteredData,
            pagination: {
              total_pages: Math.ceil(filteredData.length / size),
              current_page: page,
              per_page: size,
              total_count: filteredData.length,
            },
          };
        }

        // Fallback for empty or invalid response
        return {
          data: [],
          pagination: {
            total_pages: 0,
            current_page: page,
            per_page: size,
            total_count: 0,
          },
        };
      } catch (error) {
        console.error("Error fetching departments:", error);
        return {
          data: [],
          pagination: {
            total_pages: 0,
            current_page: page,
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

export const useAllDepartments = (options: { enabled?: boolean } = {}) => {
  const { enabled = true } = options;
  const { data: session } = useSession();
  const user = session?.user;

  return useQuery({
    queryKey: ["all-departments", user?.id, user?.role],
    queryFn: async (): Promise<Department[]> => {
      if (!user) throw new Error("User not authenticated");

      const url = `${API_BASE_URL}/api/department/all`;
      console.log("Fetching all departments from:", url);

      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              errorData.error ||
              `HTTP error! status: ${response.status}`
          );
        }

        const responseData = await response.json();
        if (Array.isArray(responseData)) {
          return responseData;
        }
        if (responseData.data) {
          return responseData.data.map((dept: DepartmentResponse) => ({
            id: dept.id,
            name: dept.name,
            batches: dept.batches || [],
          }));
        }
        return [];
      } catch (error) {
        console.error("Error fetching all departments:", error);
        return [];
      }
    },
    enabled: !!user && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
