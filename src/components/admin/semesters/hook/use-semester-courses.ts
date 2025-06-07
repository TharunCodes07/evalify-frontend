import { useQuery } from "@tanstack/react-query";
import semesterQueries from "../queries/semester-queries";

export const useSemesterCourses = (semesterId: string) => {
  return useQuery({
    queryKey: ["courses", semesterId],
    queryFn: async () => {
      return semesterQueries.getCourseBySemesterId(semesterId);
    },
    enabled: !!semesterId,
  });
};
