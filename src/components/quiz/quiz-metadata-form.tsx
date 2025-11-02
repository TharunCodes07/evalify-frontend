"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CreateQuizSchema } from "./create-quiz-schema";
import { LabSelector } from "./lab-selector";

export function QuizMetadataForm() {
  const form = useFormContext<CreateQuizSchema>();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quiz Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Mid-Term Programming Quiz" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter quiz description (optional)"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Provide additional context or instructions for students
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date & Time Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date & Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP p")
                      ) : (
                        <span>Pick start date & time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>When the quiz becomes available</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date & Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP p")
                      ) : (
                        <span>Pick end date & time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const startTime = form.getValues("startTime");
                      if (!startTime) return true;
                      return date < startTime;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Quiz submission deadline</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Test Duration */}
      <FormField
        control={form.control}
        name="durationMinutes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Test Duration (minutes)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                placeholder="e.g., 60"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormDescription>
              Time limit for completing the quiz once started
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Labs Selection */}
      <FormField
        control={form.control}
        name="labs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned Labs (Optional)</FormLabel>
            <FormControl>
              <LabSelector
                selectedLabs={field.value}
                onLabsChange={field.onChange}
              />
            </FormControl>
            <FormDescription>
              Select labs where this quiz can be taken
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
