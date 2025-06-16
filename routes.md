MD

# Backend API Routes

This document lists all the backend API routes used in the devlabs-frontend application and the files where they are referenced.

## Authentication Routes

- **POST /api/auth/login**
  - `src\lib\auth.ts`
  - `src\app\api\login\route.ts` (Note: This is a frontend API route that proxies to the backend)
- **POST /api/auth/register**
  - `src\lib\auth.ts`
  - `src\app\api\register\route.ts` (Note: This is a frontend API route that proxies to the backend)
- **POST /api/auth/refresh-token**
  - `src\lib\auth.ts`
- **POST /api/auth/change-password**
  - `src\lib\auth.ts`
- **GET /api/auth/me**
  - `src\lib\auth.ts`
- **GET /api/auth/signin** (Commented out)
  - `src\lib\axios\axios-client.ts`

## User Routes

- **POST /api/user**
  - `src\repo\user-queries\user-queries.ts`
- **PUT /api/user/{id}**
  - `src\repo\user-queries\user-queries.ts`
- **DELETE /api/user/{userId}**
  - `src\repo\user-queries\user-queries.ts`
- **DELETE /api/user/bulk**
  - `src\repo\user-queries\user-queries.ts`
- **GET /api/user/role/{role}**
  - `src\repo\user-queries\user-queries.ts`
- **GET /api/user/{userId}**
  - `src\repo\user-queries\user-queries.ts`
- **GET /api/user/faculty**
  - `src\repo\course-queries\course-queries.ts`
- **GET /api/user** (potentially with search query)
  - `src\components\admin\users\hooks\use-users.ts`
- **GET /api/user/search**
  - `src\components\admin\users\hooks\use-users.ts`

## Course Routes

- **GET /api/course/active**
  - `src\repo\course-queries\course-queries.ts`
- **GET /api/course/{userId}/active-courses**
  - `src\repo\course-queries\course-queries.ts`
- **GET /api/course/student/{studentId}/courses-with-scores**
  - `src\repo\course-queries\course-queries.ts`
- **GET /api/course/student/{studentId}/course/{courseId}/review**
  - `src\repo\course-queries\course-queries.ts`
- **GET /api/course/{courseId}**
  - `src\repo\course-queries\course-queries.ts`
- **POST /api/course/{courseId}/addBatch**
  - `src\repo\course-queries\course-queries.ts`
- **DELETE /api/course/{courseId}/batches/{batchId}**
  - `src\repo\course-queries\course-queries.ts`
- **POST /api/course/{courseId}/students**
  - `src\repo\course-queries\course-queries.ts`
- **DELETE /api/course/{courseId}/students/{studentId}**
  - `src\repo\course-queries\course-queries.ts`
- **GET /api/course/{courseId}/instructors**
  - `src\repo\course-queries\course-queries.ts`
- **POST /api/course/{courseId}/instructors**
  - `src\repo\course-queries\course-queries.ts`
- **DELETE /api/course/{courseId}/instructors/{instructorId}**
  - `src\repo\course-queries\course-queries.ts`
- **GET /api/course/my-courses** (potentially with search query)
  - `src\components\my-courses\hooks\use-mycourses.ts`
- **GET /api/course/my-courses/search**
  - `src\components\my-courses\hooks\use-mycourses.ts`
- **GET /api/course/{courseId}/batches** (potentially with search query)
  - `src\components\admin\course\hooks\use-course-batches.ts`
- **GET /api/course/{courseId}/batches/search**
  - `src\components\admin\course\hooks\use-course-batches.ts`
- **GET /api/course/{courseId}/students** (potentially with search query)
  - `src\components\admin\course\hooks\use-course-students.ts`
- **GET /api/course/{courseId}/students/search**
  - `src\components\admin\course\hooks\use-course-students.ts`

## Batch Routes

- **POST /api/batch**
  - `src\repo\batch-queries\batch-queries.ts`
- **PUT /api/batch/{id}**
  - `src\repo\batch-queries\batch-queries.ts`
- **DELETE /api/batch/{batchId}**
  - `src\repo\batch-queries\batch-queries.ts`
- **GET /api/batch/{batchId}**
  - `src\repo\batch-queries\batch-queries.ts`
