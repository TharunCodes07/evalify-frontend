"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course, CourseType } from "@/types/types";

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: Omit<Course, "id">) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.nativeEnum(CourseType),
});

type CourseFormValues = z.infer<typeof formSchema>;

export function CourseForm({ course, onSubmit }: CourseFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: course?.name || "",
      description: course?.description || "",
      type: course?.type || CourseType.CORE,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter course name" {...field} />
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
                <Textarea
                  placeholder="Enter course description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Type</FormLabel>
              <Select
                value={field.value.toString()}
                defaultValue={field.value.toString()}
                onValueChange={val => field.onChange(Number(val))}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={CourseType.CORE.toString()}>Core</SelectItem>
                  <SelectItem value={CourseType.ELECTIVE.toString()}>Elective</SelectItem>
                  <SelectItem value={CourseType.MICRO_CREDENTIAL.toString()}>Micro Credential</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {course ? "Update Course" : "Create Course"}
        </Button>
      </form>
    </Form>
  );
} 