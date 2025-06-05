import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Course } from "@/types/types";
import { useSession } from "next-auth/react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

interface HalResponse {
  _embedded: {
    courses: Course[];
  };
  _links: {
    self: { href: string };
    profile: { href: string };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export const courseQueries = {
  useGetCourses: (
    searchQuery?: string,
    page: number = 0,
    size: number = 10,
    columnFilters?: Record<string, string[]>
  ) => {
    const { data: session } = useSession();
    const user = session?.user;

    const isActiveFilter = columnFilters?.isActive?.[0];

    return useQuery({
      queryKey: ["courses", user?.id, searchQuery, page, size, columnFilters],
      queryFn: async () => {
        if (!user) throw new Error("User not authenticated");

        let endpoint = "/course";
        const params = new URLSearchParams();

        if (searchQuery) {
          endpoint = `/course/search`;
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

        const data = await response.json() as HalResponse;
        let filteredData = data._embedded.courses;

        return {
          data: filteredData,
          pagination: {
            total_pages: data.page.totalPages,
            current_page: data.page.number,
            per_page: data.page.size,
            total_count: data.page.totalElements,
          },
        };
      },
      enabled: !!user,
    });
  },

  useGetCourse: (id: string) => {
    const { data: session } = useSession();
    const user = session?.user;

    return useQuery({
      queryKey: ["course", id],
      queryFn: async (): Promise<Course> => {
        if (!user) throw new Error("User not authenticated");

        const response = await fetch(`${API_BASE_URL}/course/${id}`, {
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

  useCreateCourse: () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (course: Omit<Course, "id">) => {
        if (!session?.accessToken) throw new Error("User not authenticated");

        const response = await fetch(`${API_BASE_URL}/course`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(course),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      },
    });
  },

  useUpdateCourse: () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (course: Course) => {
        if (!session?.accessToken) throw new Error("User not authenticated");

        const response = await fetch(`${API_BASE_URL}/course/${course.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(course),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        queryClient.invalidateQueries({ queryKey: ["course", data.id] });
      },
    });
  },

  useDeleteCourse: () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.accessToken) throw new Error("User not authenticated");

        const response = await fetch(`${API_BASE_URL}/course/${id}`, {
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
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      },
    });
  },
}; 