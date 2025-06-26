"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Users, Calendar, BookOpen } from "lucide-react";
import { Project, ProjectStatus } from "@/types/types";
// Date formatting utility
const formatDateString = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
};

const getStatusBadgeVariant = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.COMPLETED:
      return "default";
    case ProjectStatus.ONGOING:
      return "secondary";
    case ProjectStatus.PROPOSED:
      return "outline";
    case ProjectStatus.REJECTED:
      return "destructive";
    default:
      return "secondary";
  }
};

export const getColumns = (
  handleView: (project: Project) => void
): ColumnDef<Project>[] => [
  {
    accessorKey: "title",
    header: "Project Title",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue("title")}</span>
          <span className="text-sm text-muted-foreground truncate max-w-[300px]">
            {row.original.description}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ProjectStatus;
      return (
        <Badge variant={getStatusBadgeVariant(status)}>
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "teamMembers",
    header: "Team Members",
    cell: ({ row }) => {
      const teamMembers = row.original.teamMembers || [];
      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{teamMembers.length}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "courses",
    header: "Courses",
    cell: ({ row }) => {
      const courses = row.original.courses || [];
      return (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {courses.slice(0, 2).map((course) => (
              <Badge key={course.id} variant="outline" className="text-xs">
                {course.code || course.name}
              </Badge>
            ))}
            {courses.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{courses.length - 2}
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Completed On",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {formatDateString(row.getValue("updatedAt"))}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(project)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
