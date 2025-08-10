import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
        <div className="h-3 w-32 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

export function ReviewListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-lg p-3 space-y-2 animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="h-4 w-40 bg-muted rounded" />
                <div className="h-5 w-16 bg-muted rounded" />
              </div>
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="flex items-center gap-4">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-24 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center h-16 p-4 border rounded-lg animate-pulse"
            >
              <div className="h-4 w-4 bg-muted rounded mr-3" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-muted rounded mb-1" />
                <div className="h-3 w-48 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PerformanceChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-36 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-8 bg-muted rounded" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-muted h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentUsersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-24 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border rounded-lg p-3 animate-pulse"
            >
              <div>
                <div className="h-4 w-32 bg-muted rounded mb-1" />
                <div className="h-3 w-40 bg-muted rounded" />
              </div>
              <div className="text-right">
                <div className="h-3 w-16 bg-muted rounded mb-1" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between animate-pulse">
      <div className="h-9 w-48 bg-muted rounded" />
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-muted rounded" />
        <div className="h-8 w-20 bg-muted rounded" />
      </div>
    </div>
  );
}
