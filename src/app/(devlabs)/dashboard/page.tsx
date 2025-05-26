"use client";

import { useCallback, useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Phone, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";

// User data type
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive" | "pending";
  avatar?: string;
  department: string;
  joinDate: string;
  lastLogin: string;
}

// Generate synthetic test data
const generateUsers = (count: number): User[] => {
  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "David",
    "Emily",
    "Robert",
    "Lisa",
    "James",
    "Amanda",
    "Christopher",
    "Jessica",
    "Daniel",
    "Ashley",
    "Matthew",
    "Stephanie",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
  ];
  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "Design",
    "Product",
    "Legal",
    "Support",
  ];
  const roles: User["role"][] = ["admin", "user", "moderator"];
  const statuses: User["status"][] = ["active", "inactive", "pending"];

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const joinDate = new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3
    );
    const lastLogin = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    );

    return {
      id: i + 1,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@devlabs.com`,
      phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${
        Math.floor(Math.random() * 900) + 100
      }-${Math.floor(Math.random() * 9000) + 1000}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      joinDate: joinDate.toISOString().split("T")[0],
      lastLogin: lastLogin.toISOString().split("T")[0],
    };
  });
};

// Simulate paginated API response
const fetchUsers = async (params: {
  page: number;
  limit: number;
  search: string;
  from_date: string;
  to_date: string;
  sort_by: string;
  sort_order: string;
}) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allUsers = generateUsers(150); // Generate 150 users total

  // Filter by search
  let filteredUsers = allUsers;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredUsers = allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.department.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
    );
  }
  // Sort users
  filteredUsers.sort((a, b) => {
    let aValue: string | number = a[params.sort_by as keyof User] as
      | string
      | number;
    let bValue: string | number = b[params.sort_by as keyof User] as
      | string
      | number;

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }

    if (params.sort_order === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Paginate
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return {
    success: true,
    data: paginatedUsers,
    pagination: {
      page: params.page,
      limit: params.limit,
      total_pages: Math.ceil(filteredUsers.length / params.limit),
      total_items: filteredUsers.length,
    },
  };
};

// Simulate fetching users by IDs
const fetchUsersByIds = async (ids: number[] | string[]): Promise<User[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const allUsers = generateUsers(150);
  const numericIds = ids.map((id) =>
    typeof id === "string" ? parseInt(id, 10) : id
  );
  return allUsers.filter((user) => numericIds.includes(user.id));
};

export default function DevlabsDashboardPage() {
  const getColumns = useCallback(
    (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _handleRowDeselection: ((rowId: string) => void) | null | undefined
    ): ColumnDef<User, string | number>[] => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
            className="rounded border-gray-300"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            className="rounded border-gray-300"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "firstName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback>
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
          const role = row.getValue("role") as string;
          const roleColors = {
            admin: "bg-red-100 text-red-800",
            moderator: "bg-blue-100 text-blue-800",
            user: "bg-green-100 text-green-800",
          };
          return (
            <Badge className={roleColors[role as keyof typeof roleColors]}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "department",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Department" />
        ),
        cell: ({ row }) => (
          <span className="text-gray-900">{row.getValue("department")}</span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const statusColors = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-gray-100 text-gray-800",
            pending: "bg-yellow-100 text-yellow-800",
          };
          return (
            <Badge
              className={statusColors[status as keyof typeof statusColors]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Phone" />
        ),
        cell: ({ row }) => (
          <span className="text-gray-600">{row.getValue("phone")}</span>
        ),
      },
      {
        accessorKey: "joinDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Join Date" />
        ),
        cell: ({ row }) => (
          <span className="text-gray-600">
            {new Date(row.getValue("joinDate")).toLocaleDateString()}
          </span>
        ),
      },
      {
        accessorKey: "lastLogin",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Login" />
        ),
        cell: ({ row }) => (
          <span className="text-gray-600">
            {new Date(row.getValue("lastLogin")).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
      },
    ],
    []
  );

  // Export configuration
  const exportConfig = useMemo(
    () => ({
      entityName: "users",
      columnMapping: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        phone: "Phone",
        role: "Role",
        department: "Department",
        status: "Status",
        joinDate: "Join Date",
        lastLogin: "Last Login",
      },
      columnWidths: [
        { wch: 15 }, // First Name
        { wch: 15 }, // Last Name
        { wch: 25 }, // Email
        { wch: 15 }, // Phone
        { wch: 10 }, // Role
        { wch: 15 }, // Department
        { wch: 10 }, // Status
        { wch: 12 }, // Join Date
        { wch: 12 }, // Last Login
      ],
      headers: [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Role",
        "Department",
        "Status",
        "Join Date",
        "Last Login",
      ],
    }),
    []
  );
  // Table configuration
  const tableConfig = useMemo(
    () => ({
      enableRowSelection: true,
      enableColumnResizing: true,
      enableToolbar: true,
      enablePagination: true,
      enableUrlState: true,
      enableKeyboardNavigation: true,
      enableClickRowSelect: false,
      columnResizingTableId: "users-table",
      size: "default" as const,
    }),
    []
  );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage and view all users in your organization
        </p>
      </div>

      <DataTable<User, string | number>
        config={tableConfig}
        getColumns={getColumns}
        fetchDataFn={fetchUsers}
        fetchByIdsFn={fetchUsersByIds}
        exportConfig={exportConfig}
        idField="id"
        pageSizeOptions={[10, 20, 30, 50, 100]}
        renderToolbarContent={({
          selectedRows,
          totalSelectedCount,
          resetSelection,
        }) => (
          <div className="flex items-center space-x-2">
            {totalSelectedCount > 0 && (
              <>
                <span className="text-sm text-gray-600">
                  {totalSelectedCount} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("Bulk email to:", selectedRows);
                    resetSelection();
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Bulk Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("Bulk delete:", selectedRows);
                    resetSelection();
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Bulk Delete
                </Button>
              </>
            )}
          </div>
        )}
      />
    </div>
  );
}
