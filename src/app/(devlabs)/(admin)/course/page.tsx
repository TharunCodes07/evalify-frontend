"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { courseQueries } from "@/components/admin/course/queries/course-queries";
import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "@/components/admin/course/course-columns";
import { Course } from "@/types/types";
import { CourseHeader } from "@/components/admin/course/course-header";
import { CourseAlerts } from "@/components/admin/course/course-alerts";
import { CourseDialogs } from "@/components/admin/course/course-dialogs";

function useCoursesForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  columnFilters?: Record<string, string[]>
) {
  return courseQueries.useGetCourses(
    search,
    page - 1,
    pageSize,
    columnFilters
  );
}

useCoursesForDataTable.isQueryHook = true;

export default function CoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [courseToDelete, setCourseToDelete] = React.useState<Course | null>(null);

  const createCourse = courseQueries.useCreateCourse();
  const updateCourse = courseQueries.useUpdateCourse();
  const deleteCourse = courseQueries.useDeleteCourse();

  const handleAction = (course: Course, action: string) => {
    switch (action) {
      case "view":
        router.push(`/course/${course.id}`);
        break;
      case "schedules":
        router.push(`/course/${course.id}/schedules`);
        break;
      case "settings":
        router.push(`/course/${course.id}/settings`);
        break;
      case "edit":
        setSelectedCourse(course);
        setIsEditDialogOpen(true);
        break;
      case "delete":
        setCourseToDelete(course);
        setIsDeleteDialogOpen(true);
        break;
    }
  };

  const handleCreateCourse = async (data: Omit<Course, "id">) => {
    try {
      await createCourse.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleUpdateCourse = async (data: Omit<Course, "id">) => {
    if (!selectedCourse) return;
    const courseId = selectedCourse.id || selectedCourse._links?.self?.href?.split('/').pop();
    if (!courseId) {
      console.error("Course ID not found for update");
      return;
    }
    try {
      await updateCourse.mutateAsync({
        id: courseId,
        ...data,
      });
      setIsEditDialogOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      const courseId = courseToDelete.id || courseToDelete._links?.self?.href?.split('/').pop();
      if (!courseId) {
        throw new Error("Course ID not found");
      }
      await deleteCourse.mutateAsync(courseId);
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <CourseHeader
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        onCreateCourse={handleCreateCourse}
      />

      <CourseAlerts
        isCreating={createCourse.isPending}
        isUpdating={updateCourse.isPending}
        isDeleting={deleteCourse.isPending}
        hasCreateError={!!createCourse.error}
        hasUpdateError={!!updateCourse.error}
        hasDeleteError={!!deleteCourse.error}
      />

      <DataTable<Course, unknown>
        config={{
          enableUrlState: true,
          enableDateFilter: true,
          enableColumnFilters: true,
          enableColumnVisibility: true,
          enableExport: true,
          enablePagination: true,
          enableSearch: true,
          enableToolbar: true,
          size: "default",
        }}
        getColumns={(handleRowDeselection) => getColumns(handleAction)}
        fetchDataFn={useCoursesForDataTable}
        idField="id"
        exportConfig={{
          entityName: "courses",
          columnMapping: {
            name: "Course Name",
            description: "Description",
            type: "Course Type",
          },
          columnWidths: [{ wch: 30 }, { wch: 50 }, { wch: 15 }],
          headers: ["Course Name", "Description", "Course Type"],
        }}
        columnFilterOptions={[
          {
            columnId: "type",
            title: "Course Type",
            options: [
              { label: "Core", value: "CORE" },
              { label: "Elective", value: "ELECTIVE" },
              { label: "Micro Credential", value: "MICRO_CREDENTIAL" },
            ],
          },
        ]}
      />

      <CourseDialogs
        selectedCourse={selectedCourse}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        courseToDelete={courseToDelete}
        isDeleting={deleteCourse.isPending}
        onUpdateCourse={handleUpdateCourse}
        onDeleteCourse={handleDeleteCourse}
      />
    </div>
  );
}
