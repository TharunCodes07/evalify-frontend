"use client";

import { useQuery } from "@tanstack/react-query";
import { evaluationQueries } from "@/repo/evaluation-queries";
import ReviewCard from "./ReviewCard";
import { ProjectReviewsResponse } from "@/types/types";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ProjectReviewsProps {
  projectId: string;
  projectCourses: { id: string; name: string; code?: string }[];
}

export default function ProjectReviews({
  projectId,
  projectCourses,
}: ProjectReviewsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: reviewsResponse,
    isLoading,
    error,
  } = useQuery<ProjectReviewsResponse>({
    queryKey: ["projectReviews", projectId],
    queryFn: () => evaluationQueries.fetchReviewsForProject(projectId),
  });

  if (isLoading) return <div>Loading reviews...</div>;
  if (error) return <div>Error loading reviews.</div>;

  if (!reviewsResponse || !reviewsResponse.hasReview) {
    return <p>No reviews found for this project.</p>;
  }

  const allReviews = [
    ...reviewsResponse.liveReviews.map((r) => ({
      ...r,
      status: "LIVE" as const,
    })),
    ...reviewsResponse.upcomingReviews.map((r) => ({
      ...r,
      status: "SCHEDULED" as const,
    })),
    ...reviewsResponse.completedReviews.map((r) => ({
      ...r,
      status: "COMPLETED" as const,
    })),
  ];

  const filteredReviews = allReviews.filter((review) =>
    review.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Input
        type="text"
        placeholder="Search reviews by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              projectId={projectId}
              projectCourses={projectCourses}
            />
          ))
        ) : (
          <p className="text-muted-foreground col-span-full">
            No reviews match your search.
          </p>
        )}
      </div>
    </div>
  );
}
