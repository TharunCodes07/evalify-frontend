import { User} from "@/components/admin/users/types/types";

interface CreateUserData {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  password: string;
  isActive: boolean;
}

interface UpdateUserData extends Omit<CreateUserData, 'password'> {
  id: string;
}

const userQueries = {

  createUser: async (data: CreateUserData, accessToken: string): Promise<User> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create user");
    }

    return response.json();
  },

  updateUser: async (data: UpdateUserData, accessToken: string): Promise<User> => {
    const { id, ...updateData } = data;
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user");
    }

    return response.json();
  },

  deleteUser: async (userId: string, accessToken: string): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete user");
    }
  },
};

export default userQueries;
