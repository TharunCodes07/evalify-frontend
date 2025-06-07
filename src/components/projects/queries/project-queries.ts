import { Project } from "@/types/types";
import { CreateProjectRequest } from "../types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const projectQueries = {
  fetchProjectByTeamId: async (
    teamId: string,
    accessToken: string
  ): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/projects/team/${teamId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  },

  fetchProjectByProjectId: async (
    projectId: string,
    accessToken: string
  ): Promise<Project> => {
    if (!accessToken) {
      throw new Error("User not authenticated");
    }
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  },
  createProject: async (project: CreateProjectRequest, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error("Failed to create project");
    }

    return response.json();
  },

  updateProject: async (project: Project, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${project.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error("Failed to update project");
    }

    return response.json();
  },

  deleteProject: async (projectId: string, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete project");
    }

    return response.json();
  },
};
