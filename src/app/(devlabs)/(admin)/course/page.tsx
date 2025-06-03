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
  return useBatches(search, page - 1, pageSize, columnFilters);
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
        <h1 className="text-2xl font-bold">Courses Management</h1>
      </div>

      <div>
        <DataTable
          config={{
            enableUrlState: false,
            enableDateFilter: true,
            enableColumnFilters: true,
          }}
          exportConfig={{
            entityName: "course",
            columnMapping: {
              name: "Course Name",
              type: "Course Type",
            },
            columnWidths: [{ wch: 30 }, { wch: 15 }],
            headers: ["Course Name", "Course Type"],
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
