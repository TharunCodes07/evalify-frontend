"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { semesterQueries } from "@/components/admin/semesters/queries/semester-queries";
import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "@/components/admin/semesters/semester-columns";
import { Semester } from "@/types/types";
import { SemesterHeader } from "@/components/admin/semesters/semester-header";
import { SemesterAlerts } from "@/components/admin/semesters/semester-alerts";
import { SemesterDialogs } from "@/components/admin/semesters/semester-dialogs";

function useSemestersForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  columnFilters?: Record<string, string[]>
) {
  return semesterQueries.useGetSemesters(
    search,
    page - 1,
    pageSize,
    columnFilters
  );
}

useSemestersForDataTable.isQueryHook = true;

export default function SemesterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSemester, setSelectedSemester] = React.useState<Semester | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [semesterToDelete, setSemesterToDelete] = React.useState<Semester | null>(null);

  const createSemester = semesterQueries.useCreateSemester();
  const updateSemester = semesterQueries.useUpdateSemester();
  const deleteSemester = semesterQueries.useDeleteSemester();

  const handleAction = (semester: Semester, action: string) => {
    switch (action) {
      case "view":
        router.push(`/semester/${semester.id}`);
        break;
      case "schedules":
        router.push(`/semester/${semester.id}/schedules`);
        break;
      case "settings":
        router.push(`/semester/${semester.id}/settings`);
        break;
      case "edit":
        setSelectedSemester(semester);
        setIsEditDialogOpen(true);
        break;
      case "delete":
        setSemesterToDelete(semester);
        setIsDeleteDialogOpen(true);
        break;
    }
  };

  const handleCreateSemester = async (data: Omit<Semester, "id">) => {
    try {
      await createSemester.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating semester:", error);
    }
  };

  const handleUpdateSemester = async (data: Omit<Semester, "id">) => {
    if (!selectedSemester) return;
    try {
      await updateSemester.mutateAsync({
        id: selectedSemester.id,
        name: data.name as string,
        year: data.year as number,
        isActive: data.isActive as boolean,
      });
      setIsEditDialogOpen(false);
      setSelectedSemester(null);
    } catch (error) {
      console.error("Error updating semester:", error);
    }
  };

  const handleDeleteSemester = async () => {
    if (!semesterToDelete) return;
    try {
      await deleteSemester.mutateAsync(semesterToDelete.id);
      setIsDeleteDialogOpen(false);
      setSemesterToDelete(null);
    } catch (error) {
      console.error("Error deleting semester:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <SemesterHeader
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        onCreateSemester={handleCreateSemester}
      />

      <SemesterAlerts
        isCreating={createSemester.isPending}
        isUpdating={updateSemester.isPending}
        isDeleting={deleteSemester.isPending}
        hasCreateError={!!createSemester.error}
        hasUpdateError={!!updateSemester.error}
        hasDeleteError={!!deleteSemester.error}
      />

      <DataTable<Semester, unknown>
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
        fetchDataFn={useSemestersForDataTable}
        idField="id"
        exportConfig={{
          entityName: "semesters",
          columnMapping: {
            name: "Semester Name",
            year: "Year",
            isActive: "Status",
          },
          columnWidths: [{ wch: 30 }, { wch: 15 }, { wch: 15 }],
          headers: ["Semester Name", "Year", "Status"],
        }}
        columnFilterOptions={[
          {
            columnId: "isActive",
            title: "Status",
            options: [
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ],
          },
        ]}
      />

      <SemesterDialogs
        selectedSemester={selectedSemester}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        semesterToDelete={semesterToDelete}
        isDeleting={deleteSemester.isPending}
        onUpdateSemester={handleUpdateSemester}
        onDeleteSemester={handleDeleteSemester}
      />
    </div>
  );
}
