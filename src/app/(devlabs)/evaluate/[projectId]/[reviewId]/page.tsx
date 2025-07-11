"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { projectQueries } from "@/repo/project-queries/project-queries";
import { individualScoreQueries } from "@/repo/individual-score-queries/individual-score-queries";
import reviewQueries from "@/repo/review-queries/review-queries";
import teamQueries from "@/repo/team-queries/team-queries";
import { CourseEvaluationForm } from "@/components/evaluations/CourseEvaluationForm";
import { FileList } from "@/components/file-upload/file-list";
import { ReviewResults } from "@/components/results/review-results";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProjectWithTeam, CourseEvaluationSummary } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

function CourseSelector({
  summary,
  project,
  reviewId,
}: {
  summary: CourseEvaluationSummary;
  project: ProjectWithTeam;
  reviewId: string;
}) {
  const user = useCurrentUser();

  const canEvaluateCourse = (course: { instructors: { id: string }[] }) => {
    if (!user) return false;
    const userGroups = user.groups || [];
    if (
      (userGroups as string[]).includes("admin") ||
      (userGroups as string[]).includes("manager")
    )
      return true;
    if ((userGroups as string[]).includes("faculty")) {
      return course.instructors.some((instructor) => instructor.id === user.id);
    }
    return false;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Select Course</CardTitle>
        <CardDescription>
          {project.title} • {summary.reviewName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {summary.courseEvaluations.map((course) => {
          const canEvaluate = canEvaluateCourse(course);
          return (
            <div
              key={course.courseId}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1 mb-3 sm:mb-0">
                <h3 className="font-medium">{course.courseName}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.instructors.map((i) => i.name).join(", ")}
                </p>
                <Badge
                  variant={course.hasEvaluation ? "default" : "outline"}
                  className="w-fit"
                >
                  {course.hasEvaluation ? "Completed" : "Pending"}
                </Badge>
              </div>
              <Button
                asChild={canEvaluate}
                disabled={!canEvaluate}
                size="sm"
                className="w-full sm:w-auto"
              >
                {canEvaluate ? (
                  <Link
                    href={`/evaluate/${project.id}/${reviewId}?courseId=${course.courseId}`}
                  >
                    {course.hasEvaluation ? "Edit" : "Start"}
                  </Link>
                ) : (
                  <span>{course.hasEvaluation ? "Edit" : "Start"}</span>
                )}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default function EvaluationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const projectId = params.projectId as string;
  const reviewId = params.reviewId as string;
  const courseId = searchParams.get("courseId");

  const user = useCurrentUser();

  const { data: project, isLoading: isLoadingProject } =
    useQuery<ProjectWithTeam>({
      queryKey: ["project", projectId],
      queryFn: () => projectQueries.fetchProjectByProjectId(projectId),
      enabled: !!projectId,
    });

  const { data: review } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => reviewQueries.getReviewById(reviewId),
    enabled: !!reviewId,
  });

  const { data: team } = useQuery({
    queryKey: ["team", project?.teamId],
    queryFn: () => teamQueries.getTeamById(project!.teamId),
    enabled: !!project?.teamId,
  });

  // Function to create directory path: teamname-teamid/projectname-projectid/reviewname-reviewid
  // This is now handled by the backend automatically based on the parameters sent

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["evaluationSummary", reviewId, projectId],
    queryFn: () =>
      individualScoreQueries.fetchEvaluationSummary(
        reviewId,
        projectId,
        user!.id
      ),
    enabled: !courseId && !!reviewId && !!projectId && !!user,
  });

  const { data: evaluationData, isLoading: isLoadingEvaluationData } = useQuery(
    {
      queryKey: ["courseEvaluationData", reviewId, projectId, courseId],
      queryFn: () =>
        individualScoreQueries.fetchCourseEvaluationData(
          reviewId,
          projectId,
          courseId!,
          user!.id
        ),
      enabled: !!courseId && !!reviewId && !!projectId && !!user,
    }
  );

  if (isLoadingProject || isLoadingSummary || isLoadingEvaluationData) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-9 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        {courseId && (
          <div className="w-fit border rounded-sm bg-background shadow-sm">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-medium hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course Selection
            </Button>
          </div>
        )}

        {!courseId && project && summary && (
          <div className="w-fit border rounded-sm bg-background shadow-sm">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-medium hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Project Selection
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Project Evaluation</h1>
          <p className="text-muted-foreground">
            Evaluate team members based on defined criteria
          </p>
        </div>

        {project && (
          <div className="space-y-6">
            <FileList
              projectId={projectId}
              projectName={project.title}
              reviewId={reviewId}
              reviewName={review?.name}
              teamId={project.teamId}
              teamName={team?.name}
            />
          </div>
        )}

        {!courseId && project && summary && (
          <CourseSelector
            summary={summary}
            project={project}
            reviewId={reviewId}
          />
        )}

        {courseId && evaluationData && (
          <CourseEvaluationForm
            evaluationData={evaluationData}
            projectId={projectId}
            reviewId={reviewId}
          />
        )}
      </div>
    </div>
  );
}
