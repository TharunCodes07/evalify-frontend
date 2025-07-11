"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import semesterQueries from "@/repo/semester-queries/semester-queries";
import batchQueries from "@/repo/batch-queries/batch-queries";
import { courseQueries } from "@/repo/course-queries/course-queries";
import { projectQueries } from "@/repo/project-queries/project-queries";
import {
  BatchResponse,
  ProjectResponse,
  SemesterResponse,
} from "@/repo/review-queries/review-types";
import { Course } from "@/types/types";
import {
  Participant,
  CreateReviewSchema,
} from "@/components/reviews/create-review-schema";

type ParticipantType = "semesters" | "batches" | "courses" | "projects";

interface ParticipantSelectorProps<T> {
  queryKey: string[];
  queryFn: () => Promise<T[]>;
  itemKey: keyof CreateReviewSchema;
  optionsTransformer: (data: T[]) => Participant[];
  placeholder: string;
}

function ParticipantSelector<T>({
  queryKey,
  queryFn,
  itemKey,
  optionsTransformer,
  placeholder,
}: ParticipantSelectorProps<T>) {
  const { control, setValue, getValues } = useFormContext<CreateReviewSchema>();
  const selectedItems = useWatch({
    control,
    name: itemKey,
    defaultValue: [],
  }) as Participant[];
  const selectedIds = new Set(selectedItems.map((item) => item.id));

  const { data, isLoading } = useQuery<T[]>({
    queryKey,
    queryFn,
  });

  const handleSelect = (item: Participant) => {
    const currentItems =
      (getValues(itemKey) as Participant[] | undefined) || [];
    const isSelected = selectedIds.has(item.id);
    const newItems = isSelected
      ? currentItems.filter((i: Participant) => i.id !== item.id)
      : [...currentItems, item];
    setValue(itemKey, newItems, { shouldDirty: true, shouldValidate: true });
  };

  const options = data ? optionsTransformer(data) : [];

  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <ScrollArea className="h-64">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {isLoading ? (
              <div className="space-y-2 p-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              options.map((option) => (
                <CommandItem
                  key={option.id}
                  onSelect={() => handleSelect(option)}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedIds.has(option.id) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span>{option.name}</span>
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </Command>
  );
}

function SelectedItemsDisplay() {
  const { control, setValue, getValues } = useFormContext<CreateReviewSchema>();
  const watchedFields = useWatch({
    control,
    name: ["semesters", "batches", "courses", "projects"],
  });
  const [semesters, batches, courses, projects] = watchedFields;

  const hasSelectedItems = [semesters, batches, courses, projects].some(
    (arr) => arr && arr.length > 0
  );

  const handleRemove = (itemKey: ParticipantType, id: string) => {
    const currentItems = getValues(itemKey) as Participant[];
    setValue(
      itemKey,
      currentItems.filter((item) => item.id !== id),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const renderSection = (
    title: string,
    items: Participant[] | undefined,
    itemKey: ParticipantType
  ) => {
    if (!items || items.length === 0) return null;
    return (
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="flex flex-wrap gap-2 pt-2">
          {items.map((item) => (
            <Badge
              variant="secondary"
              key={item.id}
              className="flex items-center gap-1"
            >
              {item.name}
              <button
                type="button"
                onClick={() => handleRemove(itemKey, item.id)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  if (!hasSelectedItems) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Participants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderSection("Semesters", semesters, "semesters")}
        {renderSection("Batches", batches, "batches")}
        {renderSection("Courses", courses, "courses")}
        {renderSection("Projects", projects, "projects")}
      </CardContent>
    </Card>
  );
}

export function ParticipantsForm() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4 flex-1 min-w-0">
        <Tabs defaultValue="semesters" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="semesters">Semesters</TabsTrigger>
            <TabsTrigger value="batches">Batches</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="semesters">
            <ParticipantSelector<SemesterResponse>
              queryKey={["activeSemesters"]}
              queryFn={semesterQueries.getActiveSemesters}
              itemKey="semesters"
              optionsTransformer={(data) =>
                data.map((s) => ({ id: s.id, name: `${s.name} - ${s.year}` }))
              }
              placeholder="Search semesters..."
            />
          </TabsContent>
          <TabsContent value="batches">
            <ParticipantSelector<BatchResponse>
              queryKey={["activeBatches"]}
              queryFn={batchQueries.getActiveBatches}
              itemKey="batches"
              optionsTransformer={(data) =>
                data.map((b) => ({
                  id: b.id,
                  name: `${b.name} - ${b.department?.name || "N/A"}`,
                }))
              }
              placeholder="Search batches..."
            />
          </TabsContent>
          <TabsContent value="courses">
            <ParticipantSelector<Course>
              queryKey={["activeCourses"]}
              queryFn={courseQueries.getActiveCourses}
              itemKey="courses"
              optionsTransformer={(data) =>
                data.map((c) => ({ id: c.id, name: `${c.name} (${c.code})` }))
              }
              placeholder="Search courses..."
            />
          </TabsContent>
          <TabsContent value="projects">
            <ParticipantSelector<ProjectResponse>
              queryKey={["activeProjects"]}
              queryFn={projectQueries.getActiveProjects}
              itemKey="projects"
              optionsTransformer={(data) =>
                data.map((p) => ({ id: p.id, name: p.title }))
              }
              placeholder="Search projects..."
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="min-w-0">
        <SelectedItemsDisplay />
      </div>
    </div>
  );
}
