"use client";

import { useFormContext } from "react-hook-form";
import { useQueries } from "@tanstack/react-query";
import { MultiSelect, OptionType } from "@/components/ui/multi-select";
import { Skeleton } from "@/components/ui/skeleton";
import semesterQueries from "@/repo/semester-queries/semester-queries";
import batchQueries from "@/repo/batch-queries/batch-queries";
import { courseQueries } from "@/repo/course-queries/course-queries";
import userQueries from "@/repo/user-queries/user-queries";
import { Participant, CreateQuizSchema } from "./create-quiz-schema";
import { User } from "@/components/admin/users/types/types";

interface SemesterResponse {
  id: string;
  name: string;
  year: number;
}

interface BatchResponse {
  id: string;
  name: string;
  section: string;
}

interface CourseResponse {
  id: string;
  name: string;
  code: string;
}

export function QuizParticipantsForm() {
  const { formState, setValue, watch } = useFormContext<CreateQuizSchema>();
  const semesterError = formState.errors.semesters?.message;

  // Watch current selections
  const selectedSemesters = watch("semesters") || [];
  const selectedBatches = watch("batches") || [];
  const selectedCourses = watch("courses") || [];
  const selectedStudents = watch("students") || [];

  // Parallel queries for all participant types
  const [semestersQuery, batchesQuery, coursesQuery, studentsQuery] =
    useQueries({
      queries: [
        {
          queryKey: ["activeSemesters"],
          queryFn: semesterQueries.getActiveSemesters,
          staleTime: 10 * 60 * 1000, // 10 minutes
          gcTime: 15 * 60 * 1000, // 15 minutes
        },
        {
          queryKey: ["activeBatches"],
          queryFn: batchQueries.getActiveBatches,
          staleTime: 10 * 60 * 1000,
          gcTime: 15 * 60 * 1000,
        },
        {
          queryKey: ["activeCourses"],
          queryFn: courseQueries.getActiveCourses,
          staleTime: 10 * 60 * 1000,
          gcTime: 15 * 60 * 1000,
        },
        {
          queryKey: ["activeStudents"],
          queryFn: userQueries.getActiveStudents,
          staleTime: 10 * 60 * 1000,
          gcTime: 15 * 60 * 1000,
        },
      ],
    });

  // Transform data to MultiSelect options
  const semesterOptions: OptionType[] =
    semestersQuery.data?.map((s: SemesterResponse) => ({
      label: `${s.name} - ${s.year}`,
      value: s.id,
    })) || [];

  const batchOptions: OptionType[] =
    batchesQuery.data?.map((b: BatchResponse) => ({
      label: `${b.name} (${b.section})`,
      value: b.id,
    })) || [];

  const courseOptions: OptionType[] =
    coursesQuery.data?.map((c: CourseResponse) => ({
      label: `${c.name} (${c.code})`,
      value: c.id,
    })) || [];

  const studentOptions: OptionType[] =
    studentsQuery.data?.map((s: User) => ({
      label: s.name,
      value: s.id,
    })) || [];

  // Handlers for MultiSelect changes
  const handleSemestersChange = (values: string[]) => {
    const participants: Participant[] = values.map((id) => {
      const semester = semestersQuery.data?.find(
        (s: SemesterResponse) => s.id === id,
      );
      return {
        id,
        name: semester ? `${semester.name} - ${semester.year}` : id,
      };
    });
    setValue("semesters", participants, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleBatchesChange = (values: string[]) => {
    const participants: Participant[] = values.map((id) => {
      const batch = batchesQuery.data?.find((b: BatchResponse) => b.id === id);
      return {
        id,
        name: batch ? `${batch.name} (${batch.section})` : id,
      };
    });
    setValue("batches", participants, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleCoursesChange = (values: string[]) => {
    const participants: Participant[] = values.map((id) => {
      const course = coursesQuery.data?.find(
        (c: CourseResponse) => c.id === id,
      );
      return {
        id,
        name: course ? `${course.name} (${course.code})` : id,
      };
    });
    setValue("courses", participants, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleStudentsChange = (values: string[]) => {
    const participants: Participant[] = values.map((id) => {
      const student = studentsQuery.data?.find((s: User) => s.id === id);
      return {
        id,
        name: student ? student.name : id,
      };
    });
    setValue("students", participants, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-6">
      {semesterError && (
        <div className="text-sm text-destructive font-medium">
          {semesterError}
        </div>
      )}

      {/* Grid Layout for all participant types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Semesters */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Semesters</h3>
          {semestersQuery.isLoading ? (
            <Skeleton className="h-[88px] w-full rounded-md" />
          ) : (
            <MultiSelect
              options={semesterOptions}
              selected={selectedSemesters.map((s: Participant) => s.id)}
              onChange={handleSemestersChange}
              placeholder="Search semesters..."
            />
          )}
        </div>

        {/* Batches */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Batches</h3>
          {batchesQuery.isLoading ? (
            <Skeleton className="h-[88px] w-full rounded-md" />
          ) : (
            <MultiSelect
              options={batchOptions}
              selected={selectedBatches.map((b: Participant) => b.id)}
              onChange={handleBatchesChange}
              placeholder="Search batches..."
            />
          )}
        </div>

        {/* Courses */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Courses</h3>
          {coursesQuery.isLoading ? (
            <Skeleton className="h-[88px] w-full rounded-md" />
          ) : (
            <MultiSelect
              options={courseOptions}
              selected={selectedCourses.map((c: Participant) => c.id)}
              onChange={handleCoursesChange}
              placeholder="Search courses..."
            />
          )}
        </div>

        {/* Students */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Individual Students</h3>
          {studentsQuery.isLoading ? (
            <Skeleton className="h-[88px] w-full rounded-md" />
          ) : (
            <MultiSelect
              options={studentOptions}
              selected={selectedStudents.map((s: Participant) => s.id)}
              onChange={handleStudentsChange}
              placeholder="Search students..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
