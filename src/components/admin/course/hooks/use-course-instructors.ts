import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "../queries/course-queries";

export const useCourseInstructors = (courseId: string) => {
  return useQuery({
    queryKey: ["courseInstructors", courseId],
    queryFn: () => {
      return courseQueries.getCourseInstructors(courseId);
    },
    enabled: !!courseId,
  });
};
