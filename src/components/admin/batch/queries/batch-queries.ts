interface CreateBatchRequest {
  name: string;
  graduationYear: number;
  departmentId: string;
  section: string;
  isActive: boolean;
}

interface UpdateBatchRequest extends Partial<CreateBatchRequest> {
  id: string;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/batch`;

const batchQueries = {
  createBatch: async (data: CreateBatchRequest, accessToken: string) => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create batch");
    }
    return response.json();
  },

  updateBatch: async (data: UpdateBatchRequest, accessToken: string) => {
    const { id, ...updateData } = data;
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update batch");
    }
    return response.json();
  },

  deleteBatch: async (batchId: string, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/${batchId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete batch");
    }
    return response.json();
  },

  getBatchById: async (batchId: string, accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/${batchId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch batch");
    }
    return response.json();
  },

  getBatchStudents: async (
    batchId: string,
    accessToken: string,
    page: number,
    size: number,
    searchQuery?: string
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    let url = `${API_BASE_URL}/${batchId}/students`;

    if (searchQuery && searchQuery.trim() !== "") {
      params.append("query", searchQuery);
      url = `${API_BASE_URL}/${batchId}/students/search`;
    }

    const response = await fetch(`${url}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch students");
    }
    return response.json();
  },
};

export default batchQueries;
