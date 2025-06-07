import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import semesterQueries, {
  DataTableResponse,
} from "../queries/semester-queries";

const useGetSemesters = (
  searchQuery?: string,
  page: number = 0,
  size: number = 10,
  columnFilters?: Record<string, string[]>
) => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: [
      "semesters",
      session?.user?.id,
      searchQuery,
      page,
      size,
      columnFilters,
    ],
    queryFn: async (): Promise<DataTableResponse> => {
      if (!session) throw new Error("User not authenticated");
      return semesterQueries.getSemesters(
        session,
        searchQuery,
        page,
        size,
        columnFilters
      );
    },
    enabled: !!session,
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
