import teamQueries from "@/repo/team-queries/team-queries";
import { useQuery } from "@tanstack/react-query";

export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      return teamQueries.getTeamById(teamId);
    },
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000, // 5 minutes - team data doesn't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
