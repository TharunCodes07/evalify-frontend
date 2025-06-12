import axiosInstance from "@/lib/axios/axios-client";

const courseQueries = {
  getActiveCourses: async () => {
    const response = await axiosInstance.get("/api/course/active");
    return response.data;
  },
};

export default courseQueries;
