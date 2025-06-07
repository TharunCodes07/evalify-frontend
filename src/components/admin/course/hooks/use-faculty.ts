import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { courseQueries } from "../queries/course-queries";

export const useFaculty = () => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useQuery({
    queryKey: ["faculty"],
    queryFn: () => {
      if (!accessToken) throw new Error("Not authenticated");
      return courseQueries.getFaculty(accessToken);
    },
    enabled: !!accessToken,
  });
};
