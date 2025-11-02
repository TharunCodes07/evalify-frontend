"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  X,
  Tag,
  Trash2,
  ListFilter,
  Edit,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface TopicsFilterDrawerProps {
  topics: string[];
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
  onAddTopic: (topic: string) => Promise<void>;
  onUpdateTopic: (oldTopic: string, newTopic: string) => Promise<void>;
  onDeleteTopic: (topic: string) => Promise<void>;
  onFilterChange: (filter: "all" | "none" | string[]) => void;
  currentFilter: "all" | "none" | string[];
  canEdit?: boolean;
}

export function TopicsFilterDrawer({
  topics,
  selectedTopics,
  onTopicsChange,
  onAddTopic,
  onUpdateTopic,
  onDeleteTopic,
  onFilterChange,
  currentFilter,
  canEdit = false,
}: TopicsFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null);
  const [topicToEdit, setTopicToEdit] = useState<string | null>(null);
  const [editedTopicName, setEditedTopicName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { toast, success } = useToast();

  const handleAddTopic = async () => {
    if (!newTopic.trim()) {
      toast("Please enter a topic name");
      return;
    }

    if (topics.includes(newTopic.trim())) {
      toast("Topic already exists");
      return;
    }

    setIsAdding(true);
    try {
      await onAddTopic(newTopic.trim());
      success("Topic added successfully");
      setNewTopic("");
    } catch (error) {
      const err = error as { message?: string };
      toast(err.message || "Failed to add topic");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTopic = async (topic: string) => {
    try {
      await onDeleteTopic(topic);
      success("Topic deleted successfully");
      setTopicToDelete(null);

      // Remove from filter if selected
      if (Array.isArray(currentFilter) && currentFilter.includes(topic)) {
        const newFilter = currentFilter.filter((t) => t !== topic);
        if (newFilter.length === 0) {
          onFilterChange("all");
        } else {
          onFilterChange(newFilter);
        }
      }
    } catch (error) {
      const err = error as { message?: string };
      toast(
        err.message || "Failed to delete topic. It may be in use by questions.",
      );
    }
  };

  const handleTopicToggle = (topic: string) => {
    let newSelection: string[];
    if (selectedTopics.includes(topic)) {
      newSelection = selectedTopics.filter((t) => t !== topic);
    } else {
      newSelection = [...selectedTopics, topic];
    }
    onTopicsChange(newSelection);
  };

  const handleEditTopic = (oldTopic: string) => {
    setTopicToEdit(oldTopic);
    setEditedTopicName(oldTopic);
  };

  const handleSaveEdit = async () => {
    if (!editedTopicName.trim() || !topicToEdit) return;

    if (editedTopicName === topicToEdit) {
      setTopicToEdit(null);
      return;
    }

    if (topics.includes(editedTopicName.trim())) {
      toast("Topic already exists");
      return;
    }

    try {
      await onUpdateTopic(topicToEdit, editedTopicName.trim());
      success("Topic updated successfully");
      setTopicToEdit(null);

      // Update filter if the old topic was selected
      if (Array.isArray(currentFilter) && currentFilter.includes(topicToEdit)) {
        const newFilter = currentFilter.map((t) =>
          t === topicToEdit ? editedTopicName.trim() : t,
        );
        onFilterChange(newFilter);
      }

      // Update selected topics
      if (selectedTopics.includes(topicToEdit)) {
        const newSelection = selectedTopics.map((t) =>
          t === topicToEdit ? editedTopicName.trim() : t,
        );
        onTopicsChange(newSelection);
      }
    } catch (error) {
      const err = error as { message?: string };
      toast(err.message || "Failed to update topic");
    }
  };

  const handleApplyFilter = () => {
    if (selectedTopics.length === 0) {
      onFilterChange("all");
    } else {
      onFilterChange(selectedTopics);
    }
    setOpen(false);
  };

  const handleClearFilter = () => {
    onTopicsChange([]);
    onFilterChange("all");
    setOpen(false);
  };

  const handleFilterNoTopic = () => {
    onTopicsChange([]);
    onFilterChange("none");
    setOpen(false);
  };

  const getFilterLabel = () => {
    if (currentFilter === "all") return "All Questions";
    if (currentFilter === "none") return "No Topic";
    if (Array.isArray(currentFilter)) {
      return `${currentFilter.length} Topic${currentFilter.length > 1 ? "s" : ""}`;
    }
    return "Filter";
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <ListFilter className="h-4 w-4" />
            {getFilterLabel()}
            {currentFilter !== "all" && (
              <Badge variant="secondary" className="ml-1">
                Active
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md px-6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Manage Topics & Filter
            </SheetTitle>
            <SheetDescription>
              Select topics to filter questions, or manage your topics below.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100vh-12rem)] mt-6">
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {/* Filter Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Filter Options
                  </Label>
                  <div className="space-y-2">
                    <Button
                      variant={currentFilter === "all" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={handleClearFilter}
                    >
                      All Questions
                    </Button>
                    <Button
                      variant={currentFilter === "none" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={handleFilterNoTopic}
                    >
                      Questions with No Topic
                    </Button>
                  </div>
                </div>

                {/* Topic Selection */}
                {topics.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                      Select Topics ({selectedTopics.length} selected)
                    </Label>
                    <div className="space-y-2">
                      {topics.map((topic) => (
                        <div key={topic}>
                          {topicToEdit === topic ? (
                            <div className="flex items-center gap-2 p-2 rounded-lg border">
                              <Input
                                value={editedTopicName}
                                onChange={(e) =>
                                  setEditedTopicName(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit();
                                  if (e.key === "Escape") setTopicToEdit(null);
                                }}
                                className="h-8"
                                autoFocus
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSaveEdit}
                                className="h-8 w-8 p-0"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTopicToEdit(null)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => handleTopicToggle(topic)}
                            >
                              <div className="flex items-center gap-2 flex-1 pointer-events-none">
                                <Checkbox
                                  id={`topic-${topic}`}
                                  checked={selectedTopics.includes(topic)}
                                />
                                <Label
                                  htmlFor={`topic-${topic}`}
                                  className="cursor-pointer flex-1"
                                >
                                  {topic}
                                </Label>
                              </div>
                              {canEdit && (
                                <div className="flex gap-1 pointer-events-auto">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditTopic(topic);
                                    }}
                                    className="h-8 w-8 p-0 hover:bg-muted"
                                    title="Edit topic"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTopicToDelete(topic);
                                    }}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    title="Delete topic"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {topics.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No topics yet. Add your first topic below!</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Add Topic Section */}
            {canEdit && (
              <div className="border-t pt-4 mt-4 space-y-3">
                <Label className="text-sm font-semibold">Add New Topic</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter topic name..."
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                  />
                  <Button
                    onClick={handleAddTopic}
                    disabled={isAdding || !newTopic.trim()}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
            )}

            {/* Apply Filter Button */}
            {selectedTopics.length > 0 && (
              <Button onClick={handleApplyFilter} className="w-full mt-3">
                Apply Filter
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={topicToDelete !== null}
        onOpenChange={(open) => !open && setTopicToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Topic</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the topic &quot;{topicToDelete}
              &quot;? This action cannot be undone. Questions using this topic
              will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => topicToDelete && handleDeleteTopic(topicToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
