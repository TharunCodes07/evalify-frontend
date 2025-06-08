import axiosInstance from "@/lib/axios/axios-client";
import { Project } from "@/types/types";
import { CreateProjectRequest } from "../types/types";

export const projectQueries = {
  fetchProjectByTeamId: async (teamId: string): Promise<Project[]> => {
    const response = await axiosInstance.get(`/projects/team/${teamId}`);
    return response.data.data || response.data;
  },

  fetchProjectByProjectId: async (projectId: string): Promise<Project> => {
    const response = await axiosInstance.get(`/projects/${projectId}`);
    return response.data.data || response.data;
  },
  createProject: async (project: CreateProjectRequest) => {
    const response = await axiosInstance.post("/projects", project);
    return response.data;
  },

  updateProject: async (project: Project) => {
    const response = await axiosInstance.put(
      `/projects/${project.id}`,
      project
    );
    return response.data;
  },

  deleteProject: async (projectId: string) => {
    const response = await axiosInstance.delete(`/projects/${projectId}`);
    return response.data;
  },
};
