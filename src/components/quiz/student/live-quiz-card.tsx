"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Lock, User } from "lucide-react";
import { format } from "date-fns";
import type { LiveQuiz } from "@/types/quiz";

interface LiveQuizCardProps {
  quiz: LiveQuiz;
  onClick?: () => void;
}

export function LiveQuizCard({ quiz, onClick }: LiveQuizCardProps) {
  return (
    <Card
      onClick={onClick}
      className="overflow-hidden transition-all hover:shadow-lg cursor-pointer hover:border-primary/50 w-full"
    >
      <CardContent className="pt-6 space-y-3">
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

          {/* Right side: Live badge with flickering indicator */}
          <Badge
            variant="outline"
            className="shrink-0 px-2 py-1 text-xs font-medium uppercase border-muted-foreground/20"
          >
            <div className="relative flex h-2 w-2 mr-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            Live
          </Badge>
        </div>
        {/* Timing Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Time */}
          {quiz.startTime && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Start Time
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
          {quiz.endTime && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  End Time
                </p>
                <p className="text-sm font-semibold">
                  {format(new Date(quiz.endTime), "MMM dd, yyyy")}
                </p>
                <p className="text-sm font-semibold">
                  {format(new Date(quiz.endTime), "hh:mm a")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom row: Duration, Creator, and Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t">
          <div className="flex items-center gap-6">
            {/* Duration */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
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

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {quiz.extensionMinutes > 0 && (
              <Badge variant="outline" className="text-xs font-medium">
                +{quiz.extensionMinutes} min extension
              </Badge>
            )}
            {quiz.isPasswordProtected && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 text-xs"
              >
                <Lock className="h-3 w-3" />
                Password Protected
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
