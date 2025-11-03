import { z } from "zod";

export const participantSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Participant = z.infer<typeof participantSchema>;

export const quizConfigSchema = z.object({
  // Display Settings
  showQuestionsOneByOne: z.boolean(),
  allowQuestionNavigation: z.boolean(),

  // Attempt Settings
  maxAttempts: z.number().min(1),
  canReattemptIfFailed: z.boolean(),
  passingPercentage: z.number().min(0).max(100).optional(),

  // Randomization Settings
  shuffleQuestions: z.boolean(),
  shuffleOptions: z.boolean(),
  randomizeQuestions: z.boolean(),

  // Scoring Settings
  negativeMarkingEnabled: z.boolean(),
  negativeMarksValue: z.number().min(0).optional(),
  negativeMarkingQuestionTypes: z.array(z.string()).optional(),

  // Anti-Cheating Settings
  requireFullScreen: z.boolean(),
  preventQuestionCopy: z.boolean(),
  preventTabSwitch: z.boolean(),
  tabSwitchLimit: z.number().min(0).optional(),
  calculatorAccess: z.boolean(),
  autoSubmit: z.boolean(),

  // Security Settings
  passwordProtected: z.boolean(),
  password: z.string().optional(),
});

export type QuizConfigSchema = z.infer<typeof quizConfigSchema>;

export const createQuizSchema = z
  .object({
    // Metadata
    title: z.string().min(1, { message: "Quiz title is required." }),
    description: z.string().optional(),
    startTime: z.date({
      required_error: "Start time is required.",
    }),
    endTime: z.date({
      required_error: "End time is required.",
    }),
    durationMinutes: z
      .number()
      .min(1, { message: "Test duration must be at least 1 minute." }),

    // Participants
    semesters: z.array(participantSchema),
    batches: z.array(participantSchema),
    courses: z.array(participantSchema),
    students: z.array(participantSchema),
    labs: z.array(participantSchema),

    // Settings
    config: quizConfigSchema,
  })
  .refine(
    (data) => {
      const totalParticipants =
        data.semesters.length +
        data.batches.length +
        data.courses.length +
        data.students.length;
      return totalParticipants > 0;
    },
    {
      message:
        "At least one participant must be selected (semester, batch, course, or student).",
      path: ["semesters"],
    },
  )
  .refine(
    (data) => {
      // Compare by milliseconds to handle same date/time properly
      const startMs = data.startTime.getTime();
      const endMs = data.endTime.getTime();
      return endMs >= startMs;
    },
    {
      message: "End time must be after or equal to start time.",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => {
      if (data.config.passwordProtected) {
        return data.config.password && data.config.password.length > 0;
      }
      return true;
    },
    {
      message: "Password is required when password protection is enabled.",
      path: ["config", "password"],
    },
  )
  .refine(
    (data) => {
      if (data.config.preventTabSwitch && data.config.tabSwitchLimit) {
        return data.config.tabSwitchLimit > 0;
      }
      return true;
    },
    {
      message: "Tab switch limit must be greater than 0.",
      path: ["config", "tabSwitchLimit"],
    },
  );

export type CreateQuizSchema = z.infer<typeof createQuizSchema>;

export type ParticipantType =
  | "semesters"
  | "batches"
  | "courses"
  | "students"
  | "labs";
