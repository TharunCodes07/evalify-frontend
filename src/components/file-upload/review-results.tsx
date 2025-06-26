import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/lib/axios/axios-client";
import { BarChart3, TrendingUp, Award, Eye, EyeOff } from "lucide-react";

interface ReviewResultsProps {
  reviewId: string;
  projectId: string;
}

interface ReviewResult {
  studentId: string;
  studentName: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  criteriaScores: {
    criteriaName: string;
    score: number;
    maxScore: number;
  }[];
}

interface ReviewResultsResponse {
  reviewId: string;
  reviewName: string;
  projectId: string;
  projectTitle: string;
  isPublished: boolean;
  results: ReviewResult[];
  teamAverage: number;
  maxPossibleScore: number;
}

const reviewResultsQueries = {
  getResults: async (
    reviewId: string,
    projectId: string
  ): Promise<ReviewResultsResponse> => {
    const response = await axiosInstance.get(
      `/results/review/${reviewId}/project/${projectId}`
    );
    return response.data;
  },
};

export function ReviewResults({ reviewId, projectId }: ReviewResultsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviewResults", reviewId, projectId],
    queryFn: () => reviewResultsQueries.getResults(reviewId, projectId),
    enabled: !!(reviewId && projectId),
    retry: (failureCount, error: unknown) => {
      // Don't retry if results are not published
      const axiosError = error as {
        response?: { status?: number; data?: { error?: string } };
      };
      if (
        axiosError?.response?.status === 403 ||
        axiosError?.response?.data?.error?.includes("published")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Review Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))}
          </div>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    const errorMessage =
      axiosError?.response?.data?.error || "Failed to load results";

    // Don't show results if they're not published
    if (errorMessage.includes("published")) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Review Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Unable to load results. {errorMessage}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return null;
  }

  const getGradeColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case "a+":
      case "a":
        return "bg-green-100 text-green-800 border-green-200";
      case "a-":
      case "b+":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "b":
      case "b-":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "c+":
      case "c":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getPerformanceIcon = (percentage: number) => {
    if (percentage >= 90) return <Award className="h-4 w-4 text-green-600" />;
    if (percentage >= 80)
      return <TrendingUp className="h-4 w-4 text-blue-600" />;
    if (percentage >= 70)
      return <BarChart3 className="h-4 w-4 text-yellow-600" />;
    return <BarChart3 className="h-4 w-4 text-red-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Review Results
          <Badge variant="secondary" className="ml-auto">
            Published
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Team Average
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {results.teamAverage.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {results.results.length}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Max Score</p>
                <p className="text-2xl font-bold text-purple-900">
                  {results.maxPossibleScore}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Toggle Details Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
            className="gap-2"
          >
            {showDetails ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Details
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Details
              </>
            )}
          </Button>
        </div>

        {/* Detailed Results */}
        {showDetails && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Individual Results</h3>
            <div className="grid gap-4">
              {results.results.map((result) => (
                <Card
                  key={result.studentId}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getPerformanceIcon(result.percentage)}
                      <div>
                        <h4 className="font-medium">{result.studentName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.totalScore} / {result.maxScore} points
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getGradeColor(result.grade)}>
                        {result.grade}
                      </Badge>
                      <span className="text-lg font-bold">
                        {result.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Criteria Breakdown */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Criteria Breakdown:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {result.criteriaScores.map((criteria, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-muted/50 rounded text-sm"
                        >
                          <span className="truncate mr-2">
                            {criteria.criteriaName}
                          </span>
                          <span className="font-medium">
                            {criteria.score}/{criteria.maxScore}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
