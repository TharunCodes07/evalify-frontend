import { z } from "zod";

export const participantSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Participant = z.infer<typeof participantSchema>;

export const createReviewSchema = z
  .object({
    name: z.string().min(1, { message: "Review name is required." }),
    startDate: z.date({
      required_error: "A start date is required.",
    }),
    endDate: z.date({
      required_error: "An end date is required.",
    }),
    rubricId: z.string().min(1, { message: "A rubric must be selected." }),
    semesters: z.array(participantSchema),
    batches: z.array(participantSchema),
    courses: z.array(participantSchema),
    projects: z.array(participantSchema),
  })
  .refine(
    (data) => {
      return (
        data.semesters.length > 0 ||
        data.batches.length > 0 ||
        data.courses.length > 0 ||
        data.projects.length > 0
      );
    },
    {
      message:
        "At least one participant (semester, batch, course, or project) must be selected.",
      path: ["semesters"], // Display error message under the first tab
    }
  );

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;
