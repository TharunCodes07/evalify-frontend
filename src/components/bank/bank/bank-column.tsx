import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { QuestionBank } from "@/types/bank";

export const getColumns = (
  onEdit?: (bank: QuestionBank) => void,
  onDelete?: (bankId: string) => void,
  onShare?: (bank: QuestionBank) => void,
): ColumnDef<QuestionBank>[] => {
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
        <DataTableColumnHeader column={column} title="Bank Name" />
      ),
      cell: ({ row }) => {
        const bank = row.original;
        return (
          <div>
            <div className="font-medium">{bank.name}</div>
            {bank.description && (
              <div className="text-xs text-muted-foreground truncate max-w-xs">
                {bank.description}
              </div>
            )}
          </div>
        );
      },
      meta: { label: "Bank Name" },
      size: 250,
      enableSorting: true,
    },
    {
      accessorKey: "owner",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Owner"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const owner = row.original.owner;
        return (
          <div className="text-center">
            <div className="font-medium">{owner.name}</div>
            <div className="text-xs text-muted-foreground">{owner.email}</div>
          </div>
        );
      },
      meta: { label: "Owner" },
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: "isPublic",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Type"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const isPublic = row.getValue("isPublic") as boolean;
        return (
          <div className="text-center">
            <Badge variant={isPublic ? "default" : "secondary"}>
              {isPublic ? "Public" : "Private"}
            </Badge>
          </div>
        );
      },
      meta: { label: "Type" },
      size: 100,
      enableSorting: false,
    },
    {
      accessorKey: "topics",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Topics"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const topics = row.getValue("topics") as string[];
        return (
          <div className="text-center">
            {topics.length > 0 ? (
              <div className="flex gap-1 justify-center flex-wrap">
                {topics.slice(0, 2).map((topic, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
                {topics.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{topics.length - 2}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        );
      },
      meta: { label: "Topics" },
      size: 150,
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const bank = row.original;
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
                  onShare?.(bank);
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Bank
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(bank);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Bank
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(bank.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Bank
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
