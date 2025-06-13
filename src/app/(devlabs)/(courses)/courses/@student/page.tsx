"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "@/repo/course-queries/course-queries";
import { StudentCourseCard } from "@/components/student-courses/student-course-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function StudentCoursesPage() {
  const { data: session, status } = useSession();
  const studentId = session?.user?.id;

  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["studentCourses", studentId],
    queryFn: () => courseQueries.getCourseByStudentId(studentId!),
    enabled: status === "authenticated" && !!studentId,
  });

  const pageIsLoading = status === "loading" || isLoading;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Enrolled Courses</h1>
      {pageIsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load your courses. Please try again later.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses?.map((course) => (
            <StudentCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
