"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/use-toast";
import { Review } from "@/types/types";
import { Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import React from "react";

interface ReviewCardProps {
  review: Review;
  projectId: string;
  projectCourses: { id: string; name: string; code?: string }[];
}

export default function ReviewCard({
  review,
  projectId,
  projectCourses,
}: ReviewCardProps) {
  const user = useCurrentUser();
  const { error: showError } = useToast();
  const router = useRouter();
  const canEvaluate = !!(
    user &&
    user.groups &&
    ((user.groups as string[]).includes("admin") ||
      (user.groups as string[]).includes("staff") ||
      (user.groups as string[]).includes("manager"))
  );

  const isStudent = !!(
    user &&
    user.groups &&
    (user.groups as string[]).includes("student")
  );

  const getStatusBadgeClassName = (status: Review["status"]) => {
    switch (status) {
      case "LIVE":
        return "bg-green-500 hover:bg-green-600 text-white border-green-500";
      case "SCHEDULED":
        return "bg-blue-500 hover:bg-blue-600 text-white border-blue-500";
      case "COMPLETED":
        return "bg-purple-500 hover:bg-purple-600 text-white border-purple-500";
      case "CANCELLED":
        return "bg-red-500 hover:bg-red-600 text-white border-red-500";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white border-gray-500";
    }
  };
  const handleViewResults = () => {
    if (review.status === "COMPLETED") {
      if (canEvaluate) {
        router.push(`/results/${review.id}/${projectId}`);
      } else if (isStudent) {
        if (review.isPublished) {
          router.push(`/results/${review.id}/${projectId}`);
        } else {
          showError("Results not yet published");
        }
      }
    }
  };

  const relevantCourses = review.courses.filter((course) =>
    projectCourses.some((pc) => pc.id === course.id)
  );

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="font-bold">{review.name}</span>
          <Badge className={getStatusBadgeClassName(review.status)}>
            {review.status}
          </Badge>
        </CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
          <Calendar className="mr-2 h-4 w-4" />
          {format(new Date(review.startDate), "MMM d, yyyy")} -
          {format(new Date(review.endDate), "MMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center text-sm">
          <Tag className="mr-2 h-4 w-4" />
          <span className="font-semibold">Rubric:&nbsp;</span>
          <span>{review.rubricsInfo.name}</span>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Relevant Courses</h4>
          <div className="flex flex-wrap gap-1">
            {relevantCourses.slice(0, 3).map((course) => (
              <Badge key={course.id} variant="secondary">
                {course.name}
              </Badge>
            ))}
            {relevantCourses.length > 3 && (
              <Badge variant="outline">
                +{relevantCourses.length - 3} more
              </Badge>
            )}
            {relevantCourses.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No courses in this review match the project&apos;s courses.
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {review.status === "LIVE" && canEvaluate && (
          <Link href={`/evaluate/${projectId}/${review.id}`} className="w-full">
            <Button className="w-full">Evaluate</Button>
          </Link>
        )}
        {review.status === "COMPLETED" && (
          <Button
            variant="outline"
            className={`w-full ${
              isStudent && !review.isPublished
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleViewResults}
          >
            View Results
          </Button>
        )}
        {review.status === "SCHEDULED" && (
          <Button variant="outline" className="w-full" disabled>
            Upcoming
          </Button>
        )}
        {review.status === "CANCELLED" && (
          <Button variant="outline" className="w-full" disabled>
            Cancelled
          </Button>
        )}
        {review.status === "LIVE" && !canEvaluate && (
          <Button variant="outline" className="w-full" disabled>
            Live Review
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
