import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lab } from "@/types/types";

export const getColumns = (
  onEdit?: (lab: Lab) => void,
  onDelete?: (labId: string) => void,
): ColumnDef<Lab>[] => {
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
        <DataTableColumnHeader column={column} title="Lab Name" />
      ),
      cell: ({ row }) => {
        const lab = row.original;
        return <div className="font-medium">{lab.name}</div>;
      },
      meta: { label: "Lab Name" },
      size: 200,
      enableSorting: true,
    },
    {
      accessorKey: "block",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Block"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const block = row.getValue("block") as string;
        return <div className="text-center font-medium">{block}</div>;
      },
      meta: { label: "Block" },
      size: 150,
      enableSorting: true,
    },
    {
      accessorKey: "ipSubnet",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="IP Subnet"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const ipSubnet = row.getValue("ipSubnet") as string;
        return <div className="text-center font-medium">{ipSubnet}</div>;
      },
      meta: { label: "IP Subnet" },
      size: 200,
      enableSorting: true,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const lab = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 mx-auto">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(lab);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Lab
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(lab.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Lab
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
