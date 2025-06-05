export interface Team extends Record<string, unknown> {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  projectCount: number;
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
  phoneNumber?: string;
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
  courseId: string;
  createdAt: string;
  updatedAt: string;
  githubUrl?: string | null;
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

export interface Batch extends Record<string, unknown> {
  id: string;
  name: string;
  batch: string;
  department: string;
  section: string;
  isActive: boolean;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  type: CourseType;
  _links?: {
    self: {
      href: string;
    };
  };
}

enum CourseType {
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


export interface Review {
  reviewId: string
  reviewName: string
  reviewDate: string
  averageScore: number
  maxPossibleScore: number
  criteriaBreakdown: {
    criterionName: string
    averageScore: number
    maxScore: number
  }[]
}

export interface CourseData {
  id: string
  name: string
  description: string
  type: "CORE" | "ELECTIVE" | "MICRO_CREDENTIAL"
  progressPercentage: number
  totalProjects: number
  activeProjects: number
  completedProjects: number
  projects: Project[]
  reviewHistory: Review[]
  lastReviewDate: string | null
  totalReviews: number
}
