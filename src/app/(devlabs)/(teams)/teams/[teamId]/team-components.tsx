// "use client";

// import { useTeam } from "@/components/teams/hooks/use-team";
// import { useProjectsByTeam } from "@/components/projects/hooks/use-projects-by-team";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import {
//   Users,
//   FolderGit,
//   AlertTriangle,
//   Info,
//   PlusCircle,
// } from "lucide-react";
// import Link from "next/link";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Project, ProjectStatus, User } from "@/types/types";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// import { projectQueries } from "@/components/projects/queries/project-queries";
// import { CreateProjectRequest } from "@/components/projects/types/types";
// import { ProjectForm } from "@/components/projects/view-all/project-form";
// import { useState } from "react";

// export const TeamHeaderSkeleton = () =>
//   "Implement a skeleton for the team header";

// export function TeamHeader({ teamId }: { teamId: string }) {
//   const {
//     data: team,
//     isLoading,
//     isError,
//     isSuccess,
//   } = useTeam(teamId as string);

//   if (isLoading) {
//     return <TeamHeaderSkeleton />;
//   }

//   if (isError) {
//     return (
//       <Alert variant="destructive">
//         <AlertTriangle className="h-4 w-4" />
//         <AlertTitle>Error</AlertTitle>
//         <AlertDescription>
//           An error occurred while fetching team details.
//         </AlertDescription>
//       </Alert>
//     );
//   }

//   if (isSuccess && !team) {
//     return (
//       <Alert variant="destructive">
//         <AlertTriangle className="h-4 w-4" />
//         <AlertTitle>Not Found</AlertTitle>
//         <AlertDescription>Team could not be found.</AlertDescription>
//       </Alert>
//     );
//   }

//   if (isSuccess && team) {
//     return (
//       <div className="border-none shadow-none">
//         <div className="p-6 pb-0">
//           <h1 className="text-3xl font-bold">{team.name}</h1>
//           {team.description && (
//             <p className="text-sm text-muted-foreground mt-2">
//               {team.description}
//             </p>
//           )}
//         </div>
//         <div className="p-6">
//           <div className="mt-1">
//             <h4 className="font-semibold mb-2 flex items-center">
//               <Users className="mr-2" /> Members ({team.members.length})
//             </h4>
//             <ul className="space-y-4">
//               {team.members.map((member: User) => (
//                 <li key={member.id} className="flex items-center space-x-4">
//                   <Avatar>
//                     <AvatarImage
//                       src={member.profileImage as string}
//                       alt={member.name}
//                     />
//                     <AvatarFallback>
//                       {member.name.charAt(0).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-semibold">{member.name}</p>
//                     <p className="text-sm text-muted-foreground">
//                       {member.email}
//                     </p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return <TeamHeaderSkeleton />;
// }

// export const TeamProjectsSkeleton = () => (
//   <Card>
//     <CardHeader>
//       <Skeleton className="h-7 w-1/3" />
//     </CardHeader>
//     <CardContent className="space-y-4">
//       <Skeleton className="h-10 w-full rounded-md mb-4" />
//       {[...Array(2)].map((_, i) => (
//         <Skeleton key={i} className="h-28 w-full rounded-md" />
//       ))}
//     </CardContent>
//   </Card>
// );

// export function TeamProjects({ teamId }: { teamId: string }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const currentTab = searchParams.get("tab") || "live";
//   const [isFormOpen, setIsFormOpen] = useState(false);

//   const queryClient = useQueryClient();
//   const { data: session } = useSession();

//   const {
//     data: projects,
//     isLoading: areProjectsLoading,
//     isFetching: areProjectsFetching,
//     isError: areProjectsError,
//   } = useProjectsByTeam(teamId as string);

