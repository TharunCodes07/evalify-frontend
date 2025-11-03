"use client";

import { useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Info,
  Eye,
  Shuffle,
  RotateCcw,
  Key,
  Calculator,
  TimerOff,
  Copy,
  Maximize,
  AlertCircle,
  TrendingDown,
  ArrowRightLeft,
  DicesIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TimeInput } from "@/components/ui/time-input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateQuizSchema } from "./create-quiz-schema";
import { LabSelector } from "./lab-selector";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MultiSelect } from "@/components/ui/multi-select";
import { QuestionType } from "@/types/questions";

interface InfoTooltipProps {
  content: string;
}

function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground cursor-help inline-flex" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}

const questionTypeOptions = [
  { label: "Multiple Choice (MCQ)", value: QuestionType.MCQ },
  { label: "Multiple Correct (MMCQ)", value: QuestionType.MMCQ },
  { label: "True/False", value: QuestionType.TRUE_FALSE },
  { label: "Fill in the Blanks", value: QuestionType.FILL_IN_BLANKS },
  { label: "Match the Following", value: QuestionType.MATCH_THE_FOLLOWING },
  { label: "Descriptive", value: QuestionType.DESCRIPTIVE },
  { label: "Coding", value: QuestionType.CODING },
  { label: "File Upload", value: QuestionType.FILE_UPLOAD },
];

