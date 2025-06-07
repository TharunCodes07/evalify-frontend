"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { DataTable } from "@/components/data-table/data-table";
import {
  useBatchById,
  useBatchStudents,
} from "@/components/admin/batch/hooks/use-batch";
import { getStudentColumns } from "@/components/admin/batch/batch-student-column";
import { User } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";

export default function BatchDetailsPage() {
  const params = useParams();
  const batchId = params.batchId as string;
  const { status: sessionStatus } = useSession();

  const {
    data: batch,
    isLoading: isBatchLoading,
    isError: isBatchError,
  } = useBatchById(batchId);

  function useBatchStudentsForDataTable(
    page: number,
    pageSize: number,
    search: string,
    dateRange: { from_date: string; to_date: string },
    sortBy: string,
    sortOrder: string,
    columnFilters?: Record<string, string[]>
  ) {
    return useBatchStudents(batchId, search, page - 1, pageSize);
  }
  useBatchStudentsForDataTable.isQueryHook = true;

  const columnsWrapper = (): ColumnDef<User>[] => {
    return getStudentColumns();
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
        />
      </div>
    </div>
  );
}
