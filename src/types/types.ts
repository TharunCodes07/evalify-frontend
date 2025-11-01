export interface Team extends Record<string, unknown> {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "STUDENT";
  profileImage?: string;
}

export interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  profileId: string;
  role: "STUDENT" | "ADMIN" | "FACULTY" | "MANAGER";
  phoneNumber: string;
  image?: string;
  isActive: boolean;
}

export interface Project extends Record<string, unknown> {
  id: string;
  title: string;
  description: string;
  objectives: string | null;
  status: ProjectStatus;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  githubUrl?: string | null;
  courses: { id: string; name: string; code?: string }[];
  teamMembers: User[];
}

export interface ProjectWithTeam extends Project {
  teamMembers: User[];
  courses: { id: string; name: string; code?: string }[];
}

export enum ProjectStatus {
  PROPOSED = "PROPOSED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export interface Semester extends Record<string, unknown> {
  id: string;
  name: string;
  year: number;
  isActive: boolean;
}

export interface Batch {
  id: string;
  name: string;
  graduationYear: number;
  section: string;
  isActive: boolean;
  students?: User[];
  managers?: User[];
  semester?: Semester[];
  department?: Department;
}

export interface Course extends Record<string, unknown> {
  id: string;
  name: string;
  code?: string;
  description: string;
  type: CourseType;
  createdAt: string;
  updatedAt: string;
}

export enum CourseType {
  CORE,
  ELECTIVE,
  MICRO_CREDENTIAL,
}

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  position: number;
  createdBy: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: string;
  name: string;
  position: number;
  tasks: KanbanTask[];
  createdAt: string;
  updatedAt: string;
}

export interface KanbanBoard {
  id: string;
  projectId: string;
  columns: KanbanColumn[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  columnId: string;
  assignedToId?: string;
  userId: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assignedToId?: string;
  userId: string;
}

export interface MoveTaskRequest {
  columnId: string;
  position: number;
  userId: string;
}

export interface ReviewHistory {
  reviewId: string;
  reviewName: string;
  reviewDate: string;
  averageScore: number;
  maxPossibleScore: number;
  criteriaBreakdown: {
    criterionName: string;
    averageScore: number;
    maxScore: number;
  }[];
}

export interface Review {
  id: string;
  name: string;
  status?: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  startDate: string;
  endDate: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  courses: {
    id: string;
    name: string;
    code: string;
    semesterInfo: {
      id: string;
      name: string;
      year: number;
      isActive: boolean;
    };
  }[];
  projects: { id: string; title: string }[];
  sections: { id: string; name: string }[];
  rubricsInfo: {
    id: string;
    name: string;
    criteria: Criterion[];
  };
}

export interface ProjectReviewsResponse {
  hasReview: boolean;
  assignmentType: string;
  liveReviews: Review[];
  upcomingReviews: Review[];
  completedReviews: Review[];
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  isCommon: boolean;
}

export interface EvaluationCriteria {
  reviewId: string;
  reviewName: string;
  criteria: Criterion[];
}

export interface CriterionScore {
  criterionId: string;
  score: number;
  comment?: string;
}

export interface EvaluationSubmission {
  reviewId: string;
  projectId: string;
  comments?: string;
  criterionScores: CriterionScore[];
}

export interface SubmittedEvaluation {
  id: string;
  reviewId: string;
  reviewName: string;
  projectId: string;
  projectTitle: string;
  evaluatorId: string;
  evaluatorName: string;
  comments?: string;
  criterionScores: (CriterionScore & {
    id: string;
    criterionName: string;
    maxScore: number;
  })[];
  totalScore: number;
  maxPossibleScore: number;
  status: "DRAFT" | "SUBMITTED";
  createdAt: string;
  updatedAt: string;
}

export interface CourseData {
  id: string;
  name: string;
  code?: string;
  description: string;
  type: "CORE" | "ELECTIVE" | "MICRO_CREDENTIAL";
  progressPercentage: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  projects: Project[];
  reviewHistory: ReviewHistory[];
  lastReviewDate: string | null;
  totalReviews: number;
}

export interface Department {
  id: string;
  name: string;
  batches?: Batch[];
}

export interface Lab {
  id: string;
  name: string;
  block: string;
  ipSubnet: string;
}

export interface DataTableResponse<T> {
  data: T[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}

export interface CourseEvaluationSummary {
  reviewId: string;
  reviewName: string;
  projectId: string;
  projectTitle: string;
  teamName: string;
  courseEvaluations: {
    courseId: string;
    courseName: string;
    instructors: {
      id: string;
      name: string;
    }[];
    hasEvaluation: boolean;
    evaluationCount: number;
  }[];
}

export interface CourseEvaluationData {
  courseId: string;
  courseName: string;
  projectId: string;
  reviewId: string;
  teamMembers: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
  criteria: {
    id: string;
    name: string;
    description: string;
    maxScore: number;
    courseSpecific: boolean;
    isCommon?: boolean;
  }[];
  existingScores?: {
    participantId: string;
    criterionScores: {
      criterionId: string;
      score: number;
      comment?: string;
    }[];
  }[];
  isPublished: boolean;
}

export interface IndividualScoreCriterionScore {
  criterionId: string;
  score: number;
  comment?: string;
}

export interface IndividualScoreParticipantScore {
  participantId: string;
  criterionScores: IndividualScoreCriterionScore[];
}

export interface IndividualScoreSubmission {
  userId: string;
  reviewId: string;
  projectId: string;
  courseId: string;
  scores: IndividualScoreParticipantScore[];
}

export interface StudentCourse {
  id: string;
  name: string;
  code: string;
  description: string;
  averageScorePercentage: number;
  reviewCount: number;
}

export interface ProjectResult {
  id: string;
  reviewName: string;
  projectId: string;
  projectTitle: string;
  isPublished: boolean;
  userRole: "STUDENT" | "FACULTY" | "MANAGER" | "ADMIN";
  canViewAllResults: boolean;
  results: {
    studentId: string;
    studentName: string;
    scores: {
      criterionId: string;
      criterionName: string;
      score: number;
      maxScore: number;
      comment?: string;
    }[];
    totalScore: number;
    maxPossibleScore: number;
    percentage: number;
  }[];
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN" | "FACULTY" | "MANAGER";
  createdAt: string;
}

export interface AdminDashboardData {
  userStats: {
    total: number;
    students: number;
    faculty: number;
    managers: number;
  };
  semesterStats: {
    total: number;
    active: number;
  };
  courseStats: {
    total: number;
    active: number;
  };
  batchStats: {
    total: number;
    active: number;
  };
  recentUsers: RecentUser[];
}

export interface UpcomingReview {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  courseName: string;
}

export interface RecentlyPublishedReview {
  reviewId: string;
  reviewName: string;
  courseName: string;
  publishedAt: string;
  publishedBy: string;
}

export interface ManagerStaffDashboardData {
  totalReviews: number;
  activeReviews: number;
  completedReviews: number;
  totalProjects: number;
  activeProjects: number;
  upcomingReviews: UpcomingReview[];
  recentlyPublishedReviews: RecentlyPublishedReview[];
}

export interface StudentDashboardData {
  totalReviews: number;
  activeReviews: number;
  completedReviews: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageProjectScore: number;
  upcomingReviews: UpcomingReview[];
  recentlyPublishedReviews: RecentlyPublishedReview[];
}
