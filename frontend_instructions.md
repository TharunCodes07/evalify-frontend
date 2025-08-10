# Dashboard Frontend Implementation Guide

## Overview

This document provides instructions for implementing the frontend dashboard using the provided role-based API endpoints.

## API Endpoints

### Base URL

All dashboard endpoints are prefixed with `/api/dashboard`

### Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Available Endpoints

#### 1. Admin Dashboard

**Endpoint:** `GET /api/dashboard/admin`  
**Access:** ADMIN role only  
**Description:** Returns comprehensive statistics for system administration

**Response Structure:**

```json
{
  "userStats": {
    "total": 150,
    "students": 120,
    "faculty": 25,
    "managers": 5
  },
  "semesterStats": {
    "total": 8,
    "active": 2
  },
  "courseStats": {
    "total": 45,
    "active": 20
  },
  "batchStats": {
    "total": 15,
    "active": 8
  },
  "recentUsers": [
    {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "createdAt": "2024-01-15T10:30:00"
    }
  ]
}
```

#### 2. Manager/Staff Dashboard

**Endpoint:** `GET /api/dashboard/manager-staff`  
**Access:** MANAGER or FACULTY roles  
**Description:** Returns performance and review-related statistics for managers and faculty

**Response Structure:**

```json
{
  "totalReviews": 25,
  "activeReviews": 5,
  "completedReviews": 20,
  "totalProjects": 15,
  "activeProjects": 8,
  "upcomingReviews": [
    {
      "id": "review123",
      "name": "Mid-term Project Review",
      "startDate": "2024-02-15",
      "endDate": "2024-02-20",
      "courseName": "Software Engineering"
    }
  ],
  "recentlyPublishedReviews": [
    {
      "reviewId": "review456",
      "reviewName": "Assignment Review",
      "courseName": "Database Systems",
      "publishedAt": "2024-01-10T14:30:00",
      "publishedBy": "Dr. Smith"
    }
  ]
}
```

#### 3. Student Dashboard

**Endpoint:** `GET /api/dashboard/student`  
**Access:** STUDENT role only  
**Description:** Returns student performance and project statistics

**Response Structure:**

```json
{
  "totalReviews": 12,
  "activeReviews": 3,
  "completedReviews": 9,
  "totalProjects": 6,
  "activeProjects": 2,
  "completedProjects": 4,
  "averageProjectScore": 0.0,
  "upcomingReviews": [
    {
      "id": "review789",
      "name": "Final Project Presentation",
      "startDate": "2024-02-25",
      "endDate": "2024-02-28",
      "courseName": "Web Development"
    }
  ],
  "recentlyPublishedReviews": [
    {
      "reviewId": "review101",
      "reviewName": "Lab Assignment Review",
      "courseName": "Data Structures",
      "publishedAt": "2024-01-12T09:15:00",
      "publishedBy": "Prof. Johnson"
    }
  ]
}
```

## Frontend Implementation Guidelines

### 1. Dashboard Layout Structure

```
Dashboard
├── Role-based Header
├── Statistics Cards (role-specific)
├── Quick Actions Panel
├── Upcoming Reviews Section
├── Recent Publications Section
└── Additional Widgets (role-specific)
```

### 2. Role-based Features

#### Admin Dashboard Features:

- **User Management Overview:** Display user statistics with breakdown by role
- **System Statistics:** Show semester, course, and batch counts
- **Recent Users Widget:** List of newly registered users
- **Quick Actions:** Links to user management, semester setup, course creation

#### Manager/Staff Dashboard Features:

- **Review Performance Overview:** Total, active, and completed reviews statistics
- **Project Management Panel:** Overview of managed projects and their status
- **Review Timeline:** Upcoming reviews needing attention
- **Published Reviews Tracker:** Recently published reviews with performance insights
- **Quick Actions:** Create review, publish review, view project details

#### Student Dashboard Features:

- **Academic Performance:** Review participation and completion statistics
- **Project Portfolio:** Active and completed project counts with performance metrics
- **Review Timeline:** Upcoming evaluations and deadlines
- **Performance Tracking:** Average project scores and review completion rates
- **Quick Actions:** View active reviews, check project status, review submissions

### 3. UI Components

#### Statistics Cards

```jsx
const StatCard = ({ title, value, subtitle, icon, color }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <h3>{value}</h3>
      <p>{title}</p>
      {subtitle && <span>{subtitle}</span>}
    </div>
  </div>
);
```

#### Review List Component

```jsx
const ReviewList = ({ reviews, title, type }) => (
  <div className="review-list">
    <h4>{title}</h4>
    {reviews.map((review) => (
      <div key={review.id} className={`review-item ${type}`}>
        <h5>{review.name}</h5>
        <p>{review.courseName}</p>
        <span>
          {formatDate(review.startDate)} - {formatDate(review.endDate)}
        </span>
      </div>
    ))}
  </div>
);
```

### 4. Data Fetching

#### Using Fetch API

```javascript
const fetchDashboard = async (role) => {
  const endpoint = `/api/dashboard/${role}`;
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
};
```

#### Using Axios

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const getDashboardData = (role) => {
  return api.get(`/dashboard/${role}`);
};
```

### 5. Error Handling

```javascript
const handleDashboardError = (error) => {
  if (error.response?.status === 401) {
    // Redirect to login
    window.location.href = "/login";
  } else if (error.response?.status === 403) {
    // Show access denied message
    showNotification("Access denied", "error");
  } else {
    // Show generic error
    showNotification("Failed to load dashboard", "error");
  }
};
```

### 6. Responsive Design Considerations

- Use CSS Grid or Flexbox for responsive card layouts
- Implement mobile-first design approach
- Ensure touch-friendly interfaces for mobile devices
- Use progressive disclosure for complex data on smaller screens

### 7. State Management

```javascript
// Using React Context or Redux
const DashboardContext = createContext();

const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboard(userRole);
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{ dashboardData, loading, error, loadDashboard }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
```

### 8. Security Considerations

- Always validate user roles on the frontend
- Implement proper token refresh mechanisms
- Never expose sensitive data in client-side code
- Use HTTPS for all API communications

### 9. Performance Optimization

- Implement caching for dashboard data
- Use lazy loading for dashboard components
- Minimize API calls with proper data aggregation
- Consider implementing real-time updates with WebSockets for critical data

### 10. Testing Guidelines

```javascript
// Component Testing
test("Admin dashboard displays user statistics", async () => {
  const mockData = { userStats: { total: 100, students: 80 } };
  render(<AdminDashboard data={mockData} />);
  expect(screen.getByText("100")).toBeInTheDocument();
});

// API Testing
test("Dashboard API returns correct data format", async () => {
  const response = await fetchDashboard("admin");
  expect(response).toHaveProperty("userStats");
  expect(response.userStats).toHaveProperty("total");
});
```

## Additional Notes

- The dashboard data is refreshed automatically when the component mounts
- All date/time values are returned in ISO format and should be formatted for display
- The `recentlyPublishedReviews` and `upcomingReviews` arrays are limited to 5 items each
- Role-based access control is enforced at both frontend and backend levels
- Consider implementing real-time notifications for new reviews and publications
