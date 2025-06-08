import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "@/repo/course-queries/course-queries";

const MyCoursesPage = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["my-courses"],
    queryFn: courseQueries.getMyCourses,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  return <div>{JSON.stringify(courses)}</div>;
};

export default MyCoursesPage;
