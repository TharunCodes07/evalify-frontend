"use client";
import React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "@/components/admin/users/user-columns";
import { useUsers } from "@/components/admin/users/hooks/use-users";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { UserDialog } from "./user-dialog";

function useUsersForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  columnFilters?: Record<string, string[]>
) {
  return useUsers(search, page - 1, pageSize, columnFilters);
}

useUsersForDataTable.isQueryHook = true;

export default function UsersPage() {
  const columsWrapper = () => {
    return getColumns();
  };
  const columnFilterOptions = [
    {
      columnId: "role",
      title: "Role",
      options: [
        { label: "Student", value: "STUDENT" },
        { label: "Admin", value: "ADMIN" },
        { label: "Faculty", value: "FACULTY" },
        { label: "Manager", value: "MANAGER" },
      ],
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>

      <div>
      <UserDialog />
        <DataTable
          config={{
            enableUrlState: false,
            enableDateFilter: false,
            enableColumnFilters: true,
          }}
          exportConfig={{
            entityName: "users",
            columnMapping: {},
            columnWidths: [],
            headers: [],
          }}
          getColumns={columsWrapper}
          fetchDataFn={useUsersForDataTable}
          idField="id"
          columnFilterOptions={columnFilterOptions}
        />
      </div>
    </div>
  );
}
