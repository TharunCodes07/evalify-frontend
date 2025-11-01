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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { QuestionBank } from "@/types/bank";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import bankQueries from "@/repo/bank-queries/bank-queries";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BankFormData {
  name: string;
  description: string;
  topics: string[];
  isPublic: boolean;
}

interface BankDialogProps {
  bank?: QuestionBank;
  isOpen?: boolean;
  onClose?: (open: boolean) => void;
  mode?: "create" | "edit";
}

export function BankDialog({
  bank,
  isOpen: controlledIsOpen,
  onClose,
  mode = "create",
}: BankDialogProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const setIsOpen = onClose ?? setUncontrolledIsOpen;
  const queryClient = useQueryClient();
  const { error, success } = useToast();

  const [formData, setFormData] = useState<BankFormData>({
    name: "",
    description: "",
    topics: [],
    isPublic: false,
  });
  const [topicInput, setTopicInput] = useState("");

  useEffect(() => {
    if (bank && mode === "edit") {
      setFormData({
        name: bank.name ?? "",
        description: bank.description ?? "",
        topics: bank.topics ?? [],
        isPublic: bank.isPublic ?? false,
      });
    } else if (mode === "create") {
      resetForm();
    }
  }, [bank, mode]);

  const { mutate: createBank, isPending: isCreating } = useMutation({
    mutationFn: (data: BankFormData) => {
      return bankQueries.createBank(data);
    },
    onSuccess: () => {
      success("Bank created successfully!");
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      resetForm();
      setIsOpen(false);
    },
    onError: (err: Error) => {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        err.message ||
        "Failed to create bank";
      error(errorMessage);
    },
  });

  const { mutate: updateBank, isPending: isUpdating } = useMutation({
    mutationFn: (data: BankFormData & { id: string }) => {
      return bankQueries.updateBank(data);
    },
    onSuccess: () => {
      success("Bank updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      setIsOpen(false);
    },
    onError: (err: Error) => {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        err.message ||
        "Failed to update bank";
      error(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      topics: [],
      isPublic: false,
    });
    setTopicInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      createBank(formData);
    } else if (mode === "edit" && bank) {
      updateBank({ ...formData, id: bank.id });
    }
  };

  const handleAddTopic = () => {
    if (topicInput.trim() && !formData.topics.includes(topicInput.trim())) {
      setFormData({
        ...formData,
        topics: [...formData.topics, topicInput.trim()],
      });
      setTopicInput("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter((t) => t !== topic),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTopic();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {controlledIsOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4">
            {mode === "create" ? "Add Bank" : "Edit Bank"}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Question Bank" : "Edit Question Bank"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new question bank."
              : "Update the question bank information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bank Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Data Structures Question Bank"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the question bank"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topics">Topics</Label>
            <div className="flex gap-2">
              <Input
                id="topics"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a topic and press Enter"
              />
              <Button
                type="button"
                onClick={handleAddTopic}
                variant="secondary"
              >
                Add
              </Button>
            </div>
            {formData.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="gap-1">
                    {topic}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTopic(topic)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="isPublic">Bank Type</Label>
            <Select
              value={formData.isPublic ? "true" : "false"}
              onValueChange={(value) =>
                setFormData({ ...formData, isPublic: value === "true" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Public</SelectItem>
                <SelectItem value="false">Private</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Public banks are visible to all managers. Private banks are only
              visible to you and users you share with.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {mode === "create" ? "Create Bank" : "Update Bank"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
