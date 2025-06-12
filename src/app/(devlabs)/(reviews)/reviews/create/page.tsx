"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createReviewSchema,
  CreateReviewSchema,
} from "@/components/reviews/create-review-schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { BasicInfoForm } from "@/components/reviews/basic-info-form";
import { ParticipantsForm } from "@/components/reviews/participants-form";
import { ReviewSummary } from "@/components/reviews/review-summary";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { DevTool } from "@hookform/devtools";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import reviewQueries from "@/repo/review-queries/review-queries";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CreateReviewRequest } from "@/repo/review-queries/review-types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const formSteps = [
  { value: "basic-info", label: "Basic Info" },
  { value: "participants", label: "Participants" },
  { value: "summary", label: "Summary" },
];

export default function Page() {
  const [currentTab, setCurrentTab] = useState(formSteps[0].value);
  const user = useCurrentUser();
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateReviewSchema>({
    resolver: zodResolver(createReviewSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      startDate: undefined,
      endDate: undefined,
      rubricId: undefined,
      semesters: [],
      batches: [],
      courses: [],
      projects: [],
    },
  });

  const { mutate: createReview, isPending } = useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewQueries.createReview(data),
    onSuccess: () => {
      success("Review created successfully!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      // TODO: Redirect to the new review page or reviews list
    },
    onError: (err) => {
      error(`Failed to create review: ${err.message}`);
    },
  });

  async function onSubmit(data: CreateReviewSchema) {
    if (!user) {
      error("You must be logged in to create a review.");
      return;
    }

    const requestData: CreateReviewRequest = {
      name: data.name,
      startDate: format(data.startDate, "yyyy-MM-dd"),
      endDate: format(data.endDate, "yyyy-MM-dd"),
      rubricsId: data.rubricId,
      userId: user.id,
      semesterIds: data.semesters.map((s) => s.id),
      batchIds: data.batches.map((b) => b.id),
      courseIds: data.courses.map((c) => c.id),
      projectIds: data.projects.map((p) => p.id),
    };
    createReview(requestData);
  }

  const handleNext = async () => {
    let fieldsToValidate: (keyof CreateReviewSchema)[] = [];
    if (currentTab === "basic-info") {
      fieldsToValidate = ["name", "startDate", "endDate", "rubricId"];
    } else if (currentTab === "participants") {
      fieldsToValidate = ["semesters", "batches", "courses", "projects"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (!isValid) return;

    const currentIndex = formSteps.findIndex(
      (step) => step.value === currentTab
    );
    if (currentIndex < formSteps.length - 1) {
      setCurrentTab(formSteps[currentIndex + 1].value);
    }
  };

  const handlePrevious = () => {
    const currentIndex = formSteps.findIndex(
      (step) => step.value === currentTab
    );
    if (currentIndex > 0) {
      setCurrentTab(formSteps[currentIndex - 1].value);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case "basic-info":
        return <BasicInfoForm />;
      case "participants":
        return <ParticipantsForm />;
      case "summary":
        return <ReviewSummary />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-4">
              {formSteps.map((step) => (
                <TabsTrigger
                  key={step.value}
                  value={step.value}
                  onClick={() => setCurrentTab(step.value)}
                >
                  {step.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <Card>
              <CardHeader>
                <CardTitle>
                  {formSteps.find((s) => s.value === currentTab)?.label}
                </CardTitle>
                <CardDescription>
                  {currentTab === "basic-info" &&
                    "Fill in the basic details of the review."}
                  {currentTab === "participants" &&
                    "Select the participants for this review."}
                  {currentTab === "summary" &&
                    "Review all the details before creating the review."}
                </CardDescription>
              </CardHeader>
              <CardContent>{renderContent()}</CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentTab === formSteps[0].value || isPending}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                {currentTab !== "summary" ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isPending}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Create Review
                  </Button>
                )}
              </CardFooter>
            </Card>
          </Tabs>
        </form>
      </Form>
      {process.env.NODE_ENV === "development" && (
        <DevTool control={form.control} />
      )}
    </div>
  );
}
