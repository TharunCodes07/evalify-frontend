import { useState, useEffect, useCallback } from "react";
import { AttemptSummary, ExtensionRequest } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, User, Mail, AlertTriangle, Plus } from "lucide-react";
import { ExtensionDialog } from "./extension-dialog";
import { formatDistanceToNow, isAfter } from "date-fns";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

interface ExtensionsTableProps {
  attempts: AttemptSummary[];
  isLoading: boolean;
  onGrantExtension: (attemptId: string, request: ExtensionRequest) => void;
  isGrantingExtension: boolean;
}

export function ExtensionsTable({
  attempts,
  isLoading,
  onGrantExtension,
  isGrantingExtension,
}: ExtensionsTableProps) {
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(
    null,
  );

  const virtualizer = useWindowVirtualizer({
    count: attempts.length,
    estimateSize: () => 200,
    overscan: 3,
    getItemKey: (i) => attempts[i]?.attemptId ?? i,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [attempts.length, virtualizer]);

  const measureRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) virtualizer.measureElement(el);
    },
    [virtualizer],
  );

  const handleGrantExtension = (request: ExtensionRequest) => {
    if (selectedAttemptId) {
      onGrantExtension(selectedAttemptId, request);
      setSelectedAttemptId(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "submitted":
        return "secondary";
      case "timeout":
        return "destructive";
      default:
        return "outline";
    }
  };

  const isOverdue = (mustSubmitBy: string) => {
    return isAfter(new Date(), new Date(mustSubmitBy));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="text-center py-20">
        <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No active attempts</h3>
        <p className="text-muted-foreground">
          There are currently no active quiz attempts that need extensions.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Showing {attempts.length} active{" "}
          {attempts.length === 1 ? "attempt" : "attempts"}
        </div>

        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((vi) => {
            const attempt = attempts[vi.index];
            return (
              <div
                key={attempt.attemptId}
                ref={measureRef}
                data-index={vi.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${vi.start}px)`,
                }}
              >
                <div className="pb-4">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {attempt.studentName || "Unknown Student"}
                            </span>
                            <Badge variant={getStatusVariant(attempt.status)}>
                              {attempt.status}
                            </Badge>
                            {attempt.violationCount > 0 && (
                              <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {attempt.violationCount} violations
                              </Badge>
                            )}
                            {isOverdue(attempt.mustSubmitBy) && (
                              <Badge variant="destructive">Overdue</Badge>
                            )}
                          </div>
                          {attempt.studentEmail && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {attempt.studentEmail}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedAttemptId(attempt.attemptId)
                          }
                          disabled={isGrantingExtension}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Grant Extension
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">
                            Started At
                          </div>
                          <div className="font-medium">
                            {new Date(attempt.startedAt).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(attempt.startedAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>

                        <div>
                          <div className="text-muted-foreground mb-1">
                            Must Submit By
                          </div>
                          <div className="font-medium">
                            {new Date(attempt.mustSubmitBy).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(attempt.mustSubmitBy),
                              {
                                addSuffix: true,
                              },
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="text-muted-foreground mb-1">
                            Extensions
                          </div>
                          <div className="font-medium">
                            {attempt.extensionMinutes > 0 ? (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {attempt.extensionMinutes} minutes
                              </div>
                            ) : (
                              "None"
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="text-muted-foreground mb-1">
                            Attempt ID
                          </div>
                          <div className="font-mono text-xs bg-muted px-2 py-1 rounded">
                            {attempt.attemptId.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ExtensionDialog
        isOpen={!!selectedAttemptId}
        onClose={() => setSelectedAttemptId(null)}
        onGrantExtension={handleGrantExtension}
        isLoading={isGrantingExtension}
      />
    </>
  );
}
