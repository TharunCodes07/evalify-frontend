"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import {
  Participant,
  CreateQuizSchema,
  ParticipantType,
} from "./create-quiz-schema";

interface SemesterResponse {
  id: string;
  name: string;
  year: number;
}

interface BatchResponse {
  id: string;
  name: string;
  section: string;
}

interface CourseResponse {
  id: string;
  name: string;
  code: string;
}

interface ParticipantSelectorProps<T> {
  queryKey: string[];
  queryFn: () => Promise<T[]>;
  itemKey: keyof CreateQuizSchema;
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
  const { control, setValue, getValues } = useFormContext<CreateQuizSchema>();
  const selectedItems = useWatch({
    control,
    name: itemKey,
    defaultValue: [],
  }) as Participant[];
  const selectedIds = new Set(selectedItems.map((item) => item.id));

  const { data, isLoading } = useQuery<T[]>({
    queryKey,
    queryFn,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
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
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>{option.name}</span>
                  {selectedIds.has(option.id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
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
  const { control, setValue, getValues } = useFormContext<CreateQuizSchema>();
  const watchedFields = useWatch({
    control,
    name: ["semesters", "batches", "courses", "students"],
  });
  const [semesters, batches, courses, students] = watchedFields;

  const hasSelectedItems = [semesters, batches, courses, students].some(
    (arr) => arr && arr.length > 0,
  );

  const handleRemove = (itemKey: ParticipantType, id: string) => {
    const currentItems = getValues(itemKey) as Participant[];
    setValue(
      itemKey,
      currentItems.filter((item) => item.id !== id),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  if (!hasSelectedItems) return null;

  const allItems = [
    ...(semesters || []).map((item) => ({
      ...item,
      type: "semesters" as const,
    })),
    ...(batches || []).map((item) => ({ ...item, type: "batches" as const })),
    ...(courses || []).map((item) => ({ ...item, type: "courses" as const })),
    ...(students || []).map((item) => ({
      ...item,
      type: "students" as const,
    })),
  ];

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Selected Participants ({allItems.length})
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {allItems.map((item) => (
          <Badge
            key={`${item.type}-${item.id}`}
            variant="secondary"
            className="px-3 py-1.5 text-sm"
          >
            {item.name}
            <button
              type="button"
              onClick={() => handleRemove(item.type, item.id)}
              className="ml-2 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function QuizParticipantsForm() {
  const { formState } = useFormContext<CreateQuizSchema>();
  const semesterError = formState.errors.semesters?.message;

  return (
    <div className="space-y-6">
      {semesterError && (
        <div className="text-sm text-destructive font-medium">
          {semesterError}
        </div>
      )}
      {/* Grid Layout for all participant types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Semesters */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Semesters</h3>
          <div className="border rounded-lg overflow-hidden">
            <ParticipantSelector<SemesterResponse>
              queryKey={["activeSemesters"]}
              queryFn={semesterQueries.getActiveSemesters}
              itemKey="semesters"
              optionsTransformer={(data) =>
                data.map((s) => ({ id: s.id, name: `${s.name} - ${s.year}` }))
              }
              placeholder="Search semesters..."
            />
          </div>
        </div>

        {/* Batches */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Batches</h3>
          <div className="border rounded-lg overflow-hidden">
            <ParticipantSelector<BatchResponse>
              queryKey={["activeBatches"]}
              queryFn={batchQueries.getActiveBatches}
              itemKey="batches"
              optionsTransformer={(data) =>
                data.map((b) => ({
                  id: b.id,
                  name: `${b.name} (${b.section})`,
                }))
              }
              placeholder="Search batches..."
            />
          </div>
        </div>

        {/* Courses */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Courses</h3>
          <div className="border rounded-lg overflow-hidden">
            <ParticipantSelector<CourseResponse>
              queryKey={["activeCourses"]}
              queryFn={courseQueries.getActiveCourses}
              itemKey="courses"
              optionsTransformer={(data) =>
                data.map((c) => ({ id: c.id, name: `${c.name} (${c.code})` }))
              }
              placeholder="Search courses..."
            />
          </div>
        </div>

        {/* Students - Can be added later if needed */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Individual Students</h3>
          <div className="border rounded-lg overflow-hidden p-4 text-center text-sm text-muted-foreground">
            Individual student selection coming soon
          </div>
        </div>
      </div>

      {/* Selected Items Display */}
      <SelectedItemsDisplay />
    </div>
  );
}
