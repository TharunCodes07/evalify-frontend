"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import bankQueries from "@/repo/bank-queries/bank-queries";
import { DeleteDialog } from "@/components/ui/delete-dialog";

interface DeleteBankDialogProps {
  bankId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteBankDialog({
  bankId,
  isOpen,
  onClose,
}: DeleteBankDialogProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate: deleteBank, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      return bankQueries.deleteBank(bankId);
    },
    onSuccess: () => {
      toast.success("Bank deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      onClose();
    },
    onError: (error: Error) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        (error as { response?: { data?: string } }).response?.data ||
        error.message ||
        "Failed to delete bank";
      toast.error(errorMessage);
    },
  });

  return (
    <DeleteDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => deleteBank()}
      title="Delete Question Bank"
      description="Are you sure you want to delete this question bank? This action cannot be undone and will also delete all questions in this bank."
      isLoading={isDeleting}
    />
  );
}
