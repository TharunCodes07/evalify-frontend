export interface CreateProjectRequest {
  title: string;
  description: string;
  objectives?: string;
  courseId?: string;
  teamId: string;
}
