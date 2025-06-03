"use client";
import React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "@/components/admin/semesters/semester-columns";
import { useSemesters } from "@/components/admin/semesters/hooks/use-semesters";

function useSemestersForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  columnFilters?: Record<string, string[]>
) {
  return useSemesters(search, page - 1, pageSize, columnFilters);
}

useSemestersForDataTable.isQueryHook = true;

export default function SemestersPage() {
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
        <h1 className="text-2xl font-bold">Semesters Management</h1>
      </div>

      <div>
        <DataTable
          config={{
            enableUrlState: false,
            enableDateFilter: true,
            enableColumnFilters: true,
          }}
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
          getColumns={columsWrapper}
          fetchDataFn={useSemestersForDataTable}
          idField="id"
          columnFilterOptions={columnFilterOptions}
        />
      </div>
    </div>
  );
}
