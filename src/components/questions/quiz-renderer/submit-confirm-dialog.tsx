import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Flag, AlertTriangle } from "lucide-react";

interface SubmitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  answeredCount: number;
  totalQuestions: number;
  markedCount: number;
}

export function SubmitConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  answeredCount,
  totalQuestions,
  markedCount,
}: SubmitConfirmDialogProps) {
  const unansweredCount = totalQuestions - answeredCount - markedCount;
  const completionPercentage = Math.round(
    (answeredCount / totalQuestions) * 100,
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-xl font-semibold">
            Confirm Submission
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Please review your quiz completion before final submission.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">
              {completionPercentage}%
            </div>
            <p className="text-sm text-muted-foreground">Quiz Completion</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="font-medium">Answered</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                {answeredCount}
              </Badge>
            </div>

            {markedCount > 0 && (
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                <div className="flex items-center gap-3">
                  <Flag className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">Marked for Review</span>
                </div>
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  {markedCount}
                </Badge>
              </div>
            )}

            {unansweredCount > 0 && (
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium">Unanswered</span>
                </div>
                <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                  {unansweredCount}
                </Badge>
              </div>
            )}
          </div>

          {unansweredCount > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Notice: {unansweredCount} question
                {unansweredCount > 1 ? "s remain" : " remains"} unanswered. You
                may lose marks for incomplete responses.
              </p>
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            This action is final and cannot be reversed.
          </div>
        </div>

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="flex-1">
            Continue Quiz
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Submit Quiz
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
