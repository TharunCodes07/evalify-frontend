"use client";
import { useParams, useRouter } from "next/navigation";
import { resultQueries } from "@/repo/result-queries/result-queries";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Trophy,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const getScoreGrade = (percentage: number) => {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 80) return "Very Good";
  if (percentage >= 70) return "Good";
  if (percentage >= 60) return "Satisfactory";
  return "Needs Improvement";
};

const getScoreColor = (percentage: number) => {
  if (percentage >= 90) return "text-green-600 dark:text-green-400";
  if (percentage >= 80) return "text-blue-600 dark:text-blue-400";
  if (percentage >= 70) return "text-indigo-600 dark:text-indigo-400";
  if (percentage >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
};

const ResultsSkeleton = () => (
  <div className="container mx-auto p-6 space-y-6">
    <div className="flex items-center space-x-4 mb-6">
      <Skeleton className="h-9 w-32" />
    </div>

    <div className="space-y-2">
      <Skeleton className="h-8 w-80" />
      <Skeleton className="h-6 w-96" />
      <div className="flex items-center space-x-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>

    <div className="grid gap-6">
      {[1, 2].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="space-y-3 p-4 rounded-lg bg-muted/20 border"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default function ResultsPage() {
  const { reviewid, projectid } = useParams();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["results", reviewid, projectid, session?.user?.id],
    queryFn: () =>
      resultQueries.getResults(
        reviewid as string,
        projectid as string,
        session?.user?.id as string
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!reviewid && !!projectid && !!session?.user?.id,
  });

  if (sessionStatus === "loading" || isLoading) {
    return <ResultsSkeleton />;
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <AlertCircle className="h-12 w-12 text-amber-500" />
            <div className="text-center">
              <h2 className="text-lg font-semibold">Authentication Required</h2>
              <p className="text-muted-foreground">
                Please sign in to view results
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h2 className="text-lg font-semibold">Error Loading Results</h2>
              <p className="text-muted-foreground">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <AlertCircle className="h-12 w-12 text-slate-500" />
            <div className="text-center">
              <h2 className="text-lg font-semibold">No Results Found</h2>
              <p className="text-muted-foreground">
                No evaluation results are available for this project
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg hover:bg-muted/50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{results.projectTitle}</h1>
            <p className="text-lg text-muted-foreground">
              {results.reviewName} - Evaluation Results
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge
            variant={results.isPublished ? "default" : "secondary"}
            className={`text-xs ${
              results.isPublished
                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
            }`}
          >
            {results.isPublished ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Published
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                Not Published
              </>
            )}
          </Badge>
          {results.canViewAllResults && (
            <Badge variant="outline" className="text-xs">
              {results.results.length} Student
              {results.results.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {results.results.map((student, index) => (
          <Card
            key={`${student.studentId}-${index}`}
            className="overflow-hidden border-0 shadow-md"
          >
            <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/20 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-background rounded-full border">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {student.studentName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {getScoreGrade(student.percentage)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(
                      student.percentage
                    )}`}
                  >
                    {student.percentage.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {student.totalScore} / {student.maxPossibleScore} points
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Overall Score</span>
                  <span className="text-muted-foreground">
                    {student.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={student.percentage} className="h-2" />
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Assessment Breakdown
                </h3>

                {student.scores.map((criterion, criterionIndex) => {
                  const criterionPercentage =
                    (criterion.score / criterion.maxScore) * 100;

                  return (
                    <div
                      key={`${criterion.criterionId}-${criterionIndex}`}
                      className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-base text-foreground">
                          {criterion.criterionName}
                        </h4>
                        <Badge variant="outline" className="text-xs font-mono">
                          {criterion.score} / {criterion.maxScore}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Score</span>
                          <span className="font-medium text-foreground">
                            {criterionPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={criterionPercentage} className="h-2" />
                      </div>

                      {criterion.comment && (
                        <div className="mt-3 p-3 bg-background/50 rounded-md border border-border/30">
                          <p className="text-xs text-muted-foreground mb-1 font-medium">
                            Feedback:
                          </p>
                          <p className="text-sm text-foreground leading-relaxed">
                            {criterion.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
