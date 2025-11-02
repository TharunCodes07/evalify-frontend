"use client";

import { QuestionRendererProps } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { getQuestionTypeDisplayName } from "../../question-factory";
import { MarksEditor } from "./marks-editor";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";

export function QuestionHeader({
  question,
  questionNumber,
  studentAnswer,
  onEdit,
  onDelete,
  onMarksEdit,
  showCorrectAnswer: _showCorrectAnswer,
}: QuestionRendererProps) {
  const hasStudentAnswer =
    studentAnswer && Object.keys(studentAnswer).length > 0;

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
            {"bloomsTaxonomy" in question &&
              (question as { bloomsTaxonomy?: string }).bloomsTaxonomy && (
                <Badge
                  variant="outline"
                  className="font-normal bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700"
                >
                  {(question as { bloomsTaxonomy: string }).bloomsTaxonomy}
                </Badge>
              )}
            {"difficulty" in question &&
              (question as { difficulty?: string }).difficulty && (
                <Badge
                  variant="outline"
                  className="font-normal bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-700"
                >
                  {(question as { difficulty: string }).difficulty}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(question.id!)}
            >
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

      {onMarksEdit && question.id && hasStudentAnswer && (
        <MarksEditor
          currentMarks={studentAnswer.marksAwarded}
          maxMarks={question.marks}
          onSave={(marks: number) => onMarksEdit(question.id!, marks)}
        />
      )}
    </div>
  );
}
