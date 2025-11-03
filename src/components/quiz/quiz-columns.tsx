import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash, Puzzle, Share2 } from "lucide-react";
import { format } from "date-fns";
import { QuizListResponse } from "@/types/quiz";

const calculateQuizStatus = (
  startTime?: string,
  endTime?: string,
  isPublished?: boolean,
) => {
  if (!isPublished) return "draft";
  if (!startTime || !endTime) return "scheduled";

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) return "scheduled";
  if (now >= start && now <= end) return "active";
  return "completed";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "scheduled":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "active":
      return "bg-green-100 text-green-800 border-green-300";
    case "completed":
      return "bg-purple-100 text-purple-800 border-purple-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "draft":
      return "Draft";
    case "scheduled":
      return "Scheduled";
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    default:
      return status;
  }
};

export const getColumns = (
  onView: (quiz: QuizListResponse) => void,
  onEdit: (quiz: QuizListResponse) => void,
  onDelete: (quiz: QuizListResponse) => void,
  onShare: (quiz: QuizListResponse) => void,
  currentUserId?: string,
): ColumnDef<QuizListResponse>[] => [
  {
    accessorKey: "title",
    header: "Quiz Title",
    cell: ({ row }) => {
      const quiz = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{quiz.title}</span>
          {quiz.description && (
            <span className="text-sm text-muted-foreground line-clamp-1">
              {quiz.description}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const quiz = row.original;
      const dynamicStatus = calculateQuizStatus(
        quiz.startTime,
        quiz.endTime,
        quiz.isPublished,
      );

      return (
        <Badge variant="outline" className={getStatusColor(dynamicStatus)}>
          {formatStatus(dynamicStatus)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "ownership",
    header: "Access",
    cell: ({ row }) => {
      const quiz = row.original;
      const isOwner = currentUserId === quiz.createdBy.id;

      if (isOwner) {
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-300"
          >
            Owner
          </Badge>
        );
      }

      if (quiz.permission) {
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-300"
          >
            Shared ({quiz.permission})
          </Badge>
        );
      }

      return <span className="text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => {
      const startTime = row.original.startTime;
      return startTime
        ? format(new Date(startTime), "MMM dd, yyyy HH:mm")
        : "—";
    },
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => {
      const endTime = row.original.endTime;
      return endTime ? format(new Date(endTime), "MMM dd, yyyy HH:mm") : "—";
    },
  },
  {
    accessorKey: "durationMinutes",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.original.durationMinutes;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    },
  },
  {
    accessorKey: "questionCount",
    header: "Questions",
    cell: ({ row }) => {
      const count = row.original.questionCount;
      return (
        <div className="flex items-center gap-1">
          <Puzzle className="h-4 w-4 text-muted-foreground" />
          <span>{count}</span>
        </div>
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
    header: "Actions",
    cell: ({ row }) => {
      const quiz = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onView(quiz);
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(quiz);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {quiz.createdBy.id === currentUserId && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(quiz);
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(quiz);
              }}
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
