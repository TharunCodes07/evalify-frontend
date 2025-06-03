import { Project } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, FolderOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getColumns = (
  handleClick?: (project: Project) => void
): ColumnDef<Project>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex justify-center p-2">
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
            className="rounded border-gray-300 cursor-pointer"
            aria-label="Select all rows"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="flex justify-center p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            className="rounded border-gray-300 cursor-pointer"
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Project"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex flex-col items-center text-center">
            <div className="font-medium text-gray-500">{project.title}</div>
            {project.description && (
              <div className="text-sm text-gray-700 truncate max-w-xs text-center">
                {project.description}
              </div>
            )}
          </div>
        );
      },
      meta: { label: "Project" },
      size: 250,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Created"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return (
          <span className="text-sm text-gray-600 flex justify-center">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        );
      },
      meta: { label: "Created" },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Last Updated"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const updatedAt = row.getValue("updatedAt") as string;
        return (
          <span className="text-sm text-gray-600 flex justify-center">
            {new Date(updatedAt).toLocaleDateString()}
          </span>
        );
      },
      meta: { label: "Last Updated" },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const project = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 mx-auto">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleClick?.(project)}>
                <FolderOpen className="mr-2 h-4 w-4" />
                View Project
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
      meta: { label: "Actions" },
    },
  ];
};
