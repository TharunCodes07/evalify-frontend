"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useBanks } from "@/components/bank/bank/hooks/use-bank";
import { getColumns } from "@/components/bank/bank/bank-column";
import { BankDialog } from "@/components/bank/bank/bank-dialog";
import { DeleteBankDialog } from "@/components/bank/bank/delete-bank-dialog";
import { ShareBankDialog } from "@/components/bank/bank/share-bank-dialog";
import { QuestionBank } from "@/types/bank";

function useBanksForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  columnFilters?: Record<string, string[]>,
) {
  return useBanks(
    search,
    page - 1,
    pageSize,
    columnFilters,
    sortBy,
    sortOrder as "asc" | "desc",
  );
}

useBanksForDataTable.isQueryHook = true;

export default function BanksPage() {
  const [selectedBank, setSelectedBank] = useState<QuestionBank | undefined>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<string | null>(null);
  const [bankToShare, setBankToShare] = useState<QuestionBank | null>(null);

  const handleEdit = (bank: QuestionBank) => {
    setSelectedBank(bank);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (bankId: string) => {
    setBankToDelete(bankId);
    setIsDeleteDialogOpen(true);
  };

  const handleShare = (bank: QuestionBank) => {
    setBankToShare(bank);
    setIsShareDialogOpen(true);
  };

  const columnsWrapper = () => {
    return getColumns(handleEdit, handleDelete, handleShare);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Question Banks Management</h1>
        <BankDialog mode="create" />
      </div>

      <div>
        <DataTable
          config={{
            enableUrlState: true,
            enableDateFilter: false,
            enableColumnFilters: false,
          }}
          exportConfig={{
            entityName: "question-banks",
            columnMapping: {
              name: "Bank Name",
              "owner.name": "Owner",
              isPublic: "Type",
              topics: "Topics",
            },
            columnWidths: [{ wch: 35 }, { wch: 25 }, { wch: 15 }, { wch: 30 }],
            headers: ["name", "owner.name", "isPublic", "topics"],
          }}
          getColumns={columnsWrapper}
          fetchDataFn={useBanksForDataTable}
          idField="id"
        />
      </div>

      {selectedBank && (
        <BankDialog
          bank={selectedBank}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedBank(undefined);
          }}
          mode="edit"
        />
      )}

      {bankToDelete && (
        <DeleteBankDialog
          bankId={bankToDelete}
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setBankToDelete(null);
          }}
        />
      )}

      {bankToShare && (
        <ShareBankDialog
          bank={bankToShare}
          isOpen={isShareDialogOpen}
          onClose={() => {
            setIsShareDialogOpen(false);
            setBankToShare(null);
          }}
        />
      )}
    </div>
  );
}
