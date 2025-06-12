"use client";
import { projectQueries } from "@/repo/project-queries/project-queries";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ProjectWithTeam } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import KanbanBoardPage from "@/components/projects/kanban-board/kanban";
import ProjectReviews from "@/components/projects/reviews/ProjectReviews";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function DevlabsProjectPage() {
  const params = useParams();
  const {
    data: project,
    isLoading,
    error,
  } = useQuery<ProjectWithTeam>({
    queryKey: ["project", params.id],
    queryFn: () => projectQueries.fetchProjectByProjectId(params.id as string),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>Error loading project: {error.message}</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge>{project.status}</Badge>
        </div>
      </div>

      <div className="space-y-6 mb-12">
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{project.description}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Team Members</h2>
          <div className="flex flex-wrap -space-x-2">
            {project.teamMembers?.map((member) => (
              <Avatar key={member.id} className="border-2 border-white">
                <AvatarImage src={member.image || ""} />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Courses</h2>
          <div className="flex flex-wrap gap-2">
            {project.courses?.map((course) => (
              <Badge key={course.id} variant="secondary">
                {course.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Task Board</CardTitle>
            <CardDescription>Manage your project&apos;s tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <KanbanBoardPage id={params.id as string} />
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12" />

      {project.courses && project.courses.length > 0 && (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <ProjectReviews
            projectId={project.id}
            projectCourses={project.courses}
          />
        </div>
      )}
    </main>
  );
}
