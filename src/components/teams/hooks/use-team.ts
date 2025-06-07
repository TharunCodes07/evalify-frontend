import { useQuery } from "@tanstack/react-query";
import teamQueries from "@/components/teams/queries/team-queries";

export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      return teamQueries.getTeamById(teamId);
    },
    enabled: !!teamId,
  });
};
