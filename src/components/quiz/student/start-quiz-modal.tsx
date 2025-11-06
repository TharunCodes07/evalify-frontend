"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Lock, PlayCircle } from "lucide-react";
import type { LiveQuiz } from "@/types/quiz";
import studentQuizAPI from "@/repo/quiz-queries/student-quiz-queries";
import { useState, useEffect } from "react";

interface StartQuizModalProps {
  quiz: LiveQuiz | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password?: string) => void;
  isStarting?: boolean;
}

export function StartQuizModal({
  quiz,
  open,
  onOpenChange,
  onConfirm,
  isStarting = false,
}: StartQuizModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setPassword("");
      setError("");
      setIsValidating(false);
    }
  }, [open]);

  if (!quiz) return null;

  const handleConfirm = async () => {
    // If password protected, validate password with backend
    if (quiz.isPasswordProtected) {
      if (!password.trim()) {
        setError("Please enter the quiz password");
        return;
      }

      setIsValidating(true);
      setError("");

      try {
        const response = await studentQuizAPI.validateQuizPassword(
          quiz.quizId,
          password,
        );

        if (response.valid) {
          // Password is correct, start the quiz with password
          onConfirm(password);
        } else {
          // Password is incorrect
          setError(response.message || "Incorrect password");
        }
      } catch (err) {
        console.error("Password validation error:", err);
        setError("Failed to validate password. Please try again.");
      } finally {
        setIsValidating(false);
      }
    } else {
      // No password needed, just start
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Start Quiz</DialogTitle>
          <DialogDescription>
            Are you sure you want to start this quiz?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quiz Title */}
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-semibold text-lg">{quiz.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Duration: {quiz.durationMinutes} minutes
              {quiz.extensionMinutes > 0 &&
                ` (+${quiz.extensionMinutes} min extension)`}
            </p>
          </div>

          {/* Password Input (if protected) */}
          {quiz.isPasswordProtected && (
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Quiz Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter quiz password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={isStarting || isValidating}
                className={error ? "border-destructive" : ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isStarting && !isValidating) {
                    handleConfirm();
                  }
                }}
              />
              {error && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-2 rounded-md bg-blue-50 dark:bg-blue-950/20 px-3 py-2 border border-blue-200 dark:border-blue-900">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="flex-1 text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200">
                Important
              </p>
              <p className="text-blue-700 dark:text-blue-300 text-xs mt-0.5">
                Once you start, the timer will begin immediately. Make sure you
                have a stable internet connection.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isStarting || isValidating}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isStarting || isValidating}>
            {isStarting || isValidating ? (
              "Starting..."
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Quiz
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
