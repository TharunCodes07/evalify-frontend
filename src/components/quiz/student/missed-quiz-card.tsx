"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import type { MissedQuiz } from "@/types/quiz";

interface MissedQuizCardProps {
  quiz: MissedQuiz;
}

export function MissedQuizCard({ quiz }: MissedQuizCardProps) {
  return (
    <Card className="group overflow-hidden transition-all border-destructive/30 opacity-75 w-full">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          {/* Left side: Title and courses */}
          <div className="flex-1 space-y-3">
            {/* Title */}
            <h3 className="text-2xl font-bold text-muted-foreground">
              {quiz.title}
            </h3>

            {/* Course names and codes */}
            {quiz.courses && quiz.courses.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {quiz.courses.map((course, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <span className="font-normal text-sm opacity-75">
                      {course.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium px-2 py-0.5 w-fit opacity-75"
                    >
                      {course.code}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Missed badge */}
          <Badge
            variant="outline"
            className="shrink-0 px-2 py-1 text-xs font-medium uppercase border-destructive/20"
          >
            <div className="relative flex h-2 w-2 mr-1.5">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </div>
            Missed
          </Badge>
        </div>
        {/* Timeline Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Time */}
          {quiz.startTime && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Quiz Started
                </p>
                <p className="text-sm font-semibold">
                  {format(new Date(quiz.startTime), "MMM dd, yyyy")}
                </p>
                <p className="text-sm font-semibold">
                  {format(new Date(quiz.startTime), "hh:mm a")}
                </p>
              </div>
            </div>
          )}

          {/* End Time */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Deadline Missed
              </p>
              <p className="text-sm font-semibold">
                {format(new Date(quiz.endTime), "MMM dd, yyyy")}
              </p>
              <p className="text-sm font-semibold">
                {format(new Date(quiz.endTime), "hh:mm a")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row: Duration, Creator */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t">
          <div className="flex items-center gap-6">
            {/* Duration */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {quiz.durationMinutes} mins
              </span>
            </div>

            {/* Creator */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {quiz.createdByName}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
