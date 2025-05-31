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
