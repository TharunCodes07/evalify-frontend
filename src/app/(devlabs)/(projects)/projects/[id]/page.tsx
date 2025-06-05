"use client";
import { fetchProject } from "@/components/projects/queries/project-queries";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Project } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { useSession } from "next-auth/react";
import KanbanBoardPage from "@/components/projects/kanban-board/kanban";

export default function DevlabsProjectPage() {
  const { data: session } = useSession();
  const params = useParams();
  const {
    data: project,
    isLoading,
    error,
  } = useQuery<Project>({
    queryKey: ["project", params.id],
    queryFn: () =>
      fetchProject(params.id as string, session?.accessToken as string),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading project: {error.message}</div>;
  }

  return (
    <div>
      <h1>{project?.title}</h1>
      <p>{project?.description}</p>
      <Badge className="mb-2">{project?.status}</Badge>{" "}
      {project?.githubUrl && (
        <Link href={project?.githubUrl} target="_blank">
          <FaGithub className="w-5 h-5" />
        </Link>
      )}
      <KanbanBoardPage id={params.id as string} />
    </div>
  );
}
