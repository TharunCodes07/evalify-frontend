export type ReviewStatus = "PENDING" | "LIVE" | "OVERDUE" | "COMPLETED" | "CANCELLED";

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

  // If current time is before start time - review is pending
  if (now < start) {
    return "PENDING";
  }

  // If current time is between start and end time - review is live/active
  if (now >= start && now <= end) {
    return "LIVE";
  }

  // If current time is after end time - check if it's overdue or completed
  if (now > end) {
    // If it's been more than 7 days past end date, consider it completed
    const weekAfterEnd = new Date(end);
    weekAfterEnd.setDate(weekAfterEnd.getDate() + 7);
    
    if (now > weekAfterEnd) {
      return "COMPLETED";
    } else {
      return "OVERDUE";
    }
  }

  return "PENDING";
}

/**
 * Get the color class for review status badge
 */
export function getStatusColor(status: ReviewStatus): string {
  switch (status) {
    case "LIVE":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    case "PENDING":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    case "OVERDUE":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    case "COMPLETED":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
    case "CANCELLED":
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
  }
}

/**
 * Format status for display
 */
export function formatStatus(status: ReviewStatus): string {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "LIVE":
      return "Live";
    case "OVERDUE":
      return "Overdue";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
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
