import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Semester } from "@/types/types";
import { useSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface DataTableResponse {
  data: Semester[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export const semesterQueries = {
  useGetSemesters: (
    searchQuery?: string,
    page: number = 0,
    size: number = 10,
    columnFilters?: Record<string, string[]>
  ) => {
    const { data: session } = useSession();
    const user = session?.user;

    const isActiveFilter = columnFilters?.isActive?.[0];

    return useQuery({
      queryKey: ["semesters", user?.id, searchQuery, page, size, columnFilters],
      queryFn: async (): Promise<DataTableResponse> => {
        if (!user) throw new Error("User not authenticated");

        let endpoint = "/semester";
        const params = new URLSearchParams();

        if (searchQuery) {
          endpoint = `/semester/search`;
          params.append("query", searchQuery);
          params.append("page", page.toString());
          params.append("size", size.toString());
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

        const data = await response.json();
        
        // Handle array response
        if (Array.isArray(data)) {
          let filteredData = data;

          // Apply isActive filter if present
          if (isActiveFilter !== undefined) {
            const isActiveValue = isActiveFilter === "true";
            filteredData = filteredData.filter(
              (semester: Semester) => semester.isActive === isActiveValue
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

        // Handle paginated response
        if (data.pagination) {
          return data as DataTableResponse;
        }

        // Handle data wrapper response
        if (data.data) {
          return {
            data: data.data,
            pagination: {
              total_pages: 1,
              current_page: 0,
              per_page: data.data.length,
              total_count: data.data.length,
            },
          };
        }

        // Fallback to empty response
        return {
          data: [],
          pagination: {
            total_pages: 0,
            current_page: 0,
            per_page: size,
            total_count: 0,
          },
        };
      },
      enabled: !!user,
    });
  },

  useGetSemester: (id: string) => {
    const { data: session } = useSession();
    const user = session?.user;

    return useQuery({
      queryKey: ["semester", id],
      queryFn: async (): Promise<Semester> => {
        if (!user) throw new Error("User not authenticated");

        const response = await fetch(`${API_BASE_URL}/semester/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      },
      enabled: !!user && !!id,
    });
  },

  useCreateSemester: () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (semester: Omit<Semester, "id">) => {
        if (!session?.accessToken) throw new Error("User not authenticated");

        const response = await fetch(`${API_BASE_URL}/api/semester`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(semester),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["semesters"] });
      },
    });
  },

  useUpdateSemester: () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (semester: Semester) => {
        if (!session?.accessToken) throw new Error("User not authenticated");

        const response = await fetch(`${API_BASE_URL}/api/semester/${semester.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(semester),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["semesters"] });
        queryClient.invalidateQueries({ queryKey: ["semester", data.id] });
      },
    });
  },

  useDeleteSemester: () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.accessToken) throw new Error("User not authenticated");

        const response = await fetch(`${API_BASE_URL}/api/semester/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["semesters"] });
      },
    });
  },
};