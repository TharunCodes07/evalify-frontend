"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Course } from "@/types/types";
import { CourseForm } from "./course-form";

interface CourseHeaderProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  onCreateCourse: (data: Omit<Course, "id">) => void;
}

export function CourseHeader({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  onCreateCourse,
}: CourseHeaderProps) {
  return (
    <div className="flex justify-between items-center pb-3">
      <div>
        <h1 className="text-2xl font-bold">Courses Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage your courses and their details
        </p>
      </div>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        Add New Course
      </Button>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Course</DialogTitle>
            <DialogDescription>
              Add a new course to the system
            </DialogDescription>
          </DialogHeader>
          <CourseForm onSubmit={onCreateCourse} />
        </DialogContent>
      </Dialog>
    </div>
  );
} 