"use client";
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

interface CourseAlertsProps {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  hasCreateError: boolean;
  hasUpdateError: boolean;
  hasDeleteError: boolean;
}

export function CourseAlerts({
  isCreating,
  isUpdating,
  isDeleting,
  hasCreateError,
  hasUpdateError,
  hasDeleteError,
}: CourseAlertsProps) {
  return (
    <>
      {(isCreating || isUpdating || isDeleting) && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            {isCreating && "Creating course..."}
            {isUpdating && "Updating course..."}
            {isDeleting && "Deleting course..."}
          </AlertDescription>
        </Alert>
      )}

      {(hasCreateError || hasUpdateError || hasDeleteError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {hasCreateError && "Failed to create course"}
            {hasUpdateError && "Failed to update course"}
            {hasDeleteError && "Failed to delete course"}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
} 