export function QuizMetadataForm() {
  const form = useFormContext<CreateQuizSchema>();

  const passwordProtected = useWatch({
    control: form.control,
    name: "config.passwordProtected",
    defaultValue: false,
  });

  const preventTabSwitch = useWatch({
    control: form.control,
    name: "config.preventTabSwitch",
    defaultValue: false,
  });

  const negativeMarkingEnabled = useWatch({
    control: form.control,
    name: "config.negativeMarkingEnabled",
    defaultValue: false,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.65fr] gap-6">
      {/* Left Card: Basic Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quiz Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Mid-Term Programming Quiz"
                    {...field}
                  />
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
          <div className="space-y-4">
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
                      <div className="p-3 space-y-3">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              const currentTime = field.value || new Date();
                              date.setHours(currentTime.getHours());
                              date.setMinutes(currentTime.getMinutes());
                              field.onChange(date);
                            }
                          }}
                          initialFocus
                        />
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-2">Time</p>
                          <TimeInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When the quiz becomes available
                  </FormDescription>
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
                      <div className="p-3 space-y-3">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              const currentTime = field.value || new Date();
                              date.setHours(currentTime.getHours());
                              date.setMinutes(currentTime.getMinutes());
                              field.onChange(date);
                            }
                          }}
                          disabled={(date) => {
                            const startTime = form.getValues("startTime");
                            if (!startTime) return false;
                            // Compare dates only, allowing same date with different times
                            const startDate = new Date(startTime);
                            startDate.setHours(0, 0, 0, 0);
                            const compareDate = new Date(date);
                            compareDate.setHours(0, 0, 0, 0);
                            return compareDate < startDate;
                          }}
                          initialFocus
                        />
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-2">Time</p>
                          <TimeInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Quiz submission deadline</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="durationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Duration (minutes)</FormLabel>
                <FormControl>
                  <InputNumber
                    min={1}
                    placeholder="e.g., 60"
                    value={field.value}
                    onChange={(value) => field.onChange(value || 1)}
                  />
                </FormControl>
                <FormDescription>
                  Time limit for completing the quiz once started
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </CardContent>
      </Card>

      {/* Right Card: Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Display Settings */}
          <FormField
            control={form.control}
            name="config.showQuestionsOneByOne"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Show Questions One by One
                  </FormLabel>
                  <InfoTooltip content="Display one question at a time with linear navigation (students cannot skip ahead)" />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="config.allowQuestionNavigation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Allow Question Navigation
                  </FormLabel>
                  <InfoTooltip content="Students can jump between questions freely during the quiz" />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Randomization Settings */}
          <FormField
            control={form.control}
            name="config.shuffleQuestions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Shuffle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Shuffle Questions
                  </FormLabel>
                  <InfoTooltip content="Randomize the order of questions for each student to prevent copying" />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="config.shuffleOptions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Shuffle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Shuffle Options
                  </FormLabel>
                  <InfoTooltip content="Randomize the order of answer options within each question" />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="config.randomizeQuestions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <DicesIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Random Selection
                  </FormLabel>
                  <InfoTooltip content="Each student gets a unique set of questions from the pool" />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Anti-Cheating Settings */}
          <FormField
            control={form.control}
            name="config.requireFullScreen"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Maximize className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Require Full Screen
                  </FormLabel>
                  <InfoTooltip content="Force students to stay in full screen mode throughout the quiz" />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="config.preventQuestionCopy"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Copy className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Prevent Copy/Paste
                  </FormLabel>
                  <InfoTooltip content="Disable copying of questions and answers to prevent sharing" />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="config.preventTabSwitch"
            render={({ field }) => (
              <FormItem className="flex flex-col p-3 bg-muted/30 rounded-lg border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <FormLabel className="text-sm font-medium cursor-pointer">
                      Monitor Tab Switching
                    </FormLabel>
                    <InfoTooltip content="Track when students switch away from the quiz tab" />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>

                {preventTabSwitch && (
                  <FormField
                    control={form.control}
                    name="config.tabSwitchLimit"
                    render={({ field }) => (
                      <FormItem className="pl-6">
                        <div className="flex items-center gap-2 mb-2">
                          <FormLabel className="text-sm">
                            Max Tab Switches
                          </FormLabel>
                          <InfoTooltip content="Maximum number of times students can switch tabs before action is taken (leave empty for unlimited)" />
                        </div>
                        <FormControl>
                          <InputNumber
                            placeholder="Leave empty for unlimited"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            min={0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="config.autoSubmit"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <TimerOff className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Auto Submit
                  </FormLabel>
                  <InfoTooltip content="Automatically submit the quiz when time runs out" />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Attempt Settings */}
          <FormField
            control={form.control}
            name="config.maxAttempts"
            render={({ field }) => (
              <FormItem className="p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <RotateCcw className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <FormLabel className="text-sm font-medium">
                    Maximum Attempts
                  </FormLabel>
                  <InfoTooltip content="How many times students can attempt this quiz" />
                </div>
                <FormControl>
                  <InputNumber
                    placeholder="Number of attempts"
                    value={field.value}
                    onChange={(value) => field.onChange(value || 1)}
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="config.canReattemptIfFailed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Allow Reattempt on Failure
                  </FormLabel>
                  <InfoTooltip content="Students can retry if they don't achieve the passing percentage" />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="config.passingPercentage"
            render={({ field }) => (
              <FormItem className="p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <RotateCcw className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <FormLabel className="text-sm font-medium">
                    Passing Percentage (Optional)
                  </FormLabel>
                  <InfoTooltip content="Minimum score required to pass (optional - leave empty for no pass/fail threshold)" />
                </div>
                <FormControl>
                  <InputNumber
                    placeholder="e.g., 60"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    min={0}
                    max={100}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Scoring Settings */}
          <FormField
            control={form.control}
            name="config.negativeMarkingEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-col p-3 bg-muted/30 rounded-lg border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <FormLabel className="text-sm font-medium cursor-pointer">
                      Enable Negative Marking
                    </FormLabel>
                    <InfoTooltip content="Deduct marks for incorrect answers to discourage guessing" />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>

                {negativeMarkingEnabled && (
                  <div className="space-y-3 pl-6">
                    <FormField
                      control={form.control}
                      name="config.negativeMarksValue"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2 mb-2">
                            <FormLabel className="text-sm">
                              Negative Marks Value (Optional)
                            </FormLabel>
                            <InfoTooltip content="Override the default negative marks. If not set, each question's individual negative marks will be used." />
                          </div>
                          <FormControl>
                            <InputNumber
                              placeholder="e.g., 0.25 or 1 (optional override)"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              min={0}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Leave empty to use individual question negative
                            marks
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="config.negativeMarkingQuestionTypes"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2 mb-2">
                            <FormLabel className="text-sm">
                              Apply to Question Types (Optional)
                            </FormLabel>
                            <InfoTooltip content="Optionally limit negative marking to specific question types. Leave empty to apply to all types." />
                          </div>
                          <FormControl>
                            <MultiSelect
                              options={questionTypeOptions}
                              selected={field.value || []}
                              onChange={field.onChange}
                              placeholder="All types (leave empty for all)"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Leave empty to apply negative marking to all
                            question types
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </FormItem>
            )}
          />

          {/* Security Settings */}
          <FormField
            control={form.control}
            name="config.passwordProtected"
            render={({ field }) => (
              <FormItem className="flex flex-col p-3 bg-muted/30 rounded-lg border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <FormLabel className="text-sm font-medium cursor-pointer">
                      Password Protected
                    </FormLabel>
                    <InfoTooltip content="Require a password to access and start the quiz" />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>

                {passwordProtected && (
                  <FormField
                    control={form.control}
                    name="config.password"
                    render={({ field }) => (
                      <FormItem className="pl-6">
                        <div className="flex items-center gap-2 mb-2">
                          <FormLabel className="text-sm">
                            Quiz Password
                          </FormLabel>
                          <InfoTooltip content="Students will need this password to start the quiz" />
                        </div>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter quiz password"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="config.calculatorAccess"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Allow Calculator
                  </FormLabel>
                  <InfoTooltip content="Enable calculator tool during the quiz for mathematical questions" />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
