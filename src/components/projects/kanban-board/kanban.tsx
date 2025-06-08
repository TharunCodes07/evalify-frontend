"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
  type KanbanItemProps,
  type KanbanColumnProps,
} from "@/components/kanban/kanban";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster, toast } from "sonner";
import { kanbanAPI } from "@/repo/project-queries/kanban-queries";
import { useState, useEffect } from "react";
import { AddTaskModal } from "./add-task-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface KanbanBoardPageProps {
  id?: string;
}

interface EnhancedKanbanItem extends KanbanItemProps {
  name: string;
  description?: string;
  createdBy?: {
    id: string;
    name: string;
    image?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface EnhancedKanbanColumn extends KanbanColumnProps {
  color?: string;
}

export default function KanbanBoardPage({ id }: KanbanBoardPageProps) {
  const [kanbanTasks, setKanbanTasks] = useState<EnhancedKanbanItem[]>([]);
  const {
    data: kanbanData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kanbanBoard", id],
    queryFn: () => kanbanAPI.getKanbanBoard(id as string),
    enabled: !!id,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
  const moveTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      request,
    }: {
      taskId: string;
      request: { columnId: string; position: number; userId: string };
    }) => {
      return kanbanAPI.moveTask(taskId, request);
    },
    onSuccess: () => {},
    onError: (error) => {
      console.error("Failed to move task:", error);
      if (kanbanData) {
        const tasks: EnhancedKanbanItem[] = [];
        kanbanData.columns.forEach((column) => {
          column.tasks.forEach((task) => {
            tasks.push({
              id: task.id,
              name: task.title,
              column: column.id,
              description: task.description,
              createdBy: task.createdBy,
              assignedTo: task.assignedTo,
              createdAt: task.createdAt,
              updatedAt: task.updatedAt,
            });
          });
        });
        setKanbanTasks(tasks);
      }
    },
  });
  useEffect(() => {
    if (kanbanData) {
      const tasks: EnhancedKanbanItem[] = [];
      kanbanData.columns.forEach((column) => {
        column.tasks.forEach((task) => {
          tasks.push({
            id: task.id,
            name: task.title,
            column: column.id,
            description: task.description,
            createdBy: task.createdBy,
            assignedTo: task.assignedTo,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          });
        });
      });
      setKanbanTasks(tasks);
    }
  }, [kanbanData]);
  const handleDataChange = async (newData: EnhancedKanbanItem[]) => {
    const previousTasks = [...kanbanTasks];
    setKanbanTasks(newData);
    let movedTask: EnhancedKanbanItem | undefined;
    let targetPosition = -1;

    movedTask = newData.find((newTask) => {
      const oldTask = previousTasks.find(
        (oldTask) => oldTask.id === newTask.id
      );
      return oldTask && oldTask.column !== newTask.column;
    });

    if (!movedTask) {
      for (const newTask of newData) {
        const oldTask = previousTasks.find(
          (oldTask) => oldTask.id === newTask.id
        );
        if (oldTask && oldTask.column === newTask.column) {
          const oldTasksInColumn = previousTasks.filter(
            (task) => task.column === oldTask.column
          );
          const newTasksInColumn = newData.filter(
            (task) => task.column === newTask.column
          );

          const oldPosition = oldTasksInColumn.findIndex(
            (task) => task.id === newTask.id
          );
          const newPosition = newTasksInColumn.findIndex(
            (task) => task.id === newTask.id
          );

          if (oldPosition !== newPosition) {
            movedTask = newTask;
            targetPosition = newPosition;
            break;
          }
        }
      }
    }

    if (movedTask) {
      const tasksInColumn = newData.filter(
        (task) => task.column === movedTask.column
      );
      const position =
        targetPosition >= 0
          ? targetPosition
          : tasksInColumn.findIndex((task) => task.id === movedTask.id);

      moveTaskMutation.mutate({
        taskId: movedTask.id,
        request: {
          columnId: movedTask.column,
          position: position,
          userId: "user-id-placeholder",
        },
      });
    }
  };
  if (!id) {
    return <div>No project ID provided</div>;
  }

  if (isLoading) {
    return <div>Loading Kanban Board...</div>;
  }

  if (error) {
    return <div>Error loading Kanban Board: {error.message}</div>;
  }
  if (!kanbanData) {
    return <div>No kanban data available</div>;
  }

  const getColumnColor = (columnName: string) => {
    const colors: Record<string, string> = {
      "To Do": "#6B7280",
      Planned: "#6B7280",
      "In Progress": "#F59E0B",
      "In Review": "#8B5CF6",
      Done: "#10B981",
      Completed: "#10B981",
      Testing: "#3B82F6",
      Backlog: "#6B7280",
    };
    return colors[columnName] || "#6B7280";
  };
  const columns: EnhancedKanbanColumn[] = kanbanData.columns.map((col) => ({
    id: col.id,
    name: col.name,
    color: getColumnColor(col.name),
  }));

  const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  return (
    <div className="h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        {moveTaskMutation.isPending && (
          <p className="text-sm text-muted-foreground">Saving changes...</p>
        )}
      </div>{" "}
      <KanbanProvider
        columns={columns}
        data={kanbanTasks}
        onDataChange={handleDataChange}
        className="h-[calc(100vh-200px)]"
      >
        {(column: EnhancedKanbanColumn) => (
          <KanbanBoard key={column.id} id={column.id}>
            <KanbanHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <span>{column.name}</span>
                </div>
                <AddTaskModal columnId={column.id} projectId={id!} />
              </div>
            </KanbanHeader>
            <KanbanCards id={column.id}>
              {(task: EnhancedKanbanItem) => (
                <KanbanCard key={task.id} {...task}>
                  {" "}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <p className="m-0 font-medium text-sm line-clamp-2">
                        {task.name}
                      </p>
                      {task.description && (
                        <p className="m-0 text-muted-foreground text-xs line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      {task.createdBy && (
                        <p className="m-0 text-muted-foreground text-xs">
                          {task.createdBy.name}
                        </p>
                      )}
                    </div>
                    {task.assignedTo && (
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarImage src={task.assignedTo.image} />
                        <AvatarFallback className="text-xs">
                          {task.assignedTo.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  {(task.createdAt || task.updatedAt) && (
                    <p className="m-0 text-muted-foreground text-xs mt-2">
                      {task.createdAt &&
                      task.updatedAt &&
                      task.createdAt !== task.updatedAt
                        ? `${shortDateFormatter.format(
                            new Date(task.createdAt)
                          )} - ${shortDateFormatter.format(
                            new Date(task.updatedAt)
                          )}`
                        : shortDateFormatter.format(
                            new Date(task.createdAt || task.updatedAt)
                          )}
                    </p>
                  )}
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  );
}
