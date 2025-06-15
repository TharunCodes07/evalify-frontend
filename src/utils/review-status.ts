export type ReviewStatus = "UPCOMING" | "LIVE" | "COMPLETED";

export interface ReviewPublicationStatus {
  reviewId: string;
  reviewName: string;
  isPublished: boolean;
  publishDate: string | null;
  canPublish?: boolean;
}

/**
 * Calculate the dynamic status of a review based ONLY on start time and end time
 * This is independent of publication status
 */
export function calculateReviewStatus(
  startDate: string | Date,
  endDate: string | Date
): ReviewStatus {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // If current time is before start time - review is upcoming
  if (now < start) {
    return "UPCOMING";
  }

  // If current time is between start and end time - review is live/active
  if (now >= start && now <= end) {
    return "LIVE";
  }

  // If current time is after end time - review is completed
  if (now > end) {
    return "COMPLETED";
  }

  return "UPCOMING";
}

/**
 * Get the color class for review status badge
 */
export function getStatusColor(status: ReviewStatus): string {
  switch (status) {
    case "LIVE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
    case "UPCOMING":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    case "COMPLETED":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
  }
}

/**
 * Format status for display
 */
export function formatStatus(status: ReviewStatus): string {
  switch (status) {
    case "UPCOMING":
      return "Upcoming";
    case "LIVE":
      return "Live";
    case "COMPLETED":
      return "Completed";
    default:
      return "Unknown";
  }
}

/**
 * Get status description with timing information
 */
export function getStatusDescription(
  _status: ReviewStatus,
  _startDate: string | Date,
  _endDate: string | Date
): string {
  // Return empty string to not show any timing descriptions
  return "";
}
