"use client";

import { useParams, useRouter } from "next/navigation";
import { useReview } from "@/components/reviews/hooks/use-review";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { RubricDisplay } from "@/components/reviews/rubric-display";
import { PublishReviewButton } from "@/components/reviews/publish-review-button";
import { useSession } from "next-auth/react";
import {
  calculateReviewStatus,
  getStatusColor,
  formatStatus,
} from "@/utils/review-status";

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params.id as string;
  const { data: session } = useSession();

  const { data: review, isLoading, error } = useReview(reviewId);
  // Check permissions based on user role
  const canPublish =
    session?.user &&
    review &&
    (() => {
      const userGroups = session.user.groups || [];
      if (
        (userGroups as string[]).includes("admin") ||
        (userGroups as string[]).includes("manager")
      ) {
        return true;
      }
      if ((userGroups as string[]).includes("staff")) {
        return review.createdBy.id === session.user.id;
      }
      return false;
    })();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold text-destructive">
          Review Not Found
        </h2>
        <p className="text-muted-foreground">
          The review you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{review.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canPublish && (
            <PublishReviewButton
              reviewId={review.id}
              isPublished={review.isPublished}
              canPublish={canPublish}
              variant="default"
              size="default"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="font-medium mb-2">Start Date</h4>
                <p className="text-muted-foreground">
                  {review.startDate
                    ? format(new Date(review.startDate), "PPP")
                    : "Not set"}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">End Date</h4>
                <p className="text-muted-foreground">
                  {review.endDate
                    ? format(new Date(review.endDate), "PPP")
                    : "Not set"}
                </p>
              </div>
              {review.publishedAt && (
                <div>
                  <h4 className="font-medium mb-2">Published At</h4>
                  <p className="text-muted-foreground">
                    {format(new Date(review.publishedAt), "PPP 'at' pp")}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Created By
            </CardTitle>
          </CardHeader>
          <CardContent>
            {review.createdBy ? (
              <div className="space-y-2">
                <p className="font-medium">{review.createdBy.name}</p>
                <p className="text-sm text-muted-foreground">
                  {review.createdBy.email}
                </p>
                <Badge variant="outline">{review.createdBy.role}</Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">Unknown creator</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Review Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Publication Status</h4>
                <Badge variant={review.isPublished ? "default" : "secondary"}>
                  {review.isPublished ? "Published" : "Not Published"}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Review Status</h4>
                {(() => {
                  const dynamicStatus = calculateReviewStatus(
                    review.startDate,
                    review.endDate
                  );
                  return (
                    <Badge
                      variant="outline"
                      className={getStatusColor(dynamicStatus)}
                    >
                      {formatStatus(dynamicStatus)}
                    </Badge>
                  );
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <RubricDisplay rubric={review.rubricsInfo} />
      </div>
    </div>
  );
}
