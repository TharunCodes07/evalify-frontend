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
  isDragging?: boolean;
}

function SortableItem({ id, children, isDragging }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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

  // Backend structure: options with matchPairIds
  // Left items: options without matchPairIds (or empty matchPairIds)
  // Right items: options with matchPairIds containing correct left item ids
  const leftItems =
    mtfQuestion.options?.filter(
      (opt) => !opt.matchPairIds || opt.matchPairIds.length === 0,
    ) || [];
  const rightItems =
    mtfQuestion.options?.filter(
      (opt) => opt.matchPairIds && opt.matchPairIds.length > 0,
    ) || [];

  const [rightOrder, setRightOrder] = useState(
    rightItems
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((item) => item.id),
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

  // Get correct right item IDs for a left item
  const getCorrectRightId = (leftId: string): string | null => {
    // Find right item that has this leftId in its matchPairIds
    const correctRight = rightItems.find((right) =>
      right.matchPairIds?.includes(leftId),
    );
    return correctRight?.id || null;
  };

  // Check if a match is correct
  const isMatchCorrect = (leftId: string): boolean => {
    const studentRightId = studentPairs[leftId];
    if (!studentRightId) return false;
    const correctRightId = getCorrectRightId(leftId);
    return studentRightId === correctRightId;
  };

  const orderedRightItems = rightOrder
    .map((id) => rightItems.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  // Question only mode - show left items first, then all right items below
  if (!showCorrectAnswer && !showStudentAnswer) {
    return (
      <div className="space-y-6">
        {/* Left Items - Column A */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-muted-foreground mb-2">
            Column A - Items to Match:
          </div>
          {leftItems
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((leftItem, index) => (
              <Card key={leftItem.id} className="p-4">
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

        {/* Right Items - Column B - displayed as larger badges/cards */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-muted-foreground mb-2">
            Column B - Available Options:
          </div>
          <div className="flex flex-wrap gap-3">
            {rightItems
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((rightItem, index) => (
                <div
                  key={rightItem.id}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-muted bg-muted/30 hover:bg-muted/50 transition-colors"
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

  // Editable mode - drag and drop
  if (isEditable && onAnswerEdit) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-muted-foreground mb-2">
              Column A
            </div>
            {leftItems
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((leftItem, index) => (
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

          {/* Right Column - Draggable */}
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

  // Review mode - show matches with correctness
  return (
    <div className="space-y-6">
      {/* Show correct answer pairs */}
      {showCorrectAnswer && (
        <>
          <Card className="p-4 bg-green-50/50 dark:bg-green-950/20 border-green-500">
            <div className="text-sm font-semibold mb-3 text-green-700 dark:text-green-300">
              Correct Matches:
            </div>
            <div className="space-y-2">
              {leftItems
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((leftItem, leftIndex) => {
                  const correctRightId = getCorrectRightId(leftItem.id);
                  const rightItem = rightItems.find(
                    (r) => r.id === correctRightId,
                  );
                  const rightIndex = rightItems
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .findIndex((r) => r.id === correctRightId);

                  return (
                    <div
                      key={leftItem.id}
                      className="flex items-center gap-3 text-sm"
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
                            <span className="text-muted-foreground italic">
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

          {/* All Available Right Items */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-muted-foreground mb-2">
              All Available Options (Column B):
            </div>
            <div className="flex flex-wrap gap-3">
              {rightItems
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((rightItem, index) => (
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
        </>
      )}

      {/* Show student answers if available */}
      {showStudentAnswer && (
        <>
          {Object.keys(studentPairs).length === 0 && !isEditable ? (
            <Card className="p-4 bg-muted/30 border-dashed">
              <div className="text-sm text-muted-foreground italic text-center">
                No matches made by student
              </div>
            </Card>
          ) : (
            <>
              <Card className="p-4">
                <div className="text-sm font-semibold mb-3">
                  {isEditable
                    ? "Edit Student Matches (Click badges below to match):"
                    : "Student's Matches:"}
                </div>
                <div className="space-y-2">
                  {leftItems
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((leftItem, leftIndex) => {
                      const studentRightId = studentPairs[leftItem.id];
                      const rightItem = rightItems.find(
                        (r) => r.id === studentRightId,
                      );
                      const isCorrect = isMatchCorrect(leftItem.id);
                      const hasAnswer = !!studentRightId;
                      const rightIndex = rightItems
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .findIndex((r) => r.id === studentRightId);

                      return (
                        <div
                          key={leftItem.id}
                          className={cn(
                            "flex items-center gap-3 text-sm p-3 rounded-lg border-2",
                            showCorrectAnswer &&
                              isCorrect &&
                              "border-green-500 bg-green-50/50 dark:bg-green-950/20",
                            showCorrectAnswer &&
                              !isCorrect &&
                              hasAnswer &&
                              "border-red-500 bg-red-50/50 dark:bg-red-950/20",
                            !showCorrectAnswer && "border-border",
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
                          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="flex items-center gap-2 flex-1">
                            {hasAnswer ? (
                              <>
                                <Badge variant="outline" className="shrink-0">
                                  {rightIndex >= 0
                                    ? String.fromCharCode(65 + rightIndex)
                                    : "?"}
                                </Badge>
                                <div className="flex-1 p-2 bg-background rounded border">
                                  <ContentPreview
                                    content={rightItem!.optionText}
                                    noProse
                                    className="border-0 p-0"
                                  />
                                </div>
                                {isEditable && (
                                  <button
                                    onClick={() => {
                                      if (onAnswerEdit && question.id) {
                                        const newPairs = { ...studentPairs };
                                        delete newPairs[leftItem.id];
                                        onAnswerEdit(question.id, {
                                          ...studentAnswer,
                                          matchPairs: newPairs,
                                        });
                                      }
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                )}
                              </>
                            ) : (
                              <div className="flex-1 p-2 bg-muted/30 rounded border border-dashed text-muted-foreground italic">
                                {isEditable
                                  ? "Click an option below to match"
                                  : "No match"}
                              </div>
                            )}
                          </div>
                          {showCorrectAnswer && hasAnswer && (
                            <div className="shrink-0">
                              {isCorrect ? (
                                <Check className="h-5 w-5 text-green-600" />
                              ) : (
                                <X className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </Card>

              {isEditable && (
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-muted-foreground mb-2">
                    Available Options (Click to match with items above):
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {rightItems
                      .sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((rightItem, index) => {
                        const matchedToLeft = Object.entries(studentPairs).find(
                          ([_, rightId]) => rightId === rightItem.id,
                        )?.[0];
                        const leftIndex = leftItems
                          .sort((a, b) => a.orderIndex - b.orderIndex)
                          .findIndex((l) => l.id === matchedToLeft);

                        return (
                          <button
                            key={rightItem.id}
                            onClick={() => {
                              if (onAnswerEdit && question.id) {
                                const unmatchedLeft = leftItems
                                  .sort((a, b) => a.orderIndex - b.orderIndex)
                                  .find((l) => !studentPairs[l.id]);

                                if (unmatchedLeft) {
                                  const newPairs = { ...studentPairs };
                                  if (matchedToLeft) {
                                    delete newPairs[matchedToLeft];
                                  }
                                  newPairs[unmatchedLeft.id] = rightItem.id;
                                  onAnswerEdit(question.id, {
                                    ...studentAnswer,
                                    matchPairs: newPairs,
                                  });
                                }
                              }
                            }}
                            className={cn(
                              "inline-flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors",
                              matchedToLeft
                                ? "border-primary/50 bg-primary/10 opacity-50"
                                : "border-muted bg-muted/30 hover:border-primary hover:bg-primary/5",
                            )}
                            disabled={!onAnswerEdit}
                          >
                            <span className="text-sm font-semibold text-muted-foreground shrink-0">
                              {String.fromCharCode(65 + index)}
                              {matchedToLeft && ` → ${leftIndex + 1}`}
                            </span>
                            <div className="text-sm">
                              <ContentPreview
                                content={rightItem.optionText}
                                noProse
                                className="border-0 p-0"
                              />
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
