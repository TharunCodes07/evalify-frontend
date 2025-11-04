"use client";

import { useState } from "react";
import { QuestionRendererProps } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { getQuestionTypeDisplayName } from "../../question-factory";
import { MarksEditor } from "./marks-editor";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { AttachmentViewer } from "@/components/rich-text-editor/attachment-viewer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function QuestionHeader({
  question,
  questionNumber,
  studentAnswer,
  onEdit,
  onDelete,
  onMarksEdit,
  showCorrectAnswer: _showCorrectAnswer,
}: QuestionRendererProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const hasStudentAnswer =
    studentAnswer && Object.keys(studentAnswer).length > 0;

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete && question.id) {
      onDelete(question.id);
    }
    setShowDeleteDialog(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {questionNumber && (
              <span className="text-sm font-semibold text-muted-foreground">
                Q{questionNumber}.
              </span>
            )}
            <Badge variant="secondary" className="font-normal">
              {getQuestionTypeDisplayName(question.questionType)}
            </Badge>
            {question.marks > 0 && (
              <Badge variant="outline" className="font-normal">
                {question.marks} {question.marks === 1 ? "mark" : "marks"}
              </Badge>
            )}
            {question.courseOutcome !== undefined &&
              question.courseOutcome !== null && (
                <Badge
                  variant="outline"
                  className="font-normal bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700"
                >
                  CO-{question.courseOutcome}
                </Badge>
              )}
            {question.bloomLevel && (
              <Badge
                variant="outline"
                className="font-normal bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700"
              >
                {question.bloomLevel}
              </Badge>
            )}
            {question.difficulty && (
              <Badge
                variant="outline"
                className={`font-normal ${
                  question.difficulty === "EASY"
                    ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
                    : question.difficulty === "MEDIUM"
                      ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400"
                      : "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400"
                }`}
              >
                {question.difficulty}
              </Badge>
            )}
            {hasStudentAnswer && studentAnswer.isCorrect !== undefined && (
              <Badge
                variant={studentAnswer.isCorrect ? "default" : "destructive"}
                className="gap-1"
              >
                {studentAnswer.isCorrect ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Correct
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Incorrect
                  </>
                )}
              </Badge>
            )}
            {hasStudentAnswer && studentAnswer.marksAwarded !== undefined && (
              <Badge
                variant="outline"
                className={
                  studentAnswer.isCorrect
                    ? "border-green-600 text-green-700 dark:text-green-400"
                    : "border-orange-600 text-orange-700 dark:text-orange-400"
                }
              >
                {studentAnswer.marksAwarded} / {question.marks} marks
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && question.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(question.id!)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && question.id && (
            <Button variant="ghost" size="sm" onClick={handleDeleteClick}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>

      <div className="text-base leading-relaxed">
        <ContentPreview
          content={question.text}
          noProse
          className="border-0 p-0"
        />
      </div>

      {question.attachedFiles && question.attachedFiles.length > 0 && (
        <AttachmentViewer files={question.attachedFiles} />
      )}

      {onMarksEdit && question.id && hasStudentAnswer && (
        <MarksEditor
          currentMarks={studentAnswer.marksAwarded}
          maxMarks={question.marks}
          onSave={(marks: number) => onMarksEdit(question.id!, marks)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