//   const createProjectMutation = useMutation({
//     mutationFn: (project: CreateProjectRequest) => {
//       if (!session?.accessToken) throw new Error("Not authenticated");
//       return projectQueries.createProject(project, session.accessToken);
//     },
//     onSuccess: () => {
//       toast.success("Project created successfully");
//       queryClient.invalidateQueries({ queryKey: ["projects", teamId] });
//       setIsFormOpen(false);
//     },
//     onError: (error: Error) => {
//       toast.error(`Failed to create project: ${error.message}`);
//     },
//   });

//   if (areProjectsError) {
//     return (
//       <Alert variant="destructive">
//         <AlertTriangle className="h-4 w-4" />
//         <AlertTitle>Error</AlertTitle>
//         <AlertDescription>Projects could not be loaded.</AlertDescription>
//       </Alert>
//     );
//   }

//   const handleTabChange = (value: string) => {
//     router.push(`/teams/${teamId}?tab=${value}`);
//   };

//   const handleSubmit = (data: CreateProjectRequest) => {
//     createProjectMutation.mutate(data);
//   };

//   const filterProjects = (status: ProjectStatus[]) => {
//     return projects?.filter((p) => status.includes(p.status)) || [];
//   };

//   const liveProjects = filterProjects([
//     ProjectStatus.PROPOSED,
//     ProjectStatus.ONGOING,
//   ]);
//   const completedProjects = filterProjects([ProjectStatus.COMPLETED]);
//   const rejectedProjects = filterProjects([ProjectStatus.REJECTED]);

//   const renderProjectGrid = (projectsToRender: Project[]) => {
//     if (projectsToRender.length === 0) {
//       return (
//         <div className="flex flex-col items-center justify-center text-center py-8">
//           <Info className="h-8 w-8 text-muted-foreground mb-2" />
//           <p className="text-muted-foreground">No projects found.</p>
//         </div>
//       );
//     }

//     return (
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {projectsToRender.map((project) => (
//           <Card
//             key={project.id}
//             className="group relative flex flex-col justify-between"
//           >
//             <Link
//               href={`/projects/${project.id}`}
//               className="space-y-2 block p-4"
//             >
//               <div className="flex justify-between items-start">
//                 <h4 className="font-semibold">{project.title}</h4>
//                 <Badge variant="outline">{project.status}</Badge>
//               </div>
//               <p className="text-sm text-muted-foreground line-clamp-2 h-10">
//                 {project.description}
//               </p>
//             </Link>
//           </Card>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <>
//       <Card>
//         <CardHeader className="flex flex-row justify-between items-center">
//           <CardTitle className="flex items-center">
//             <FolderGit className="mr-2" /> Projects ({projects?.length || 0})
//           </CardTitle>
//           <Button size="sm" onClick={() => setIsFormOpen(true)}>
//             <PlusCircle className="mr-2 h-4 w-4" />
//             New Project
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <Tabs
//             value={currentTab}
//             onValueChange={handleTabChange}
//             className="w-full"
//           >
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="live">Live</TabsTrigger>
//               <TabsTrigger value="completed">Completed</TabsTrigger>
//               <TabsTrigger value="rejected">Rejected</TabsTrigger>
//             </TabsList>
//             <div className="relative">
//               {(areProjectsLoading || areProjectsFetching) && (
//                 <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
//                   <TeamProjectsSkeleton />
//                 </div>
//               )}
//               <TabsContent value="live" className="pt-4">
//                 {renderProjectGrid(liveProjects)}
//               </TabsContent>
//               <TabsContent value="completed" className="pt-4">
//                 {renderProjectGrid(completedProjects)}
//               </TabsContent>
//               <TabsContent value="rejected" className="pt-4">
//                 {renderProjectGrid(rejectedProjects)}
//               </TabsContent>
//             </div>
//           </Tabs>
//         </CardContent>
//       </Card>
//       <ProjectForm
//         isOpen={isFormOpen}
//         onClose={() => setIsFormOpen(false)}
//         onSubmit={handleSubmit}
//         isLoading={createProjectMutation.isPending}
//         teamId={teamId as string}
//       />
//     </>
//   );
// }
