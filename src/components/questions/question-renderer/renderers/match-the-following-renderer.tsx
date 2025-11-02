"use client";

import { useState } from "react";
import { QuestionRendererProps } from "../types";
import { MatchTheFollowingQuestion } from "@/types/questions";
import { cn } from "@/lib/utils";
import { GripVertical, Check, X, ArrowRight } from "lucide-react";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        {children}
      </div>
    </div>
  );
}

export function MatchTheFollowingRenderer({
  question,
  showCorrectAnswer,
  showStudentAnswer,
  studentAnswer,
  onAnswerEdit,
  isEditable,
}: QuestionRendererProps) {
  const mtfQuestion = question as MatchTheFollowingQuestion;
  const studentPairs = studentAnswer?.matchPairs || {};

  const leftItems = (mtfQuestion.options || [])
    .filter((opt) => opt.isCorrect === true)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const rightItems = (mtfQuestion.options || [])
    .filter((opt) => opt.isCorrect === false)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const [rightOrder, setRightOrder] = useState(
    rightItems.map((item) => item.id),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = rightOrder.indexOf(active.id as string);
      const newIndex = rightOrder.indexOf(over.id as string);
      const newOrder = arrayMove(rightOrder, oldIndex, newIndex);
      setRightOrder(newOrder);

      if (onAnswerEdit && question.id) {
        const newPairs: Record<string, string> = {};
        leftItems.forEach((left, idx) => {
          newPairs[left.id] = newOrder[idx] || "";
        });
        onAnswerEdit(question.id, {
          ...studentAnswer,
          matchPairs: newPairs,
        });
      }
    }
  };

  const getCorrectRightIds = (leftItemId: string): string[] => {
    const leftItem = leftItems.find((item) => item.id === leftItemId);
    return leftItem?.matchPairIds || [];
  };

  const getRightItemsByMatchPairIds = (matchPairIds: string[]) => {
    return rightItems.filter((rightItem) =>
      matchPairIds.some((mpId) => rightItem.matchPairIds?.includes(mpId)),
    );
  };

  const isMatchCorrect = (leftItemId: string): boolean => {
    const studentRightId = studentPairs[leftItemId];
    if (!studentRightId) return false;
    const correctRightIds = getCorrectRightIds(leftItemId);
    const studentRightItem = rightItems.find((r) => r.id === studentRightId);
    if (!studentRightItem?.matchPairIds) return false;
    return correctRightIds.some((mpId) =>
      studentRightItem.matchPairIds?.includes(mpId),
    );
  };

  const orderedRightItems = rightOrder
    .map((id) => rightItems.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  if (!showCorrectAnswer && !showStudentAnswer) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="text-sm font-semibold text-muted-foreground mb-2">
            Column A - Items to Match:
          </div>
          {leftItems.map((leftItem, index) => (
            <Card key={leftItem.id} className="p-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <span className="text-sm font-semibold text-muted-foreground shrink-0">
                  {index + 1}.
                </span>
                <ContentPreview
                  content={leftItem.optionText}
                  noProse
                  className="border-0 p-0"
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-muted-foreground mb-2">
            Column B - Available Options:
          </div>
          <div className="flex flex-wrap gap-3">
            {rightItems.map((rightItem, index) => (
              <div
                key={rightItem.id}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-muted bg-muted/30"
              >
                <span className="text-sm font-semibold text-muted-foreground shrink-0">
                  {String.fromCharCode(65 + index)}.
                </span>
                <div className="text-sm">
                  <ContentPreview
                    content={rightItem.optionText}
                    noProse
                    className="border-0 p-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isEditable && onAnswerEdit) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-muted-foreground mb-2">
              Column A
            </div>
            {leftItems.map((leftItem, index) => (
              <Card key={leftItem.id} className="p-4 bg-muted/30">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-semibold text-muted-foreground shrink-0">
                    {index + 1}.
                  </span>
                  <ContentPreview
                    content={leftItem.optionText}
                    noProse
                    className="border-0 p-0"
                  />
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-muted-foreground mb-2">
              Column B (Drag to reorder and match with Column A)
            </div>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext
                items={rightOrder}
                strategy={verticalListSortingStrategy}
              >
                {orderedRightItems.map((rightItem, index) => (
                  <SortableItem key={rightItem.id} id={rightItem.id}>
                    <Card className="flex-1 p-4 hover:border-primary/50">
                      <div className="flex items-start gap-3">
                        <span className="text-sm font-semibold text-muted-foreground shrink-0">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <ContentPreview
                          content={rightItem.optionText}
                          noProse
                          className="border-0 p-0"
                        />
                      </div>
                    </Card>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showCorrectAnswer && (
        <Card className="p-4 bg-green-50/50 dark:bg-green-950/20 border-green-500">
          <div className="text-sm font-semibold mb-3 text-green-700 dark:text-green-300">
            Correct Matches:
          </div>
          <div className="space-y-2">
            {leftItems.map((leftItem, leftIndex) => {
              const correctRightIds = getCorrectRightIds(leftItem.id);
              const correctRightItems =
                getRightItemsByMatchPairIds(correctRightIds);

              if (correctRightItems.length === 0) {
                return (
                  <div
                    key={leftItem.id}
                    className="flex items-center gap-3 text-sm p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-300"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Badge variant="outline" className="shrink-0">
                        {leftIndex + 1}
                      </Badge>
                      <div className="flex-1 p-2 bg-background rounded border">
                        <ContentPreview
                          content={leftItem.optionText}
                          noProse
                          className="border-0 p-0"
                        />
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 text-xs text-yellow-700 dark:text-yellow-300 italic">
                      No correct match defined
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={leftItem.id}
                  className="flex items-start gap-3 text-sm p-3 bg-background rounded border"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Badge variant="outline" className="shrink-0">
                      {leftIndex + 1}
                    </Badge>
                    <div className="flex-1 p-2 bg-muted/30 rounded border">
                      <ContentPreview
                        content={leftItem.optionText}
                        noProse
                        className="border-0 p-0"
                      />
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-green-600 shrink-0 mt-2" />
                  <div className="flex-1 space-y-2">
                    {correctRightItems.map((rightItem) => {
                      const rightIndex = rightItems.findIndex(
                        (r) => r.id === rightItem.id,
                      );

                      return (
                        <div
                          key={`${leftItem.id}-${rightItem.id}`}
                          className="flex items-center gap-2"
                        >
                          <Badge variant="outline" className="shrink-0">
                            {rightIndex >= 0
                              ? String.fromCharCode(65 + rightIndex)
                              : "?"}
                          </Badge>
                          <div className="flex-1 p-2 bg-green-50 dark:bg-green-950/30 rounded border border-green-200">
                            <ContentPreview
                              content={rightItem.optionText}
                              noProse
                              className="border-0 p-0"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {showStudentAnswer && (
        <>
          {Object.keys(studentPairs).length === 0 ? (
            <Card className="p-4 bg-muted/30 border-dashed">
              <div className="text-sm text-muted-foreground italic text-center">
                No matches made by student
              </div>
            </Card>
          ) : (
            <Card className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-500">
              <div className="text-sm font-semibold mb-3 text-blue-700 dark:text-blue-300">
                Student Matches:
              </div>
              <div className="space-y-2">
                {leftItems.map((leftItem, leftIndex) => {
                  const studentRightId = studentPairs[leftItem.id];
                  const rightItem = rightItems.find(
                    (r) => r.id === studentRightId,
                  );
                  const rightIndex = rightItems.findIndex(
                    (r) => r.id === studentRightId,
                  );
                  const isCorrect =
                    showCorrectAnswer && isMatchCorrect(leftItem.id);
                  const hasAnswer = !!studentRightId;

                  return (
                    <div
                      key={leftItem.id}
                      className={cn(
                        "flex items-center gap-3 text-sm",
                        showCorrectAnswer &&
                          hasAnswer &&
                          (isCorrect
                            ? "bg-green-50 dark:bg-green-950/30 p-2 rounded border border-green-300"
                            : "bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-300"),
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Badge variant="outline" className="shrink-0">
                          {leftIndex + 1}
                        </Badge>
                        <div className="flex-1 p-2 bg-background rounded border">
                          <ContentPreview
                            content={leftItem.optionText}
                            noProse
                            className="border-0 p-0"
                          />
                        </div>
                      </div>
                      <div className="shrink-0">
                        {showCorrectAnswer && hasAnswer ? (
                          isCorrect ? (
                            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                              <X className="h-3 w-3 text-white" />
                            </div>
                          )
                        ) : (
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <Badge variant="outline" className="shrink-0">
                          {rightIndex >= 0
                            ? String.fromCharCode(65 + rightIndex)
                            : "?"}
                        </Badge>
                        <div className="flex-1 p-2 bg-background rounded border">
                          {rightItem ? (
                            <ContentPreview
                              content={rightItem.optionText}
                              noProse
                              className="border-0 p-0"
                            />
                          ) : (
                            <span className="text-muted-foreground italic text-xs">
                              No match
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </>
      )}

      <div className="space-y-3">
        <div className="text-sm font-semibold text-muted-foreground mb-2">
          All Available Options (Column B):
        </div>
        <div className="flex flex-wrap gap-3">
          {rightItems.map((rightItem, index) => (
            <div
              key={rightItem.id}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-muted bg-muted/30"
            >
              <span className="text-sm font-semibold text-muted-foreground shrink-0">
                {String.fromCharCode(65 + index)}.
              </span>
              <div className="text-sm">
                <ContentPreview
                  content={rightItem.optionText}
                  noProse
                  className="border-0 p-0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
