import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { projectQueries } from "@/components/projects/queries/project-queries";

export const useProjectsByTeam = (teamId: string) => {
  const { data: session } = useSession();
  const user = session?.user;

  return useQuery({
    queryKey: ["projects", "team", teamId],
    queryFn: async () => {
      if (!user || !session?.accessToken) {
        throw new Error("User not authenticated");
      }
      return projectQueries.fetchProjectByTeamId(teamId, session.accessToken);
    },
    enabled: !!user && !!teamId,
  });
};
