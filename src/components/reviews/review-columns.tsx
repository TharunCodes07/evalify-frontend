import { ColumnDef } from "@tanstack/react-table";
import { Review } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { format } from "date-fns";

export const getColumns = (
  onView: (review: Review) => void,
  onEdit: (review: Review) => void,
  onDelete: (review: Review) => void
): ColumnDef<Review>[] => [
  {
    accessorKey: "name",
    header: "Review Name",
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{review.name}</span>
          <span className="text-sm text-muted-foreground">
            {review.id.slice(0, 8)}...
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusColor = (status?: string) => {
        switch (status) {
          case "LIVE":
            return "bg-green-100 text-green-800 border-green-200";
          case "COMPLETED":
            return "bg-blue-100 text-blue-800 border-blue-200";
          case "SCHEDULED":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "CANCELLED":
            return "bg-red-100 text-red-800 border-red-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };

      return (
        <Badge variant="outline" className={getStatusColor(status)}>
          {status || "UNKNOWN"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      return startDate ? format(new Date(startDate), "MMM dd, yyyy") : "—";
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const endDate = row.original.endDate;
      return endDate ? format(new Date(endDate), "MMM dd, yyyy") : "—";
    },
  },
  {
    accessorKey: "isPublished",
    header: "Published",
    cell: ({ row }) => {
      const isPublished = row.original.isPublished;
      return (
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => {
      const createdBy = row.original.createdBy;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{createdBy?.name || "Unknown"}</span>
          <span className="text-sm text-muted-foreground">
            {createdBy?.email || "—"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const review = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(review)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(review)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(review)}
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
