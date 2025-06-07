import { User } from "@/components/admin/users/types/types";

interface CreateUserData {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  password: string;
  isActive: boolean;
}

interface UpdateUserData extends Omit<CreateUserData, "password"> {
  id: string;
}

const userQueries = {
  createUser: async (
    data: CreateUserData,
    accessToken: string
  ): Promise<User> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create user");
    }

    return response.json();
  },

  updateUser: async (
    data: UpdateUserData,
    accessToken: string
  ): Promise<User> => {
    const { id, ...updateData } = data;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user");
    }

    return response.json();
  },

  deleteUser: async (userId: string, accessToken: string): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete user");
    }
  },

  bulkDeleteUsers: async (
    userIds: (string | number)[],
    accessToken: string
  ): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/bulk`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(userIds),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete users");
    }
  },

  assignUsersToBatch: async (
    data: { userIds: (string | number)[]; batchId: string },
    accessToken: string
  ): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/batch/${data.batchId}/add-students`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data.userIds),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to assign users to batch");
    }
  },

  fetchUsersByRole: async (
    role: string,
    accessToken: string
  ): Promise<User[]> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/role/${role}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch users");
    }

    return response.json();
  },

  searchStudents: async (
    query: string,
    accessToken: string
  ): Promise<User[]> => {
    if (!query) {
      return [];
    }
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/teams/students/search?query=${encodeURIComponent(query)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search students");
    }

    const result = await response.json();
    return Array.isArray(result) ? result : result.data || [];
  },

  fetchUserById: async (userId: string, accessToken: string): Promise<User> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user");
    }

    return response.json();
  },
};

export default userQueries;
