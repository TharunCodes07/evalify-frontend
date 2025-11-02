"use client";

import { useState } from "react";
import { QuestionRendererProps } from "../types";
import { DescriptiveQuestion } from "@/types/questions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Edit2 } from "lucide-react";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";

export function DescriptiveRenderer({
  question,
  showCorrectAnswer,
  showStudentAnswer,
  studentAnswer,
  onAnswerEdit,
  isEditable,
}: QuestionRendererProps) {
  const descQuestion = question as DescriptiveQuestion;
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState(
    studentAnswer?.answerText || "",
  );

  const wordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleSave = () => {
    if (onAnswerEdit && question.id) {
      onAnswerEdit(question.id, {
        ...studentAnswer,
        answerText: editedAnswer,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedAnswer(studentAnswer?.answerText || "");
    setIsEditing(false);
  };

  const studentWordCount = wordCount(studentAnswer?.answerText || "");
  const minWords = descQuestion.descriptiveConfig.minWords;
  const maxWords = descQuestion.descriptiveConfig.maxWords;
  const meetsMinWords = !minWords || studentWordCount >= minWords;
  const meetsMaxWords = !maxWords || studentWordCount <= maxWords;

  return (
    <div className="space-y-4">
      {(minWords || maxWords) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {minWords && <span>Min: {minWords} words</span>}
          {minWords && maxWords && <span>•</span>}
          {maxWords && <span>Max: {maxWords} words</span>}
        </div>
      )}

      {showStudentAnswer && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Student Answer</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {studentWordCount} words
              </span>
              {!meetsMinWords && (
                <Badge variant="destructive" className="text-xs">
                  Below minimum
                </Badge>
              )}
              {!meetsMaxWords && (
                <Badge variant="destructive" className="text-xs">
                  Exceeds maximum
                </Badge>
              )}
              {isEditable && onAnswerEdit && !isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-7"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">
                {studentAnswer?.answerText || (
                  <span className="italic text-muted-foreground">
                    No answer provided
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {showCorrectAnswer && descQuestion.descriptiveConfig.modelAnswer && (
        <div className="space-y-2">
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            Model Answer
          </span>
          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
            <ContentPreview
              content={descQuestion.descriptiveConfig.modelAnswer}
              noProse
              className="border-0 p-0"
            />
          </div>
        </div>
      )}

      {showCorrectAnswer &&
        descQuestion.descriptiveConfig.keywords &&
        descQuestion.descriptiveConfig.keywords.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-semibold">Keywords</span>
            <div className="flex flex-wrap gap-2">
              {descQuestion.descriptiveConfig.keywords.map((keyword, idx) => (
                <Badge key={idx} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
