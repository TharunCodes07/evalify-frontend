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
import { Switch } from "@/components/ui/switch";
import { CreateQuizSchema } from "./create-quiz-schema";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Shuffle,
  Shield,
  RotateCcw,
  Key,
  Calculator,
  TimerOff,
  Copy,
  Maximize,
  AlertCircle,
  TrendingDown,
} from "lucide-react";

export function QuizSettingsForm() {
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

  return (
    <div className="space-y-8">
      {/* Display Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold">Display Settings</h3>
        </div>

        <div className="space-y-3 pl-2">
          <FormField
            control={form.control}
            name="config.showQuestionsOneByOne"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-medium">
                    Show Questions One by One
                  </FormLabel>
                  <FormDescription>
                    Display one question at a time (linear navigation)
                  </FormDescription>
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
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-medium">
                    Allow Question Navigation
                  </FormLabel>
                  <FormDescription>
                    Students can jump between questions
                  </FormDescription>
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
        </div>
      </div>

      <Separator />

      {/* Randomization Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Shuffle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold">Randomization</h3>
        </div>

        <div className="space-y-3 pl-2">
          <FormField
            control={form.control}
            name="config.shuffleQuestions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-medium">
                    Shuffle Questions
                  </FormLabel>
                  <FormDescription>
                    Randomize the order of questions for each student
                  </FormDescription>
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
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-medium">
                    Shuffle Options
                  </FormLabel>
                  <FormDescription>
                    Randomize answer options within questions
                  </FormDescription>
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
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-medium">
                    Random Question Selection
                  </FormLabel>
                  <FormDescription>
                    Pick random questions from a larger pool
                  </FormDescription>
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
        </div>
      </div>

      <Separator />

      {/* Anti-Cheating Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold">Anti-Cheating</h3>
        </div>

        <div className="space-y-3 pl-2">
          <FormField
            control={form.control}
            name="config.requireFullScreen"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5 flex items-center gap-2">
                  <Maximize className="h-4 w-4 text-red-600" />
                  <div>
                    <FormLabel className="text-base font-medium">
                      Require Full Screen
                    </FormLabel>
                    <FormDescription>
                      Force students to stay in full screen mode
                    </FormDescription>
                  </div>
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
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5 flex items-center gap-2">
                  <Copy className="h-4 w-4 text-red-600" />
                  <div>
                    <FormLabel className="text-base font-medium">
                      Prevent Question Copy
                    </FormLabel>
                    <FormDescription>
                      Disable copying of questions and answers
                    </FormDescription>
                  </div>
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
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5 flex items-center gap-2 flex-1">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <div className="flex-1">
                    <FormLabel className="text-base font-medium">
                      Monitor Tab Switching
                    </FormLabel>
                    <FormDescription>
                      Track when students switch away from the quiz
                    </FormDescription>
                  </div>
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

          {preventTabSwitch && (
            <FormField
              control={form.control}
              name="config.tabSwitchLimit"
              render={({ field }) => (
                <FormItem className="ml-10">
                  <FormLabel>Maximum Tab Switches Allowed</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter limit"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty for unlimited switches
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="config.autoSubmit"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5 flex items-center gap-2">
                  <TimerOff className="h-4 w-4 text-red-600" />
                  <div>
                    <FormLabel className="text-base font-medium">
                      Auto Submit
                    </FormLabel>
                    <FormDescription>
                      Automatically submit when time runs out
                    </FormDescription>
                  </div>
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
        </div>
      </div>

      <Separator />

      {/* Attempt Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <RotateCcw className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold">Attempt Settings</h3>
        </div>

        <div className="space-y-3 pl-2">
          <FormField
            control={form.control}
            name="config.maxAttempts"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Maximum Attempts
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Number of attempts allowed"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  How many times students can attempt this quiz
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="config.canReattemptIfFailed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-medium">
                    Allow Reattempt on Failure
                  </FormLabel>
                  <FormDescription>
                    Students can retry if they don&apos;t pass
                  </FormDescription>
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
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Passing Percentage
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter passing percentage"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Minimum score required to pass (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Scoring Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <TrendingDown className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold">Scoring</h3>
        </div>

        <div className="space-y-3 pl-2">
          <FormField
            control={form.control}
            name="config.negativeMarkingEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-medium">
                    Enable Negative Marking
                  </FormLabel>
                  <FormDescription>
                    Deduct marks for incorrect answers
                  </FormDescription>
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
        </div>
      </div>

      <Separator />

      {/* Security Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold">Security & Access</h3>
        </div>

        <div className="space-y-3 pl-2">
          <FormField
            control={form.control}
            name="config.passwordProtected"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-medium">
                    Password Protected
                  </FormLabel>
                  <FormDescription>
                    Require password to access the quiz
                  </FormDescription>
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

          {passwordProtected && (
            <FormField
              control={form.control}
              name="config.password"
              render={({ field }) => (
                <FormItem className="ml-10">
                  <FormLabel>Quiz Password</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter quiz password"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Students will need this password to start the quiz
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="config.calculatorAccess"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-0.5 flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-amber-600" />
                  <div>
                    <FormLabel className="text-base font-medium">
                      Allow Calculator
                    </FormLabel>
                    <FormDescription>
                      Enable calculator tool during the quiz
                    </FormDescription>
                  </div>
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
        </div>
      </div>
    </div>
  );
}
