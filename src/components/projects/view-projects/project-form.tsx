import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Course, Project } from "@/types/types";
import { useCourses } from "@/components/admin/course/hooks/use-course";
import { CreateProjectRequest } from "@/components/projects/types/types";
import { Combobox } from "@/components/ui/combobox";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  objectives: z.string().optional(),
  courseId: z.string().optional(),
});

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectRequest) => void;
  isLoading: boolean;
  project?: Project | null;
  teamId: string;
}

export function ProjectForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  project,
  teamId,
}: ProjectFormProps) {
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      objectives: project?.objectives || "",
      courseId: project?.courseId || "",
    },
  });

  const { data: courses, isLoading: coursesLoading } = useCourses();

  const handleSubmit = (values: z.infer<typeof projectSchema>) => {
    onSubmit({
      ...values,
      teamId,
      courseId:
        !values.courseId || values.courseId === "none"
          ? undefined
          : values.courseId,
    });
  };

  const courseOptions = [
    { value: "none", label: "None" },
    ...(courses?.data?.map((course: Course) => ({
      value: course.id,
      label: course.name,
    })) || []),
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create Project"}
          </DialogTitle>
          <DialogDescription>
            {project
              ? "Edit the project details."
              : "Fill in the form to create a new project."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objectives</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project objectives" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course (Optional)</FormLabel>
                  <FormControl>
                    <Combobox
                      options={courseOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select a course"
                      searchPlaceholder="Search courses..."
                      emptyPlaceholder="No courses found."
                      disabled={coursesLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