- **GET /api/batch/{batchId}/students** (potentially with search query)
  - `src\repo\batch-queries\batch-queries.ts`
- **GET /api/batch/{batchId}/students/search**
  - `src\repo\batch-queries\batch-queries.ts`
- **POST /api/batch/{batchId}/add-students**
  - `src\repo\batch-queries\batch-queries.ts`
- **POST /api/batch/{batchId}/delete-students**
  - `src\repo\batch-queries\batch-queries.ts`
- **GET /api/batch** (potentially with search query)
  - `src\repo\batch-queries\batch-queries.ts`
  - `src\components\admin\batch\hooks\use-batch.ts`
- **GET /api/batch/active**
  - `src\repo\batch-queries\batch-queries.ts`
- **GET /api/batch/search**
  - `src\components\admin\batch\hooks\use-batch.ts`

## Department Routes

- **POST /api/department**
  - `src\repo\department-queries\department-queries.ts`
- **PUT /api/department/{id}**
  - `src\repo\department-queries\department-queries.ts`
- **DELETE /api/department/{departmentId}**
  - `src\repo\department-queries\department-queries.ts`
- **GET /api/department/search**
  - `src\repo\department-queries\department-queries.ts`
  - `src\components\admin\department\hooks\use-department.ts`
- **GET /api/department/{departmentId}/batches**
  - `src\repo\department-queries\department-queries.ts`
  - `src\components\admin\users\assign-batch-dialog.tsx`
- **GET /api/department/all**
  - `src\repo\department-queries\department-queries.ts`
  - `src\components\admin\users\assign-batch-dialog.tsx`
  - `src\components\admin\department\hooks\use-department.ts`
- **GET /api/department**
  - `src\components\admin\department\hooks\use-department.ts`

## Semester Routes

- **GET /api/semester** (potentially with search query)
  - `src\repo\semester-queries\semester-queries.ts`
  - `src\components\admin\semesters\hook\use-semesters-for-data-table.ts`
- **GET /api/semester/search**
  - `src\repo\semester-queries\semester-queries.ts`
  - `src\components\admin\semesters\hook\use-semesters-for-data-table.ts`
- **POST /api/semester**
  - `src\repo\semester-queries\semester-queries.ts`
- **PUT /api/semester/{id}**
  - `src\repo\semester-queries\semester-queries.ts`
- **DELETE /api/semester/{id}**
  - `src\repo\semester-queries\semester-queries.ts`
- **GET /api/semester/{id}**
  - `src\repo\semester-queries\semester-queries.ts`
- **GET /api/semester/{id}/courses**
  - `src\repo\semester-queries\semester-queries.ts`
- **POST /api/semester/{semesterId}/courses**
  - `src\repo\semester-queries\semester-queries.ts`
- **DELETE /api/semester/{semesterId}/courses/{courseId}**
  - `src\repo\semester-queries\semester-queries.ts`
- **GET /api/semester/active**
  - `src\repo\semester-queries\semester-queries.ts`

## Review Routes

- **POST /api/review**
  - `src\repo\review-queries\review-queries.ts`
- **GET /api/review/{reviewId}**
  - `src\repo\review-queries\review-queries.ts`
- **DELETE /api/review/{reviewId}**
  - `src\repo\review-queries\review-queries.ts`
- **POST /api/review/{reviewId}/results** // Corrected from GET to POST
  - `src\repo\result-queries\result-queries.ts`
- **GET /api/review/search/{userId}**
  - `src\components\reviews\hooks\use-reviews-table.ts`
- **GET /api/review/user**
  - `src\components\reviews\hooks\use-reviews-table.ts`
- **GET /api/review**
  - `src\components\reviews\hooks\use-reviews-table.ts`
- **POST /api/review/{reviewId}/{action}** (action can be 'publish', 'unpublish', etc.)
  - `src\components\reviews\publish-review-button.tsx`

## Evaluation Routes

- **GET /api/evaluations/review/{reviewId}/criteria**
  - `src\repo\evaluation-queries.ts`
- **POST /api/evaluations/submit?userId={userId}**
  - `src\repo\evaluation-queries.ts`
