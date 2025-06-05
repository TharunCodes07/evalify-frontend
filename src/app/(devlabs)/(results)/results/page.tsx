// "use client";

// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import CourseGrid from "@/components/results/course-grid";
// import PerformanceChart from "@/components/results/performance-chart";
// import { dummyCourseData } from "@/lib/data";

// export default function DashboardPage() {
//   const [activeTab, setActiveTab] = useState("overview");

//   return (
//     <div className="flex min-h-screen flex-col bg-background">
//       <main className="flex-1 space-y-6 p-6 md:p-8">
//         <div className="flex flex-col space-y-2">
//           <h1 className="text-3xl font-bold tracking-tight">
//             Course Performance
//           </h1>
//           <p className="text-muted-foreground">
//             Track your progress across all your courses and projects
//           </p>
//         </div>

//         <Tabs
//           defaultValue="overview"
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="space-y-4"
//         >
//           <TabsList>
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="courses">Courses</TabsTrigger>
//             <TabsTrigger value="projects">Projects</TabsTrigger>
//           </TabsList>
//           <TabsContent value="overview" className="space-y-6">
//             <Card className="p-6">
//               <h2 className="mb-4 text-xl font-semibold">Performance Trends</h2>
//               <PerformanceChart data={dummyCourseData} />
//             </Card>
//             <CourseGrid courses={dummyCourseData} />
//           </TabsContent>
//           <TabsContent value="courses" className="space-y-6">
//             <CourseGrid courses={dummyCourseData} />
//           </TabsContent>
//           <TabsContent value="projects" className="space-y-6">
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {dummyCourseData.flatMap((course) =>
//                 course.projects.map((project) => (
//                   <Card
//                     key={project.id}
//                     className="overflow-hidden bg-card transition-all hover:shadow-md"
//                   >
//                     <div className="p-6">
//                       <h3 className="text-lg font-semibold">{project.name}</h3>
//                       <p className="text-sm text-muted-foreground">
//                         {course.name}
//                       </p>
//                       <div className="mt-4 flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <div className="h-2 w-full rounded-full bg-secondary">
//                             <div
//                               className="h-2 rounded-full bg-primary"
//                               style={{
//                                 width: `${project.progressPercentage}%`,
//                               }}
//                             />
//                           </div>
//                           <span className="text-sm font-medium">
//                             {project.progressPercentage}%
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   );
// }
