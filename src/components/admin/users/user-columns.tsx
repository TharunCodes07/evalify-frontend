import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  User as UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/types";

export const getColumns = (
  handleClick?: (user: User) => void
): ColumnDef<User>[] => {
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
          title="User"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const user = row.original;
        const name = user.name as string;
        const email = user.email as string;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium text-gray-600">{name}</div>
              <div className="text-sm text-gray-700">{email}</div>
            </div>
          </div>
        );
      },
      meta: { label: "User" },
      size: 250,
    },
    {
      accessorKey: "profileId",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Profile ID"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const profileId = row.getValue("profileId") as string;
        return (
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-600">{profileId}</span>
          </div>
        );
      },
      meta: { label: "Profile ID" },
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Phone"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const phoneNumber = row.getValue("phoneNumber") as string | undefined;
        return (
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-600">
              {phoneNumber || "N/A"}
            </span>
          </div>
        );
      },
      meta: { label: "Phone" },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Role"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const roleVariant =
          role === "ADMIN"
            ? "destructive"
            : role === "MANAGER" || role === "FACULTY"
            ? "secondary"
            : "outline";

        return (
          <div className="flex justify-center">
            <Badge variant={roleVariant} className="capitalize">
              {role.toLowerCase()}
            </Badge>
          </div>
        );
      },
      meta: { label: "Role" },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
          className="text-center"
        />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        const statusVariant = isActive ? "default" : "destructive";

        return (
          <div className="flex justify-center">
            <Badge variant={statusVariant} className="capitalize">
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
      meta: { label: "Status" },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 mx-auto">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleClick?.(user)}>
                <UserIcon className="mr-2 h-4 w-4" />
                View User
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="mr-2 h-4 w-4" />
                Call User
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
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
