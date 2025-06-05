import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Eye,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Course, CourseType } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";

type CourseAction = (course: Course, action: string) => void;

export const getColumns = (onAction: CourseAction): ColumnDef<Course>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Course Name"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const course = row.original;
        const name = course.name as string;

        return (
          <div className="items-center space-x-3">
            <div>
              <div className="font-medium">{name}</div>
            </div>
          </div>
        );
      },
      meta: { label: "Course Name" },
      size: 200,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Description"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="text-center font-medium">
            {description}
          </div>
        );
      },
      meta: { label: "Description" },
      size: 300,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Type"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const type = row.getValue("type") as CourseType;
        const typeVariant = type === CourseType.CORE ? "default" : "secondary";

        return (
          <div className="flex justify-center">
            <Badge variant={typeVariant} className="capitalize">
              {type}
            </Badge>
          </div>
        );
      },
      meta: { label: "Type" },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const course = row.original;
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAction(course, "view")}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction(course, "schedules")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedules
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction(course, "settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction(course, "edit")}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction(course, "delete")}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
