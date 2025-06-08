import { useQuery } from "@tanstack/react-query";
import { Course } from "@/types/types";
import { useSession } from "next-auth/react";
import { courseQueries } from "@/repo/course-queries/course-queries";
import axiosInstance from "@/lib/axios/axios-client";

interface DataTableResponse {
  data: Course[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export const useCourses = (
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
      "courses ",
      user?.id,
      user?.role,
      searchQuery,
      page,
      size,
      columnFilters,
    ],
    queryFn: async (): Promise<DataTableResponse> => {
      if (!user) throw new Error("User not authenticated");

      let endpoint = "/course";
      const params: { [key: string]: string } = {};
      if (role && role !== "ALL") {
        params.role = role;
      }

      if (searchQuery) {
        if (role && role !== "ALL") {
        } else {
          endpoint = `/course/search`;
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
          filteredData = backendResponse.filter((course: Course) =>
            course.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
    enabled: !!user,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
  const queryWithFlag = query as typeof query & { isQueryHook: boolean };
  queryWithFlag.isQueryHook = true;
  return queryWithFlag;
};

export const useCourse = (courseId: string) => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => {
      if (!session?.accessToken) {
        throw new Error("Not authenticated");
      }
      return courseQueries.getCourseById(courseId);
    },
    enabled: !!session?.accessToken && !!courseId,
  });
};
