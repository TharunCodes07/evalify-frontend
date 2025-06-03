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
}

export enum ProjectStatus {
  PROPOSED = "PROPOSED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
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
}

export interface Semester extends Record<string, unknown> {
  id: string;
  name: string;
  year: number;
  isActive: boolean;
}

export interface Batch extends Record<string, unknown> {
    id: string,
    name: string,
    batch: string,
    department: string,
    section: string,
    isActive: boolean,
}

export interface Course extends Record<string, unknown> {
    id: string;
    name: string;
    description: string;
    type: CourseType;
}

enum CourseType {
    CORE,
    ELECTIVE,
    MICRO_CREDENTIAL
}