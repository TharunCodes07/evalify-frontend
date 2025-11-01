"use client";
import { useState, useEffect, useRef, useMemo } from "react";
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
import { QuestionBank, QuestionBankShare } from "@/types/bank";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import bankQueries from "@/repo/bank-queries/bank-queries";
import { Loader2, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useVirtualizer } from "@tanstack/react-virtual";

interface ShareBankDialogProps {
  bank: QuestionBank;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareBankDialog({
  bank,
  isOpen,
  onClose,
}: ShareBankDialogProps) {
  const queryClient = useQueryClient();
  const { error, success } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [permission, setPermission] = useState("EDIT");
  const parentRef = useRef<HTMLDivElement>(null);

  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ["userSearch", searchQuery],
    queryFn: () => bankQueries.searchUsers(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  const { data: shares = [], refetch: refetchShares } = useQuery({
    queryKey: ["bankShares", bank.id],
    queryFn: () => bankQueries.getBankShares(bank.id),
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      refetchShares();
      setSelectedUsers([]);
      setSearchQuery("");
    }
  }, [isOpen, refetchShares]);

  const { mutate: shareBank, isPending: isSharing } = useMutation({
    mutationFn: (data: { userIds: string[]; permission: string }) => {
      return bankQueries.shareBank(bank.id, data);
    },
    onSuccess: () => {
      success("Bank shared successfully!");
      queryClient.invalidateQueries({ queryKey: ["bankShares", bank.id] });
      setSelectedUsers([]);
      setSearchQuery("");
      refetchShares();
    },
    onError: (err: Error) => {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        err.message ||
        "Failed to share bank";
      error(errorMessage);
    },
  });

  const { mutate: removeShare, isPending: isRemoving } = useMutation({
    mutationFn: (userId: string) => {
      return bankQueries.removeShare(bank.id, userId);
    },
    onSuccess: () => {
      success("Share removed successfully!");
      queryClient.invalidateQueries({ queryKey: ["bankShares", bank.id] });
      refetchShares();
    },
    onError: (err: Error) => {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        err.message ||
        "Failed to remove share";
      error(errorMessage);
    },
  });

  const handleShare = () => {
    if (selectedUsers.length > 0) {
      shareBank({ userIds: selectedUsers, permission });
    }
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const alreadySharedIds = shares.map(
    (share: QuestionBankShare) => share.userId,
  );

  const filteredResults = useMemo(
    () =>
      searchResults.filter(
        (user: { id: string }) =>
          !alreadySharedIds.includes(user.id) && user.id !== bank.owner.id,
      ),
    [searchResults, alreadySharedIds, bank.owner.id],
  );

  const virtualizer = useVirtualizer({
    count: filteredResults.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    measureElement: (element: Element) =>
      element.getBoundingClientRect().height,
    overscan: 5,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [filteredResults, virtualizer]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Question Bank</DialogTitle>
          <DialogDescription>
            Share &quot;{bank.name}&quot; with faculty, managers, or admins
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
                  style={{ height: "192px", maxHeight: "192px" }}
                >
                  <div
                    style={{
                      height: `${virtualizer.getTotalSize()}px`,
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                      const user = filteredResults[virtualItem.index] as {
                        id: string;
                        name: string;
                        email: string;
                        role: string;
                      };
                      return (
                        <div
                          key={user.id}
                          ref={virtualizer.measureElement}
                          data-index={virtualItem.index}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            transform: `translateY(${virtualItem.start}px)`,
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

          {shares.length > 0 && (
            <div className="space-y-2">
              <Label>Currently Shared With</Label>
              <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
                {shares.map((share: QuestionBankShare) => (
                  <div
                    key={share.userId}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{share.userName}</div>
                      <div className="text-xs text-muted-foreground">
                        {share.userEmail}
                      </div>
                    </div>
                    <Badge variant="secondary" className="mr-2">
                      {share.permission}
                    </Badge>
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
              `Share with ${selectedUsers.length} user${selectedUsers.length !== 1 ? "s" : ""}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
