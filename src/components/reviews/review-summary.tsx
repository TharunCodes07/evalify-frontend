"use client";

import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CreateReviewSchema, Participant } from "./create-review-schema";
import rubricQueries from "@/repo/rubrics-queries/rubrics-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Rubric } from "@/repo/rubrics-queries/rubric-types";

function SummarySection({
  title,
  items,
  renderItem,
}: {
  title: string;
  items: Participant[] | undefined;
  renderItem: (item: Participant) => React.ReactNode;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item.id} variant="secondary">
            {renderItem(item)}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function ReviewSummary() {
  const { getValues } = useFormContext<CreateReviewSchema>();
  const values = getValues();

  const { data: rubric, isLoading: isLoadingRubric } = useQuery<Rubric>({
    queryKey: ["rubric", values.rubricId],
    queryFn: () => rubricQueries.getRubricById(values.rubricId!),
    enabled: !!values.rubricId,
  });

  if (isLoadingRubric) {
    return <Skeleton className="h-64 w-full" />;
  }

  const { name, startDate, endDate, semesters, batches, courses, projects } =
    values;

  const allParticipantsEmpty =
    (!semesters || semesters.length === 0) &&
    (!batches || batches.length === 0) &&
    (!courses || courses.length === 0) &&
    (!projects || projects.length === 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Name</h3>
            <p>{name}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Start Date</h3>
              {startDate && <p>{format(startDate, "PPP")}</p>}
            </div>
            <div>
              <h3 className="font-semibold">End Date</h3>
              {endDate && <p>{format(endDate, "PPP")}</p>}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Rubric</h3>
            <p>{rubric?.name ?? "Not selected"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SummarySection
            title="Semesters"
            items={semesters}
            renderItem={(item) => <>{item.name}</>}
          />
          <SummarySection
            title="Batches"
            items={batches}
            renderItem={(item) => <>{item.name}</>}
          />
          <SummarySection
            title="Courses"
            items={courses}
            renderItem={(item) => <>{item.name}</>}
          />
          <SummarySection
            title="Projects"
            items={projects}
            renderItem={(item) => <>{item.name}</>}
          />
          {allParticipantsEmpty && <p>No participants selected.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
