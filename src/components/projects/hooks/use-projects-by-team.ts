import { useQuery } from "@tanstack/react-query";
import { projectQueries } from "@/repo/project-queries/project-queries";

export const useProjectsByTeam = (teamId: string) => {
  return useQuery({
    queryKey: ["projects", "team", teamId],
    queryFn: async () => {
      return projectQueries.fetchProjectByTeamId(teamId);
    },
    enabled: !!teamId,
  });
};
