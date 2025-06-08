import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios/axios-client";
import { Semester } from "@/types/types";
import { DataTableResponse } from "@/repo/semester-queries/semester-queries";

const useGetSemesters = (
  searchQuery?: string,
  page: number = 0,
  size: number = 10,
  columnFilters?: Record<string, string[]>
) => {
  return useQuery({
    queryKey: ["semesters", searchQuery, page, size, columnFilters],
    queryFn: async (): Promise<DataTableResponse> => {
      const isActiveFilter = columnFilters?.isActive?.[0];
      let endpoint = "/semester";
      const params: { [key: string]: string | number } = {
        page: page.toString(),
        size: size.toString(),
      };

      if (searchQuery) {
        endpoint = `/semester/search`;
        params.query = searchQuery;
      }

      const response = await axiosInstance.get(endpoint, { params });
      const data = response.data;

      if (Array.isArray(data)) {
        let filteredData = data;

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

      if (data.pagination) {
        return data as DataTableResponse;
      }

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
  });
};

export function useSemestersForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  columnFilters?: Record<string, string[]>
) {
  return useGetSemesters(search, page - 1, pageSize, columnFilters);
}

useSemestersForDataTable.isQueryHook = true;
