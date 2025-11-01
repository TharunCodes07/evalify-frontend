"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import labQueries from "@/repo/lab-queries/lab-queries";
import { Loader2 } from "lucide-react";

interface DeleteLabDialogProps {
  labId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteLabDialog({
  labId,
  isOpen,
  onClose,
}: DeleteLabDialogProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate: deleteLab, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      return labQueries.deleteLab(labId);
    },
    onSuccess: () => {
      toast.success("Lab deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["labs"] });
      onClose();
    },
    onError: (error: Error) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        (error as { response?: { data?: string } }).response?.data ||
        error.message ||
        "Failed to delete lab";
      toast.error(errorMessage);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Lab</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this lab? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => deleteLab()}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
