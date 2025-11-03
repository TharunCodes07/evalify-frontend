"use client";
import { useState, useEffect } from "react";
import { ViewToggle, ViewMode } from "@/components/data-grid/view-toggle";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { DataGrid } from "@/components/data-grid/data-grid";
import { GridItem } from "@/components/data-grid/grid-item";
import { FileQuestion, Clock, PlusCircle } from "lucide-react";
import { getColumns } from "@/components/quiz/quiz-columns";
import { useQuizzes } from "@/components/quiz/hooks/use-quizzes-table";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { ShareQuizDialog } from "@/components/quiz/share-quiz-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import quizQueries from "@/repo/quiz-queries/quiz-queries";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@/lib/session-context";
import { QuizListResponse } from "@/types/quiz";

function useQuizzesForDataTable(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
) {
  return useQuizzes(
    search,
    page - 1,
    pageSize,
    sortBy,
    sortOrder as "asc" | "desc",
  );
}

useQuizzesForDataTable.isQueryHook = true;

const calculateQuizStatus = (
  startTime?: string,
  endTime?: string,
  isPublished?: boolean,
) => {
  if (!isPublished) return "draft";
  if (!startTime || !endTime) return "scheduled";

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) return "scheduled";
  if (now >= start && now <= end) return "active";
  return "completed";
};

