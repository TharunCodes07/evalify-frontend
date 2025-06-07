import axiosInstance from "@/lib/axios/axios-client";
import {
  CreateTeamRequest,
  UpdateTeamRequest,
} from "@/components/teams/types/types";

const teamQueries = {
  createTeam: async (team: CreateTeamRequest) => {
    const response = await axiosInstance.post("/teams", team);
    return response.data;
  },
  updateTeam: async (teamId: string, team: UpdateTeamRequest) => {
    const response = await axiosInstance.put(`/teams/${teamId}`, team);
    return response.data;
  },
  deleteTeam: async (teamId: string) => {
    const response = await axiosInstance.delete(`/teams/${teamId}`);
    return response.data;
  },
  getTeamById: async (teamId: string) => {
    const response = await axiosInstance.get(`/teams/${teamId}`);
    return response.data;
  },
};

export default teamQueries;
