import axiosInstance from "@/lib/axios/axios-client";
import { StudentCourse } from "@/types/types";

export const courseQueries = {
  getActiveCourses: async () => {
    const response = await axiosInstance.get("/api/course/active");
    return response.data;
  },
  getCourseByUserId: async (userId: string) => {
    const response = await axiosInstance.get(
      `/api/course/${userId}/active-courses`
    );
    return response;
  },
  getCourseByStudentId: async (studentId: string): Promise<StudentCourse[]> => {
    const response = await axiosInstance.get(
      `/api/course/student/${studentId}/courses-with-scores`
    );
    return response.data;
  },
  getCourseById: async (courseId: string) => {
    const response = await axiosInstance.get(`/api/course/${courseId}`);
    return response.data;
  },
  assignBatchesToCourse: async (courseId: string, batchIds: string[]) => {
    const response = await axiosInstance.put(
      `/api/course/${courseId}/addBatch`,
      batchIds
    );
    return response.data;
  },
  removeBatchFromCourse: async (courseId: string, batchId: string) => {
    const response = await axiosInstance.put(
      `/api/course/${courseId}/remove-batch`,
      {
        batchId: [batchId],
      }
    );
    return response.data;
  },
  assignStudentsToCourse: async (courseId: string, studentIds: string[]) => {
    const response = await axiosInstance.put(
      `/api/course/${courseId}/add-student`,
      {
        studentId: studentIds,
      }
    );
    return response.data;
  },
  removeStudentFromCourse: async (courseId: string, studentId: string) => {
    const response = await axiosInstance.put(
      `/api/course/${courseId}/remove-student`,
      {
        studentId: [studentId],
      }
    );
    return response.data;
  },
  assignInstructorsToCourse: async (
    courseId: string,
    instructorIds: string[]
  ) => {
    const response = await axiosInstance.put(
      `/api/course/${courseId}/add-instructor`,
      {
        instructorId: instructorIds,
      }
    );
    return response.data;
  },
  removeInstructorFromCourse: async (
    courseId: string,
    instructorId: string
  ) => {
    const response = await axiosInstance.put(
      `/api/course/${courseId}/remove-instructor`,
      {
        instructorId: [instructorId],
      }
    );
    return response.data;
  },
};
