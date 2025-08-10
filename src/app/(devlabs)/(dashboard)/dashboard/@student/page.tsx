"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardQueries } from "@/repo/dashboard-queries/dashboard-queries";
import StatCard from "@/components/dashboard/StatCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LoadingState from "@/components/dashboard/LoadingState";
import ErrorState from "@/components/dashboard/ErrorState";
import ReviewList from "@/components/dashboard/ReviewList";
import QuickActions from "@/components/dashboard/QuickActions";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { Button } from "@/components/ui/button";
import { FileText, FolderOpen, TrendingUp, Eye, BookOpen } from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", "student"],
    queryFn: dashboardQueries.getStudentDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading)
    return <LoadingState variant="skeleton" dashboardType="student" />;
  if (error || !data)
    return <ErrorState error={error?.message || "Failed to load dashboard"} />;

  const completionRate =
    data.totalReviews > 0
      ? (data.completedReviews / data.totalReviews) * 100
      : 0;
  const projectCompletionRate =
    data.totalProjects > 0
      ? (data.completedProjects / data.totalProjects) * 100
      : 0;

  const performanceMetrics = [
    {
      label: "Review Completion",
      value: Math.round(completionRate),
      color: "bg-blue-600",
    },
    {
      label: "Project Completion",
      value: Math.round(projectCompletionRate),
      color: "bg-green-600",
    },
  ];

  if (data.averageProjectScore > 0) {
    performanceMetrics.push({
      label: "Average Score",
      value: Math.round(data.averageProjectScore),
      color: "bg-orange-600",
    });
  }

  const quickActions = [
    {
      href: "/reviews/active",
      icon: FileText,
      title: "View Active Reviews",
      description: "Participate in ongoing evaluations",
    },
    {
      href: "/projects/my",
      icon: FolderOpen,
      title: "My Projects",
      description: "Check project status and submissions",
    },
    {
      href: "/results",
      icon: TrendingUp,
      title: "View Results",
      description: "Check published review results",
    },
    {
      href: "/courses/my",
      icon: BookOpen,
      title: "My Courses",
      description: "View enrolled courses and progress",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Student Dashboard"
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/reviews/active">
                <Eye className="h-4 w-4 mr-2" />
                Active Reviews
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/courses">
                <BookOpen className="h-4 w-4 mr-2" />
                My Courses
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Reviews"
          value={data.activeReviews}
          subtitle={`${data.completedReviews} completed of ${data.totalReviews} total`}
          icon={FileText}
          colorClass="text-blue-600"
        />
        <StatCard
          title="Active Projects"
          value={data.activeProjects}
          subtitle={`${data.completedProjects} completed of ${data.totalProjects} total`}
          icon={FolderOpen}
          colorClass="text-green-600"
        />
        <StatCard
          title="Review Completion Rate"
          value={`${Math.round(completionRate)}%`}
          subtitle={`${data.completedReviews}/${data.totalReviews} reviews`}
          icon={TrendingUp}
          colorClass="text-purple-600"
        />
        <StatCard
          title="Average Project Score"
          value={
            data.averageProjectScore > 0
              ? `${data.averageProjectScore.toFixed(1)}%`
              : "N/A"
          }
          subtitle="Overall performance"
          icon={TrendingUp}
          colorClass="text-orange-600"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ReviewList
          title="Upcoming Reviews"
          reviews={data.upcomingReviews}
          type="upcoming"
        />
        <ReviewList
          title="Recently Published Reviews"
          reviews={data.recentlyPublishedReviews}
          type="published"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PerformanceChart metrics={performanceMetrics} />
        <QuickActions actions={quickActions} />
      </div>
    </div>
  );
}
