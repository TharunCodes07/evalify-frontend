import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function QuestionSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Question title */}
            <Skeleton className="h-6 w-3/4" />
            {/* Question type badge */}
            <Skeleton className="h-5 w-24" />
          </div>
          {/* Action buttons */}
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Question text */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Options/Content area */}
        <div className="space-y-2 mt-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function QuestionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <QuestionSkeleton key={i} />
      ))}
    </div>
  );
}
