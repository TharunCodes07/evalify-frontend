"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCreateLab, useUpdateLab } from "@/repo/lab-queries/lab-queries";
import { Lab } from "@/types/types";

interface LabFormData {
  name: string;
  block: string;
  ipSubnet: string;
}

interface LabDialogProps {
  lab?: Lab;
  isOpen?: boolean;
  onClose?: (open: boolean) => void;
  mode?: "create" | "edit";
}

export function LabDialog({
  lab,
  isOpen: controlledIsOpen,
  onClose,
  mode = "create",
}: LabDialogProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const setIsOpen = onClose ?? setUncontrolledIsOpen;

  const [formData, setFormData] = useState<LabFormData>({
    name: "",
    block: "",
    ipSubnet: "",
  });

  useEffect(() => {
    if (lab && mode === "edit") {
      setFormData({
        name: lab.name ?? "",
        block: lab.block ?? "",
        ipSubnet: lab.ipSubnet ?? "",
      });
    } else if (mode === "create") {
      resetForm();
    }
  }, [lab, mode]);

  const { error, success } = useToast();

  const createLabMutation = useCreateLab();
  const updateLabMutation = useUpdateLab();

  const resetForm = () => {
    setFormData({
      name: "",
      block: "",
      ipSubnet: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      createLabMutation.mutate(formData, {
        onSuccess: () => {
          success("Lab created successfully!");
          resetForm();
          setIsOpen(false);
        },
        onError: (err: Error) => {
          const errorMessage =
            (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message ||
            err.message ||
            "Failed to create lab";
          error(errorMessage);
        },
      });
    } else if (mode === "edit" && lab) {
      updateLabMutation.mutate(
        { ...formData, id: lab.id },
        {
          onSuccess: () => {
            success("Lab updated successfully!");
            setIsOpen(false);
          },
          onError: (err: Error) => {
            const errorMessage =
              (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message ||
              err.message ||
              "Failed to update lab";
            error(errorMessage);
          },
        },
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {controlledIsOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4">
            {mode === "create" ? "Add Lab" : "Edit Lab"}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Lab" : "Edit Lab"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new lab."
              : "Update the lab information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Lab Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Computer Lab 1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="block">Block</Label>
            <Input
              id="block"
              value={formData.block}
              onChange={(e) =>
                setFormData({ ...formData, block: e.target.value })
              }
              placeholder="e.g., Block A"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ipSubnet">IP Subnet</Label>
            <Input
              id="ipSubnet"
              value={formData.ipSubnet}
              onChange={(e) =>
                setFormData({ ...formData, ipSubnet: e.target.value })
              }
              placeholder="e.g., 192.168.1.0/24"
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={
                createLabMutation.isPending || updateLabMutation.isPending
              }
            >
              {mode === "create" ? "Create Lab" : "Update Lab"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
