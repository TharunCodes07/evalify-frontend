import type { CourseData } from "./types";

export const dummyCourseData: CourseData[] = [
  {
    id: "1",
    name: "Data Structures & Algorithms",
    description:
      "Fundamental algorithms and data structures for efficient problem solving",
    type: "CORE",
    progressPercentage: 88,
    totalProjects: 1,
    activeProjects: 0,
    completedProjects: 1,
    projects: [
      {
        id: "project-1",
        name: "Graph Algorithm Implementation",
        description:
          "Implement various graph algorithms including Dijkstra's and A*",
        status: "COMPLETED",
        progressPercentage: 88,
      },
    ],
    reviewHistory: [
      {
        reviewId: "review-1",
        reviewName: "Mid-term Review",
        reviewDate: "2024-10-15",
        averageScore: 15.7,
        maxPossibleScore: 20,
        criteriaBreakdown: [
          {
            criterionName: "Code Quality",
            averageScore: 7.8,
            maxScore: 10,
          },
          {
            criterionName: "Problem Solving",
            averageScore: 7.9,
            maxScore: 10,
          },
        ],
      },
      {
        reviewId: "review-2",
        reviewName: "Final Review",
        reviewDate: "2024-12-15",
        averageScore: 17.6,
        maxPossibleScore: 20,
        criteriaBreakdown: [
          {
            criterionName: "Code Quality",
            averageScore: 8.7,
            maxScore: 10,
          },
          {
            criterionName: "Problem Solving",
            averageScore: 8.9,
            maxScore: 10,
          },
        ],
      },
    ],
    lastReviewDate: "2024-12-15",
    totalReviews: 2,
  },
  {
    id: "2",
    name: "Web Development",
    description: "Modern web development techniques and frameworks",
    type: "CORE",
    progressPercentage: 92,
    totalProjects: 1,
    activeProjects: 0,
    completedProjects: 1,
    projects: [
      {
        id: "project-2",
        name: "Full-Stack Web Application",
        description:
          "Build a complete web application with frontend and backend components",
        status: "COMPLETED",
        progressPercentage: 92,
      },
    ],
    reviewHistory: [
      {
        reviewId: "review-3",
        reviewName: "Mid-term Review",
        reviewDate: "2024-10-10",
        averageScore: 16.8,
        maxPossibleScore: 20,
        criteriaBreakdown: [
          {
            criterionName: "UI/UX Design",
            averageScore: 8.5,
            maxScore: 10,
          },
          {
            criterionName: "Code Structure",
            averageScore: 8.3,
            maxScore: 10,
          },
        ],
      },
      {
        reviewId: "review-4",
        reviewName: "Final Review",
        reviewDate: "2024-12-10",
        averageScore: 18.4,
        maxPossibleScore: 20,
        criteriaBreakdown: [
          {
            criterionName: "UI/UX Design",
            averageScore: 9.2,
            maxScore: 10,
          },
          {
            criterionName: "Code Structure",
            averageScore: 9.2,
            maxScore: 10,
          },
        ],
      },
    ],
    lastReviewDate: "2024-12-10",
    totalReviews: 2,
  },
  {
    id: "3",
    name: "Database Systems",
    description: "Design and implementation of database systems",
    type: "CORE",
    progressPercentage: 78,
    totalProjects: 1,
    activeProjects: 0,
    completedProjects: 1,
    projects: [
      {
        id: "project-3",
        name: "Database Design Project",
        description:
          "Design and implement a relational database for a business case",
        status: "COMPLETED",
        progressPercentage: 78,
      },
    ],
    reviewHistory: [
      {
        reviewId: "review-5",
        reviewName: "Mid-term Review",
        reviewDate: "2024-10-20",
        averageScore: 14.2,
        maxPossibleScore: 20,
        criteriaBreakdown: [
          {
            criterionName: "Schema Design",
            averageScore: 7.1,
            maxScore: 10,
          },
          {
            criterionName: "Query Optimization",
            averageScore: 7.1,
            maxScore: 10,
          },
        ],
      },
      {
        reviewId: "review-6",
        reviewName: "Final Review",
        reviewDate: "2024-12-20",
        averageScore: 15.6,
        maxPossibleScore: 20,
        criteriaBreakdown: [
          {
            criterionName: "Schema Design",
            averageScore: 7.8,
            maxScore: 10,
          },
          {
            criterionName: "Query Optimization",
            averageScore: 7.8,
            maxScore: 10,
          },
        ],
      },
    ],
    lastReviewDate: "2024-12-20",
    totalReviews: 2,
  },
  {
    id: "4",
    name: "Mobile App Development",
    description: "Creating applications for mobile platforms",
    type: "ELECTIVE",
    progressPercentage: 85,
    totalProjects: 1,
    activeProjects: 0,
    completedProjects: 1,
    projects: [
      {
        id: "project-4",
        name: "Cross-Platform Mobile App",
        description:
          "Develop a mobile application that works on multiple platforms",
        status: "COMPLETED",
        progressPercentage: 85,
      },
    ],
    reviewHistory: [
      {
        reviewId: "review-7",
        reviewName: "Mid-term Review",
        reviewDate: "2024-10-25",
        averageScore: 16.2,
        maxPossibleScore: 20,
        criteriaBreakdown: [
          {
            criterionName: "UI Design",
            averageScore: 8.1,
            maxScore: 10,
          },
          {
            criterionName: "Performance",
            averageScore: 8.1,
            maxScore: 10,
          },
        ],
      },
      {
        reviewId: "review-8",
        reviewName: "Final Review",
        reviewDate: "2024-12-25",
        averageScore: 17.0,
        maxPossibleScore: 20,
        criteriaBreakdown: [
          {
            criterionName: "UI Design",
            averageScore: 8.5,
            maxScore: 10,
          },
          {
            criterionName: "Performance",
            averageScore: 8.5,
            maxScore: 10,
          },
        ],
      },
    ],
    lastReviewDate: "2024-12-25",
    totalReviews: 2,
  },
  {
    id: "5",
    name: "Machine Learning",
    description: "Introduction to machine learning algorithms and applications",
    type: "ELECTIVE",
    progressPercentage: 90,
    totalProjects: 1,
    activeProjects: 0,
    completedProjects: 1,
    projects: [
      {
        id: "project-5",
        name: "Predictive Model Development",
        description:
          "Build and evaluate a machine learning model for prediction tasks",
        status: "COMPLETED",
        progressPercentage: 90,
      },
    ],
    reviewHistory: [
      {
        reviewId: "review-9",
        reviewName: "Mid-term Review",
        reviewDate: "2024-10-05",
        averageScore: 17.2,
        maxPossibleScore: 20,
        criteriaBreakdown: [
          {
            criterionName: "Model Accuracy",
            averageScore: 8.6,
            maxScore: 10,
          },
          {
            criterionName: "Implementation",
            averageScore: 8.6,
            maxScore: 10,
          },
        ],
      },
      {
        reviewId: "review-10",
        reviewName: "Final Review",
        reviewDate: "2024-12-05",
        averageScore: 18.0,
        maxPossibleScore: 20,
        criteriaBreakdown: [
          {
            criterionName: "Model Accuracy",
            averageScore: 9.0,
            maxScore: 10,
          },
          {
            criterionName: "Implementation",
            averageScore: 9.0,
            maxScore: 10,
          },
        ],
      },
    ],
    lastReviewDate: "2024-12-05",
    totalReviews: 2,
  },
  {
    id: "6",
    name: "Cloud Computing",
    description: "Principles and practices of cloud-based systems",
    type: "MICRO_CREDENTIAL",
    progressPercentage: 82,
    totalProjects: 1,
    activeProjects: 0,
    completedProjects: 1,
    projects: [
      {
        id: "project-6",
        name: "Cloud Deployment Project",
        description: "Deploy and manage applications in a cloud environment",
        status: "COMPLETED",
        progressPercentage: 82,
      },
    ],
    reviewHistory: [
      {
        reviewId: "review-11",
        reviewName: "Mid-term Review",
        reviewDate: "2024-10-30",
        averageScore: 15.8,
        maxPossibleScore: 20,
        criteriaBreakdown: [
          {
            criterionName: "Architecture",
            averageScore: 7.9,
            maxScore: 10,
          },
          {
            criterionName: "Scalability",
            averageScore: 7.9,
            maxScore: 10,
          },
        ],
      },
      {
        reviewId: "review-12",
        reviewName: "Final Review",
        reviewDate: "2024-12-30",
        averageScore: 16.4,
        maxPossibleScore: 20,
        criteriaBreakdown: [
          {
            criterionName: "Architecture",
            averageScore: 8.2,
            maxScore: 10,
          },
          {
            criterionName: "Scalability",
            averageScore: 8.2,
            maxScore: 10,
          },
        ],
      },
    ],
    lastReviewDate: "2024-12-30",
    totalReviews: 2,
  },
];
