"use client";
import React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useBatches } from "@/components/admin/batch/hooks/use-batch";
import {getColumns} from "@/components/admin/batch/batch-column"
import { Columns } from "lucide-react";

function useBatchesForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  columnFilters?: Record<string, string[]>
) {
  return useBatches(search, page - 1, pageSize, columnFilters, sortBy, sortOrder);
}

useBatchesForDataTable.isQueryHook = true;

export default function BatchesPage() {
  const columsWrapper = () => {
    return getColumns();
  };

  const columnFilterOptions = [
    {
      columnId: "isActive",
      title: "Status",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Batches Management</h1>
      </div>

      <div>
        <DataTable
          config={{
            enableUrlState: true,
            enableDateFilter: true,
            enableColumnFilters: true,
          }}
          exportConfig={{
            entityName: "batches",
            columnMapping: {
              name: "Batch Name",
              batch: "Batch",
              department: "Department",
              section: "Section",
              isActive: "Status",
            },
            columnWidths: [{ wch: 30 }, { wch: 15 }, { wch: 15 }],
            headers: ["Batch Name", "Batch", "Department", "Section", "Status"],
          }}
          getColumns={columsWrapper}
          fetchDataFn={useBatchesForDataTable}
          idField="id"
          columnFilterOptions={columnFilterOptions}
        />
      </div>
    </div>
  );
}
