"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import {
  useBatchById,
  useBatchStudents,
} from "@/components/admin/batch/hooks/use-batch";
import { getStudentColumns } from "@/components/admin/batch/batch-student-column";
import { User } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { AssignStudentToBatchDialog } from "@/components/admin/batch/assign-student-dialog";
import { useQueryClient } from "@tanstack/react-query";

export default function BatchDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const batchId = params.batchId as string;
  const queryClient = useQueryClient();

  const [isAssignStudentDialogOpen, setIsAssignStudentDialogOpen] =
    useState(false);

  const { data: batch, isError: isBatchError } = useBatchById(batchId);

  function useBatchStudentsForDataTable(
    page: number,
    pageSize: number,
    search: string,
    _dateRange: { from_date: string; to_date: string },
    _sortBy: string,
    _sortOrder: string,
    _columnFilters?: Record<string, string[]>
  ) {
    return useBatchStudents(batchId, search, page - 1, pageSize);
  }
  useBatchStudentsForDataTable.isQueryHook = true;

  const columnsWrapper = (): ColumnDef<User>[] => {
    return getStudentColumns();
  };

  const handleRowClick = (row: User) => {
    router.push(`/user/${row.id}`);
  };

  if (isBatchError) {
    return (
      <div className="p-4 text-red-500">
        Error loading batch details or batch not found.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Students in {batch ? batch.name : "..."}
        </h1>
        <Button onClick={() => setIsAssignStudentDialogOpen(true)}>
          Assign Student
        </Button>
      </div>

      <div>
        <DataTable
          key={batchId}
          config={{
            enableUrlState: true,
            enableColumnFilters: false,
            enableDateFilter: false,
            enableDelete: false,
          }}
          exportConfig={{
            entityName: "students",
            columnMapping: {
              name: "Name",
              email: "Email",
              phoneNumber: "Phone Number",
            },
            columnWidths: [{ wch: 30 }, { wch: 30 }, { wch: 20 }],
            headers: ["Name", "Email", "Phone Number"],
          }}
          getColumns={columnsWrapper}
          fetchDataFn={useBatchStudentsForDataTable}
          idField="id"
          onRowClick={handleRowClick}
        />
      </div>
      {batchId && (
        <AssignStudentToBatchDialog
          isOpen={isAssignStudentDialogOpen}
          onClose={() => setIsAssignStudentDialogOpen(false)}
          batchId={batchId}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ["batchStudents", batchId],
            });
          }}
        />
      )}
    </div>
  );
}