- **GET /projects/{projectId}/reviews** // Newly added
  - `src\repo\evaluation-queries.ts`

## Rubrics Routes

- **GET /api/rubrics/user/{userId}**
  - `src\repo\rubrics-queries\rubrics-queries.ts`
- **GET /api/rubrics/{id}**
  - `src\repo\rubrics-queries\rubrics-queries.ts`
- **POST /api/rubrics**
  - `src\repo\rubrics-queries\rubrics-queries.ts`
- **PUT /api/rubrics/{id}**
  - `src\repo\rubrics-queries\rubrics-queries.ts`
- **DELETE /api/rubrics/{id}**
  - `src\repo\rubrics-queries\rubrics-queries.ts`
- **GET /api/rubrics/all**
  - `src\repo\rubrics-queries\rubrics-queries.ts`

## Individual Score Routes

- **GET /api/individualScore/review/{reviewId}/project/{projectId}/summary**
  - `src\repo\individual-score-queries\individual-score-queries.ts`
- **GET /api/individualScore/review/{reviewId}/project/{projectId}/course/{courseId}/data**
  - `src\repo\individual-score-queries\individual-score-queries.ts`
- **POST /api/individualScore/course**
  - `src\repo\individual-score-queries\individual-score-queries.ts`

## Project Routes

- **GET /projects/team/{teamId}**
  - `src\repo\project-queries\project-queries.ts`
- **GET /projects/{projectId}**
  - `src\repo\project-queries\project-queries.ts`
- **GET /projects/course/{courseId}**
  - `src\repo\project-queries\project-queries.ts`
- **POST /projects**
  - `src\repo\project-queries\project-queries.ts`
- **PUT /projects/{projectId}**
  - `src\repo\project-queries\project-queries.ts`
- **DELETE /projects/{projectId}**
  - `src\repo\project-queries\project-queries.ts`
- **GET /projects/active**
  - `src\repo\project-queries\project-queries.ts`
- **GET /projects/user/{userId}/course/{courseId}**
  - `src\repo\project-queries\project-queries.ts`
- **GET /projects/user/{userId}**
  - `src\repo\project-queries\project-queries.ts`
- **GET /projects/faculty/{facultyId}/active**
  - `src\repo\project-queries\project-queries.ts`
- **GET /projects/student/{studentId}/active**
  - `src\repo\project-queries\project-queries.ts`
- **GET /projects/course/{courseId}/search** // Newly added
  - `src\components\projects\hooks\use-projects-by-course.ts`

## Team Routes

- **POST /teams**
  - `src\repo\team-queries\team-queries.ts`
- **PUT /teams/{teamId}**
  - `src\repo\team-queries\team-queries.ts`
- **DELETE /teams/{teamId}**
  - `src\repo\team-queries\team-queries.ts`
- **GET /teams/{teamId}**
  - `src\repo\team-queries\team-queries.ts`
- **GET /teams/search/{userId}**
  - `src\repo\team-queries\team-queries.ts`
- **GET /teams/user/{userId}**
  - `src\repo\team-queries\team-queries.ts`
- **GET /teams**
  - `src\repo\team-queries\team-queries.ts`

## Kanban Routes

- **GET /kanban/project/{projectId}**
  - `src\repo\project-queries\kanban-queries.ts`
- **POST /kanban/tasks**
  - `src\repo\project-queries\kanban-queries.ts`
- **PUT /kanban/tasks/reorder**
  - `src\repo\project-queries\kanban-queries.ts`
- **PUT /kanban/tasks/{taskId}**
  - `src\repo\project-queries\kanban-queries.ts`
- **DELETE /kanban/tasks/{taskId}**
  - `src\repo\project-queries\kanban-queries.ts`

## Archive Routes

- **GET /archive/projects**
  - `src\repo\project-queries\archive-queries.ts`
- **GET /archive/projects/search**
  - `src\repo\project-queries\archive-queries.ts`

## Frontend API Routes (Proxying to Backend)

- **POST /api/login** (Frontend route, proxies to backend `/api/auth/login`)
  - `src\app\api\login\route.ts`
- **POST /api/register** (Frontend route, proxies to backend `/api/auth/register`)
  - `src\app\api\register\route.ts`
