"use client";

import { QuestionRendererProps } from "../types";
import { FillInBlanksQuestion } from "@/types/questions";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, X, Save, XCircle } from "lucide-react";
import { useState } from "react";

export function FillInBlanksRenderer({
  question,
  showCorrectAnswer,
  showStudentAnswer,
  studentAnswer,
  onAnswerEdit,
  isEditable,
}: QuestionRendererProps) {
  const fibQuestion = question as FillInBlanksQuestion;
  const { blankConfig } = fibQuestion;
  const studentBlanks = studentAnswer?.blankValues || {};
  const [editingBlanks, setEditingBlanks] =
    useState<Record<number, string>>(studentBlanks);

  const handleBlankChange = (blankIndex: number, value: string) => {
    setEditingBlanks((prev) => ({
      ...prev,
      [blankIndex]: value,
    }));
  };

  const saveAnswers = () => {
    if (!onAnswerEdit || !question.id) return;
    onAnswerEdit(question.id, {
      ...studentAnswer,
      blankValues: editingBlanks,
    });
  };

  const cancelEditing = () => {
    setEditingBlanks(studentBlanks);
  };

  const isBlankCorrect = (blankIndex: number): boolean => {
    const studentValue = studentBlanks[blankIndex]?.trim().toLowerCase() || "";
    const acceptableAnswers = blankConfig.acceptableAnswers[blankIndex] || [];
    return acceptableAnswers.some(
      (answer) => answer.trim().toLowerCase() === studentValue,
    );
  };

  return (
    <div className="space-y-4">
      {/* Editable Mode - Compact Input Fields */}
      {isEditable && onAnswerEdit && (
        <Card className="p-4 bg-muted/30">
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground mb-3">
              Fill in your answers:
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: blankConfig.blankCount }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="shrink-0 min-w-[70px] justify-center"
                  >
                    Blank {i + 1}
                  </Badge>
                  <Input
                    value={editingBlanks[i] || ""}
                    onChange={(e) => handleBlankChange(i, e.target.value)}
                    className="h-9"
                    placeholder={`Enter answer ${i + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={saveAnswers}>
                <Save className="h-4 w-4 mr-1" />
                Save Answers
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEditing}>
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!isEditable && (showStudentAnswer || showCorrectAnswer) && (
        <div className="space-y-3">
          {Array.from({ length: blankConfig.blankCount }, (_, i) => {
            const studentValue = studentBlanks[i] || "";
            const acceptableAnswers = blankConfig.acceptableAnswers[i] || [];
            const isCorrect = isBlankCorrect(i);
            const hasStudentAnswer = studentValue.trim() !== "";

            return (
              <Card
                key={i}
                className={cn(
                  "p-4 transition-colors",
                  showCorrectAnswer &&
                    isCorrect &&
                    "border-green-500 bg-green-50/50 dark:bg-green-950/20",
                  showCorrectAnswer &&
                    !isCorrect &&
                    hasStudentAnswer &&
                    "border-red-500 bg-red-50/50 dark:bg-red-950/20",
                )}
              >
                <div className="space-y-2">
                  {/* Blank Header */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="shrink-0">
                      Blank {i + 1}
                    </Badge>
                    {showCorrectAnswer && hasStudentAnswer && (
                      <>
                        {isCorrect ? (
                          <Badge className="bg-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Correct
                          </Badge>
                        ) : (
                          <Badge className="bg-red-600">
                            <X className="h-3 w-3 mr-1" />
                            Incorrect
                          </Badge>
                        )}
                      </>
                    )}
                  </div>

                  {/* Student Answer */}
                  {showStudentAnswer && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground font-medium">
                        Student Answer:
                      </div>
                      <div
                        className={cn(
                          "px-3 py-2 rounded bg-background border-2",
                          showCorrectAnswer && isCorrect && "border-green-500",
                          showCorrectAnswer &&
                            !isCorrect &&
                            hasStudentAnswer &&
                            "border-red-500",
                          !showCorrectAnswer && "border-primary/30",
                        )}
                      >
                        {hasStudentAnswer ? (
                          <span className="font-medium">{studentValue}</span>
                        ) : (
                          <span className="text-muted-foreground italic">
                            No answer provided
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Correct Answers */}
                  {showCorrectAnswer && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground font-medium">
                        Acceptable Answer
                        {acceptableAnswers.length > 1 ? "s" : ""}:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {acceptableAnswers.map((answer, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-sm font-normal"
                          >
                            {answer}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showStudentAnswer &&
        Object.keys(studentBlanks).length === 0 &&
        blankConfig.blankCount > 0 &&
        !isEditable && (
          <div className="text-sm text-muted-foreground italic mt-4 p-4 border border-dashed rounded">
            No answers provided by student
          </div>
        )}
    </div>
  );
}
