"use client";

import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CreateQuizSchema } from "./create-quiz-schema";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  FileText,
  Users,
  BookOpen,
  GraduationCap,
  FlaskConical,
  Eye,
  Shuffle,
  Shield,
  Key,
  Calculator,
  TimerOff,
  Copy,
  Maximize,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function QuizSummary() {
  const { getValues } = useFormContext<CreateQuizSchema>();
  const values = getValues();

  const {
    title,
    description,
    startTime,
    endTime,
    durationMinutes,
    semesters,
    batches,
    courses,
    students,
    labs,
    config,
  } = values;

  const allParticipantsEmpty =
    (!semesters || semesters.length === 0) &&
    (!batches || batches.length === 0) &&
    (!courses || courses.length === 0) &&
    (!students || students.length === 0);

  const isComplete = title && startTime && endTime && durationMinutes;

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      {isComplete ? (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-medium text-emerald-900 dark:text-emerald-100">
              Ready to Create
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              All required information has been provided
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">
              Incomplete Information
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Please complete all required fields to publish
            </p>
          </div>
        </div>
      )}

      {/* Quiz Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold">Quiz Details</h3>
        </div>

        <div className="grid gap-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Title
            </p>
            <p className="text-lg font-semibold">
              {title || (
                <span className="text-muted-foreground italic">
                  Not provided
                </span>
              )}
            </p>
          </div>

          {description && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Description
              </p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Start Time
                </p>
              </div>
              <p className="text-sm font-medium">
                {startTime ? (
                  format(startTime, "PPP p")
                ) : (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-600" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  End Time
                </p>
              </div>
              <p className="text-sm font-medium">
                {endTime ? (
                  format(endTime, "PPP p")
                ) : (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Duration
                </p>
              </div>
              <p className="text-sm font-medium">{durationMinutes} minutes</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Participants */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold">Participants</h3>
        </div>

        {allParticipantsEmpty ? (
          <div className="p-6 text-center bg-muted/30 rounded-lg border border-dashed">
            <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="font-medium text-muted-foreground">
              No participants selected
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Add participants to assign this quiz
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {semesters && semesters.length > 0 && (
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                    Semesters ({semesters.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {semesters.map((item) => (
                    <Badge
                      key={item.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {batches && batches.length > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    Batches ({batches.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {batches.map((item) => (
                    <Badge
                      key={item.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {courses && courses.length > 0 && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                    Courses ({courses.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {courses.map((item) => (
                    <Badge
                      key={item.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {labs && labs.length > 0 && (
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                    Labs ({labs.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {labs.map((item) => (
                    <Badge
                      key={item.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Configuration Summary */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
            <Shield className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold">Quiz Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Display Settings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-4 w-4 text-purple-600" />
              <h4 className="text-sm font-semibold">Display</h4>
            </div>
            <div className="space-y-2">
              {config.showQuestionsOneByOne && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  One question at a time
                </div>
              )}
              {config.allowQuestionNavigation && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  Question navigation enabled
                </div>
              )}
            </div>
          </div>

          {/* Randomization */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Shuffle className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-semibold">Randomization</h4>
            </div>
            <div className="space-y-2">
              {config.shuffleQuestions && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Shuffle questions
                </div>
              )}
              {config.shuffleOptions && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Shuffle options
                </div>
              )}
              {config.randomizeQuestions && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Random selection from pool
                </div>
              )}
            </div>
          </div>

          {/* Anti-Cheating */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-red-600" />
              <h4 className="text-sm font-semibold">Anti-Cheating</h4>
            </div>
            <div className="space-y-2">
              {config.requireFullScreen && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Maximize className="h-3.5 w-3.5 text-red-600" />
                  Full screen required
                </div>
              )}
              {config.preventQuestionCopy && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Copy className="h-3.5 w-3.5 text-red-600" />
                  Copy protection
                </div>
              )}
              {config.preventTabSwitch && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                  Tab switch monitoring
                  {config.tabSwitchLimit &&
                    ` (limit: ${config.tabSwitchLimit})`}
                </div>
              )}
              {config.autoSubmit && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TimerOff className="h-3.5 w-3.5 text-red-600" />
                  Auto submit on timeout
                </div>
              )}
            </div>
          </div>

          {/* Attempts & More */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <RotateCcw className="h-4 w-4 text-green-600" />
              <h4 className="text-sm font-semibold">Attempts & More</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Max attempts: {config.maxAttempts}
              </div>
              {config.canReattemptIfFailed && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Reattempt on failure
                </div>
              )}
              {config.passingPercentage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Passing: {config.passingPercentage}%
                </div>
              )}
              {config.passwordProtected && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Key className="h-3.5 w-3.5 text-green-600" />
                  Password protected
                </div>
              )}
              {config.calculatorAccess && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calculator className="h-3.5 w-3.5 text-green-600" />
                  Calculator allowed
                </div>
              )}
              {config.negativeMarkingEnabled && (
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Negative marking
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
