import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import semesterQueries from "../queries/semester-queries";

export const useSemesterCourses = (semesterId: string) => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["courses", semesterId],
    queryFn: async () => {
      if (!session) {
        throw new Error("User not authenticated");
      }
      return semesterQueries.getCourseBySemesterId(session, semesterId);
    },
    enabled: !!session && !!semesterId,
  });
};
