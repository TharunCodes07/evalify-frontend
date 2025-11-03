"use client";
import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { QuizListResponse, QuizShare } from "@/types/quiz";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import quizQueries from "@/repo/quiz-queries/quiz-queries";
import { Loader2, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useVirtualizer } from "@tanstack/react-virtual";

interface ShareQuizDialogProps {
  quiz: QuizListResponse;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareQuizDialog({
  quiz,
  isOpen,
  onClose,
}: ShareQuizDialogProps) {
  const queryClient = useQueryClient();
  const { error, success } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [permission, setPermission] = useState("EDIT");

  // --- Queries ---
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ["userSearch", searchQuery],
    queryFn: () => quizQueries.searchUsers(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  const { data: shares = [] } = useQuery({
    queryKey: ["quizShares", quiz.id],
    queryFn: () => quizQueries.getQuizShares(quiz.id),
    enabled: isOpen,
  });

  // --- Mutations ---
  const { mutate: shareQuiz, isPending: isSharing } = useMutation({
    mutationFn: async (data: { userIds: string[]; permission: string }) => {
      return await quizQueries.shareQuiz(quiz.id, {
        userIds: data.userIds,
        permission: data.permission as "VIEW" | "EDIT",
      });
    },
    onSuccess: () => {
      success("Quiz shared successfully!");
      queryClient.invalidateQueries({ queryKey: ["quizShares", quiz.id] });
      setSelectedUsers([]);
      setSearchQuery("");
    },
    onError: (err: Error) => {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        err.message ||
        "Failed to share quiz";
      error(msg);
    },
  });

  const { mutate: removeShare, isPending: isRemoving } = useMutation({
    mutationFn: (userId: string) => quizQueries.removeShare(quiz.id, userId),
    onSuccess: () => {
      success("Share removed successfully!");
      queryClient.invalidateQueries({ queryKey: ["quizShares", quiz.id] });
    },
    onError: (err: Error) => {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        err.message ||
        "Failed to remove share";
      error(msg);
    },
  });

  const { mutate: updatePermission, isPending: isUpdating } = useMutation({
    mutationFn: ({
      userId,
      permission,
    }: {
      userId: string;
      permission: "VIEW" | "EDIT";
    }) => quizQueries.updateSharePermission(quiz.id, userId, permission),
    onSuccess: () => {
      success("Permission updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["quizShares", quiz.id] });
    },
    onError: (err: Error) => {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        err.message ||
        "Failed to update permission";
      error(msg);
    },
  });

  // --- Handlers ---
  const handleShare = () => {
    if (selectedUsers.length === 0) return;
    shareQuiz({ userIds: selectedUsers, permission });
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  // --- Memos to prevent cascades ---
  const alreadySharedIds = useMemo(
    () => shares.map((s: QuizShare) => s.userId),
    [shares],
  );

  const filteredResults = useMemo(
    () =>
      searchResults.filter(
        (u: { id: string }) =>
          !alreadySharedIds.includes(u.id) && u.id !== quiz.createdBy.id,
      ),
    [searchResults, alreadySharedIds, quiz.createdBy.id],
  );

  // --- Virtualizer with dynamic sizing ---
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredResults.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 8,
    getItemKey: (index) => {
      const item = filteredResults[index];
      return item && typeof item === "object" && "id" in item
        ? (item.id as string | number)
        : index;
    },
    measureElement: (el: Element) =>
      (el as HTMLElement).getBoundingClientRect().height,
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Quiz</DialogTitle>
          <DialogDescription>
            Share &quot;{quiz.title}&quot; with faculty, managers, or admins
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Users</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Virtualized search results */}
          {searchQuery.length >= 2 && (
            <div className="border rounded-md overflow-hidden">
              {isSearching ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : filteredResults.length > 0 ? (
                <div
                  ref={parentRef}
                  className="overflow-y-auto"
                  style={{ height: 192, maxHeight: 192 }}
                >
                  <div
                    style={{
                      height: virtualizer.getTotalSize(),
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {virtualizer.getVirtualItems().map((vi) => {
                      const user = filteredResults[vi.index] as {
                        id: string;
                        name: string;
                        email: string;
                        role: string;
                      };

                      return (
                        <div
                          key={user.id}
                          ref={virtualizer.measureElement} // dynamic size hook
                          data-index={vi.index} // required for measuring
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            transform: `translateY(${vi.start}px)`,
                          }}
                        >
                          <div
                            className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer mx-2"
                            onClick={() => toggleUser(user.id)}
                          >
                            <div className="flex-1">
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                            <Badge variant="outline">{user.role}</Badge>
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUser(user.id)}
                              className="ml-2 rounded border-gray-300 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No users found
                </div>
              )}
            </div>
          )}

          {/* Permission picker */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <Label>Permission Level</Label>
              <Select value={permission} onValueChange={setPermission}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EDIT">
                    Edit - Can view and modify
                  </SelectItem>
                  <SelectItem value="VIEW">View - Read only access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Current shares */}
          {shares.length > 0 && (
            <div className="space-y-2">
              <Label>Currently Shared With</Label>
              <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
                {shares.map((share: QuizShare) => (
                  <div
                    key={share.userId}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {share.userName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {share.userEmail}
                      </div>
                    </div>
                    <Select
                      value={share.permission}
                      onValueChange={(newPermission) =>
                        updatePermission({
                          userId: share.userId,
                          permission: newPermission as "VIEW" | "EDIT",
                        })
                      }
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EDIT">Edit</SelectItem>
                        <SelectItem value="VIEW">View</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeShare(share.userId)}
                      disabled={isRemoving}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={handleShare}
            disabled={selectedUsers.length === 0 || isSharing}
          >
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              `Share with ${selectedUsers.length} user${
                selectedUsers.length !== 1 ? "s" : ""
              }`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
