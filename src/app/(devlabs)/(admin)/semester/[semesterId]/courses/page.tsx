"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSemesterCourses } from "@/components/admin/semesters/hook/use-semester-courses";
import CourseList from "@/components/admin/semesters/courses/course-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function SemesterCoursesPage() {
  const params = useParams();
  const semesterId = params.semesterId as string;
  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useSemesterCourses(semesterId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message || "Failed to fetch courses."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Courses</h1>
      </div>
      <CourseList courses={courses || []} />
    </div>
  );
}
