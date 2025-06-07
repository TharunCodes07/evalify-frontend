import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import teamQueries from "@/components/teams/queries/team-queries";

export const useTeam = (teamId: string) => {
  const { data: session } = useSession();
  const user = session?.user;

  return useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      if (!user || !session?.accessToken) {
        throw new Error("User not authenticated");
      }
      return teamQueries.getTeamById(teamId, session.accessToken);
    },
    enabled: !!user && !!teamId,
  });
};
