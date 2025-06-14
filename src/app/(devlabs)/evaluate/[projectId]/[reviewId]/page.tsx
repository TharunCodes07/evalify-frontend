"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { projectQueries } from "@/repo/project-queries/project-queries";
import { individualScoreQueries } from "@/repo/individual-score-queries/individual-score-queries";
import { CourseEvaluationForm } from "@/components/evaluations/CourseEvaluationForm";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

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

    // Admin and Manager can evaluate any course
    if (user.role === "ADMIN" || user.role === "MANAGER") return true;

    // Faculty can only evaluate their own courses
    if (user.role === "FACULTY") {
      return course.instructors.some((instructor) => instructor.id === user.id);
    }

    return false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Course to Evaluate</CardTitle>
        <CardDescription>
          Project: {project.title} | Review: {summary.reviewName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Instructors</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.courseEvaluations.map((course) => {
              const canEvaluate = canEvaluateCourse(course);
              return (
                <TableRow key={course.courseId}>
                  <TableCell className="font-medium">
                    {course.courseName}
                  </TableCell>
                  <TableCell>
                    {course.instructors.map((i) => i.name).join(", ")}
                  </TableCell>
                  <TableCell>
                    {course.hasEvaluation ? (
                      <Badge variant="secondary">Evaluated</Badge>
                    ) : (
                      <Badge variant="outline">Not Evaluated</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {canEvaluate ? (
                      <Link
                        href={`/evaluate/${project.id}/${reviewId}?courseId=${course.courseId}`}
                      >
                        <Button variant="default" size="sm">
                          {course.hasEvaluation
                            ? "View/Edit Evaluation"
                            : "Start Evaluation"}
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="default" size="sm" disabled>
                        {course.hasEvaluation
                          ? "View/Edit Evaluation"
                          : "Start Evaluation"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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

  const isLoading =
    isLoadingProject || isLoadingSummary || isLoadingEvaluationData;

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading evaluation data...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        {courseId && (
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Course Selection
          </Button>
        )}
        <div className="my-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Project Evaluation
          </h1>
          <p className="text-lg text-muted-foreground">
            A modern, user-friendly evaluation experience.
          </p>
        </div>
      </div>

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
  );
}
