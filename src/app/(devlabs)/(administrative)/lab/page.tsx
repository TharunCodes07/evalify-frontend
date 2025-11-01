"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useLabs } from "@/components/admin/lab/hooks/use-lab";
import { getColumns } from "@/components/admin/lab/lab-column";
import { LabDialog } from "@/components/admin/lab/lab-dialog";
import { DeleteLabDialog } from "@/components/admin/lab/delete-lab-dialog";
import { Lab } from "@/types/types";

function useLabsForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  columnFilters?: Record<string, string[]>,
) {
  return useLabs(
    search,
    page - 1,
    pageSize,
    columnFilters,
    sortBy,
    sortOrder as "asc" | "desc",
  );
}

useLabsForDataTable.isQueryHook = true;

export default function LabsPage() {
  const [selectedLab, setSelectedLab] = useState<Lab | undefined>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [labToDelete, setLabToDelete] = useState<string | null>(null);

  const handleEdit = (lab: Lab) => {
    setSelectedLab(lab);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (labId: string) => {
    setLabToDelete(labId);
    setIsDeleteDialogOpen(true);
  };

  const columnsWrapper = () => {
    return getColumns(handleEdit, handleDelete);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Labs Management</h1>
        <LabDialog mode="create" />
      </div>

      <div>
        <DataTable
          config={{
            enableUrlState: true,
            enableDateFilter: false,
            enableColumnFilters: false,
          }}
          exportConfig={{
            entityName: "labs",
            columnMapping: {
              name: "Lab Name",
              block: "Block",
              ipSubnet: "IP Subnet",
            },
            columnWidths: [{ wch: 30 }, { wch: 20 }, { wch: 25 }],
            headers: ["name", "block", "ipSubnet"],
          }}
          getColumns={columnsWrapper}
          fetchDataFn={useLabsForDataTable}
          idField="id"
        />
      </div>

      {selectedLab && (
        <LabDialog
          lab={selectedLab}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedLab(undefined);
          }}
          mode="edit"
        />
      )}

      {labToDelete && (
        <DeleteLabDialog
          labId={labToDelete}
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setLabToDelete(null);
          }}
        />
      )}
    </div>
  );
}