export default function QuizzesPage() {
  const [viewmode, setViewMode] = useState<ViewMode>("table");
  const [quizToDelete, setQuizToDelete] = useState<QuizListResponse | null>(
    null,
  );
  const [quizToShare, setQuizToShare] = useState<QuizListResponse | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useSessionContext();
  const { success, error: showError } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (quizId: string) => {
      return quizQueries.deleteQuiz(quizId);
    },
    onSuccess: () => {
      success("Quiz deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      setQuizToDelete(null);
    },
    onError: (error) => {
      showError(`Failed to delete quiz: ${error.message}`);
      setQuizToDelete(null);
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("quiz-view") as ViewMode;
    if ((saved && saved === "table") || saved === "grid") {
      setViewMode(saved);
    }
  }, []);

  const handleViewModeChange = (newViewMode: ViewMode) => {
    setViewMode(newViewMode);
    localStorage.setItem("quiz-view", newViewMode);
  };

  const handleView = (quiz: QuizListResponse) => {
    router.push(`/quiz/${quiz.id}`);
  };

  const handleDelete = (quiz: QuizListResponse) => {
    setQuizToDelete(quiz);
  };

  const handleEdit = (quiz: QuizListResponse) => {
    router.push(`/quiz/${quiz.id}/edit`);
  };

  const handleShare = (quiz: QuizListResponse) => {
    setQuizToShare(quiz);
  };

  const handleCreate = () => {
    router.push("/quiz/create");
  };

  const columnsWrapper = () => {
    return getColumns(
      handleView,
      handleEdit,
      handleDelete,
      handleShare,
      session?.user?.id,
    );
  };

  // Create a wrapper function for the data table
  const useFilteredQuizzes = (
    page: number,
    pageSize: number,
    search: string,
    dateRange: { from_date: string; to_date: string },
    sortBy: string,
    sortOrder: string,
  ) => {
    return useQuizzesForDataTable(
      page,
      pageSize,
      search,
      dateRange,
      sortBy,
      sortOrder,
    );
  };

  // Add the isQueryHook flag to our wrapper
  useFilteredQuizzes.isQueryHook = true;

  const renderQuizGrid = (
    quiz: QuizListResponse,
    index: number,
    isSelected: boolean,
    onToggleSelect: () => void,
  ) => {
    const quizItem = quiz as QuizListResponse & Record<string, unknown>;
    const status = calculateQuizStatus(
      quiz.startTime,
      quiz.endTime,
      quiz.isPublished,
    );

    return (
      <GridItem<QuizListResponse & Record<string, unknown>>
        key={quiz.id}
        item={quizItem}
        isSelected={isSelected}
        onToggleSelect={onToggleSelect}
        onCardClick={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        fieldConfig={{
          id: "id",
          title: "title",
          description: "description",
          createdAt: "createdAt",
          badge: {
            field: "status",
            label: "",
            variant: "outline",
            format: () => status,
          },
          stats: [
            {
              field: "questionCount",
              label: "questions",
              icon: FileQuestion,
              format: (value: unknown) => value?.toString() || "0",
            },
            {
              field: "durationMinutes",
              label: "duration",
              icon: Clock,
              format: (value: unknown) => {
                const duration = value as number;
                const hours = Math.floor(duration / 60);
                const minutes = duration % 60;
                return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
              },
            },
          ],
        }}
        entityName="quiz"
      />
    );
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FileQuestion className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">Quizzes</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Create and manage quizzes and assessments
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
          <ViewToggle
            view={viewmode}
            onViewChange={handleViewModeChange}
            className="shrink-0"
          />
        </div>
      </div>

      <div>
        {viewmode === "table" ? (
          <DataTable
            config={{
              enableUrlState: false,
              enableExport: true,
              enableDateFilter: false,
            }}
            exportConfig={{
              entityName: "quizzes",
              columnMapping: {
                title: "Quiz Title",
                status: "Status",
                startTime: "Start Time",
                endTime: "End Time",
                durationMinutes: "Duration (minutes)",
                questionCount: "Questions",
                "createdBy.name": "Created By Name",
              },
              columnWidths: [
                { wch: 30 }, // title
                { wch: 15 }, // status
                { wch: 20 }, // startTime
                { wch: 20 }, // endTime
                { wch: 15 }, // durationMinutes
                { wch: 15 }, // questionCount
                { wch: 20 }, // createdBy.name
              ],
              headers: [
                "title",
                "status",
                "startTime",
                "endTime",
                "durationMinutes",
                "questionCount",
                "createdBy.name",
              ],
            }}
            getColumns={columnsWrapper}
            fetchDataFn={useFilteredQuizzes}
            idField="id"
            onRowClick={handleView}
          />
        ) : (
          <DataGrid
            config={{
              enableUrlState: false,
            }}
            defaultSort={{
              sortBy: "createdAt",
              sortOrder: "desc",
            }}
            exportConfig={{
              entityName: "quizzes",
              columnMapping: {
                title: "Quiz Title",
                status: "Status",
                startTime: "Start Time",
                endTime: "End Time",
                durationMinutes: "Duration (minutes)",
                questionCount: "Questions",
                "createdBy.name": "Created By Name",
              },
              columnWidths: [
                { wch: 30 },
                { wch: 15 },
                { wch: 20 },
                { wch: 20 },
                { wch: 15 },
                { wch: 15 },
                { wch: 20 },
              ],
              headers: [
                "title",
                "status",
                "startTime",
                "endTime",
                "durationMinutes",
                "questionCount",
                "createdBy.name",
              ],
            }}
            getColumns={columnsWrapper}
            renderGridItem={renderQuizGrid}
            fetchDataFn={useFilteredQuizzes}
            idField="id"
            gridConfig={{
              columns: { default: 1, md: 2, lg: 3, xl: 4 },
              gap: 6,
            }}
            pageSizeOptions={[12, 24, 36, 48]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <DeleteDialog
        isOpen={!!quizToDelete}
        onClose={() => setQuizToDelete(null)}
        onConfirm={() => quizToDelete && deleteMutation.mutate(quizToDelete.id)}
        title="Delete Quiz"
        description={`Are you sure you want to delete the quiz "${quizToDelete?.title}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />

      {quizToShare && (
        <ShareQuizDialog
          quiz={quizToShare}
          isOpen={!!quizToShare}
          onClose={() => setQuizToShare(null)}
        />
      )}
    </div>
  );
}
