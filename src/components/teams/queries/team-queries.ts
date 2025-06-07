import {
  CreateTeamRequest,
  UpdateTeamRequest,
} from "@/components/teams/types/types";

const teamQueries = {
  createTeam: async (team: CreateTeamRequest, accessToken: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(team),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create team");
    }

    return response.json();
  },
  updateTeam: async (
    teamId: string,
    team: UpdateTeamRequest,
    accessToken: string
  ) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${teamId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(team),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update team");
    }

    return response.json();
  },
  deleteTeam: async (teamId: string, accessToken: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${teamId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete team");
    }

    return response.json();
  },
  getTeamById: async (teamId: string, accessToken: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${teamId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch team");
    }

    return response.json();
  },
};

export default teamQueries;
