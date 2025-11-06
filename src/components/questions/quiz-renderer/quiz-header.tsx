import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatTime } from "./quiz-utils";
import {
  CheckCircle2,
  Flag,
  AlertCircle,
  Clock,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
  markedCount: number;
  violations: number;
  tabSwitchLimit?: number;
  timeRemaining: number;
  autoSubmit?: boolean;
  mounted: boolean;
  resolvedTheme: string | undefined;
  onThemeToggle: () => void;
  showViolations: boolean;
}

export function QuizHeader({
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
  markedCount,
  violations,
  tabSwitchLimit = 3,
  timeRemaining,
  autoSubmit,
  mounted,
  resolvedTheme,
  onThemeToggle,
  showViolations,
}: QuizHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-muted-foreground">
              Question{" "}
              <span className="text-lg text-foreground">
                {currentQuestionIndex + 1}
              </span>
              <span className="mx-1">/</span>
              <span>{totalQuestions}</span>
            </div>
            <Progress
              value={((currentQuestionIndex + 1) / totalQuestions) * 100}
              className="w-32 h-2"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">{answeredCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-amber-600" />
                <span className="font-medium">{markedCount}</span>
              </div>
              {showViolations && violations > 0 && (
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-md",
                    violations >= tabSwitchLimit
                      ? "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
                  )}
                  title="Violations detected"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-semibold text-xs">
                    {violations} {violations === 1 ? "violation" : "violations"}
                  </span>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-border" />

            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg",
                  timeRemaining < 300
                    ? "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                )}
              >
                <Clock className="h-5 w-5" />
                {formatTime(timeRemaining)}
              </div>
              {autoSubmit && (
                <div className="text-xs text-muted-foreground">
                  Auto-submit enabled
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onThemeToggle}
              className="h-9 w-9"
            >
              {mounted && resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
