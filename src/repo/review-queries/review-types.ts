export interface CreateReviewRequest {
  name: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  rubricsId: string; // UUID
  userId: string; // UUID of the user creating the review
  semesterIds?: string[]; // Optional array of UUIDs
  batchIds?: string[]; // Optional array of UUIDs
  courseIds?: string[];
  projectIds?: string[]; // Optional array of UUIDs
}

export interface UpdateReviewRequest {
  name?: string;
  startDate?: string;
  endDate?: string;
  rubricsId?: string;
  userId: string; // UUID of the user updating the review
  semesterIds?: string[];
  batchIds?: string[];
  courseIds?: string[];
  projectIds?: string[];
}

interface DepartmentResponse {
  id: string;
  name: string;
}

interface CourseResponse {
  id: string;
  name: string;
  code: string;
}

interface CriterionResponse {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  isCommon: boolean;
}

export interface RubricsResponse {
  id: string;
  name: string;
  criteria: CriterionResponse[];
}

export interface SemesterResponse {
  id: string;
  name: string;
  year: number;
  isActive: boolean;
}

export interface BatchResponse {
  id: string;
  name: string;
  graduationYear: number;
  section: string;
  department: DepartmentResponse;
  isActive: boolean;
}

export interface ProjectResponse {
  id: string;
  title: string;
  description: string;
  courses: CourseResponse[];
  status: "ONGOING" | "PROPOSED";
}

export interface ReviewResponse {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  rubrics: RubricsResponse;
  semesters: SemesterResponse[];
  batches: BatchResponse[];
  courses: CourseResponse[];
  projects: ProjectResponse[];
}
