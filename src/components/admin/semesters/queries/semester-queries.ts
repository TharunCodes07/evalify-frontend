import { Course, Semester } from "@/types/types";
import { Session } from "next-auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface DataTableResponse {
  data: Semester[];
  pagination: {
    total_pages: number;
    current_page: number;
    per_page: number;
    total_count: number;
  };
}
const semesterQueries = {
  getSemesters: async (
    session: Session,
    searchQuery?: string,
    page: number = 0,
    size: number = 10,
    columnFilters?: Record<string, string[]>
  ): Promise<DataTableResponse> => {
    if (!session.user) throw new Error("User not authenticated");

    const isActiveFilter = columnFilters?.isActive?.[0];
    let endpoint = "/semester";
    const params = new URLSearchParams();

    if (searchQuery) {
      endpoint = `/semester/search`;
      params.append("query", searchQuery);
      params.append("page", page.toString());
      params.append("size", size.toString());
    } else {
      params.append("page", page.toString());
      params.append("size", size.toString());
    }

    const url = `${API_BASE_URL}${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      let filteredData = data;

      if (isActiveFilter !== undefined) {
        const isActiveValue = isActiveFilter === "true";
        filteredData = filteredData.filter(
          (semester: Semester) => semester.isActive === isActiveValue
        );
      }

      return {
        data: filteredData,
        pagination: {
          total_pages: 1,
          current_page: 0,
          per_page: filteredData.length,
          total_count: filteredData.length,
        },
      };
    }

    if (data.pagination) {
      return data as DataTableResponse;
    }

    if (data.data) {
      return {
        data: data.data,
        pagination: {
          total_pages: 1,
          current_page: 0,
          per_page: data.data.length,
          total_count: data.data.length,
        },
      };
    }

    return {
      data: [],
      pagination: {
        total_pages: 0,
        current_page: 0,
        per_page: size,
        total_count: 0,
      },
    };
  },

  getSemester: async (session: Session, id: string): Promise<Semester> => {
    if (!session.user) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/semester/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  createSemester: async (
    session: Session,
    semester: Omit<Semester, "id">
  ): Promise<Semester> => {
    if (!session.accessToken) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/semester`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(semester),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  updateSemester: async (
    session: Session,
    semester: Semester
  ): Promise<Semester> => {
    if (!session.accessToken) throw new Error("User not authenticated");

    const response = await fetch(
      `${API_BASE_URL}/api/semester/${semester.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(semester),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  deleteSemester: async (session: Session, id: string): Promise<any> => {
    if (!session.accessToken) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/api/semester/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getSemesterById: async (session: Session, id: string): Promise<Semester> => {
    if (!session.accessToken) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/semester/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getCourseBySemesterId: async (
    session: Session,
    id: string
  ): Promise<Course[]> => {
    if (!session.accessToken) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}/semester/${id}/courses`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

export default semesterQueries;
