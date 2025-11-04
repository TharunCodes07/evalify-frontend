"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User, Trophy } from "lucide-react";
import { format } from "date-fns";
import type { CompletedQuiz } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface CompletedQuizCardProps {
  quiz: CompletedQuiz;
  onClick?: () => void;
}

export function CompletedQuizCard({ quiz, onClick }: CompletedQuizCardProps) {
  const hasScore = quiz.obtainedMarks !== null && quiz.percentage !== null;
  const isPassed = quiz.percentage && quiz.percentage >= 40;

  return (
    <Card
      onClick={onClick}
      className="group overflow-hidden transition-all hover:shadow-lg cursor-pointer hover:border-primary/50 w-full"
    >
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          {/* Left side: Title and courses */}
          <div className="flex-1 space-y-3">
            {/* Title */}
            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
              {quiz.title}
            </h3>

            {/* Course names and codes */}
            {quiz.courses && quiz.courses.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {quiz.courses.map((course, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <span className="font-normal text-sm">{course.name}</span>
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium px-2 py-0.5 w-fit"
                    >
                      {course.code}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Status badge and score */}
          <div className="flex flex-col items-end gap-2">
            <Badge
              variant="outline"
              className="shrink-0 px-2 py-1 text-xs font-medium uppercase border-muted-foreground/20"
            >
              <div className="relative flex h-2 w-2 mr-1.5">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </div>
              Completed
            </Badge>
            {hasScore && (
              <div className="flex flex-col items-end gap-1">
                <Badge
                  variant={isPassed ? "default" : "destructive"}
                  className={cn(
                    "text-lg font-bold px-4 py-2",
                    isPassed && "bg-green-500 hover:bg-green-600",
                  )}
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  {quiz.percentage?.toFixed(1)}%
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {quiz.obtainedMarks?.toFixed(1)} marks
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Submission Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Started */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Started
              </p>
              <p className="text-sm font-semibold">
                {format(new Date(quiz.startedAt), "MMM dd, yyyy")}
              </p>
              <p className="text-sm font-semibold">
                {format(new Date(quiz.startedAt), "hh:mm a")}
              </p>
            </div>
          </div>

          {/* Submitted */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Submitted
              </p>
              <p className="text-sm font-semibold">
                {format(new Date(quiz.submittedAt), "MMM dd, yyyy")}
              </p>
              <p className="text-sm font-semibold">
                {format(new Date(quiz.submittedAt), "hh:mm a")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row: Time Taken, Creator, and Status Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t">
          <div className="flex items-center gap-6">
            {/* Time Taken */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{quiz.timeTaken} mins</span>
            </div>

            {/* Creator */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {quiz.createdByName}
              </span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {quiz.extensionMinutes > 0 && (
              <Badge variant="outline" className="text-xs font-medium">
                +{quiz.extensionMinutes} min extension
              </Badge>
            )}
            {quiz.isLateSubmission && (
              <Badge variant="destructive" className="text-xs">
                Late Submission
              </Badge>
            )}
            {quiz.status === "AUTO_SUBMITTED" && (
              <Badge variant="secondary" className="text-xs">
                Auto-Submitted
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
