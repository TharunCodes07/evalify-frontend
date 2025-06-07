import {
  KanbanBoard,
  KanbanTask,
  CreateTaskRequest,
  UpdateTaskRequest,
  MoveTaskRequest,
} from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const kanbanAPI = {
  getKanbanBoard: async (
    projectId: string,
    accessToken: string
  ): Promise<KanbanBoard> => {
    const response = await fetch(
      `${API_BASE_URL}/kanban/project/${projectId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = response.json();
    return data;
  },

  createTask: async (
    request: CreateTaskRequest,
    accessToken: string
  ): Promise<KanbanTask> => {
    const response = await fetch(`${API_BASE_URL}/kanban/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  updateTask: async (
    taskId: string,
    request: UpdateTaskRequest,
    accessToken: string
  ): Promise<KanbanTask> => {
    const response = await fetch(`${API_BASE_URL}/kanban/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },
  moveTask: async (
    taskId: string,
    request: MoveTaskRequest,
    accessToken: string
  ): Promise<KanbanTask> => {
    const response = await fetch(
      `${API_BASE_URL}/kanban/tasks/${taskId}/move`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  deleteTask: async (taskId: string, accessToken: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/kanban/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },
};
