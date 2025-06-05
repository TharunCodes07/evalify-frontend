import { Project } from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchProject = async (
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
};
