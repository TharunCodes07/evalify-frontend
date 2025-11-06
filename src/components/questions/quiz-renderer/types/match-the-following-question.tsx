import React, { useState } from "react";
import { StudentMatchTheFollowingQuestion } from "@/types/student-questions";
import { AnswerData } from "@/types/quiz";
import { ContentPreview } from "@/components/rich-text-editor/content-preview";
import { cn } from "@/lib/utils";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchTheFollowingQuestionProps {
  question: StudentMatchTheFollowingQuestion;
  answer: AnswerData | undefined;
  onAnswerChange: (answer: Partial<AnswerData>) => void;
  isDisabled?: boolean;
}

export function MatchTheFollowingQuestion({
  question,
  answer,
  onAnswerChange,
  isDisabled,
}: MatchTheFollowingQuestionProps) {
  const leftPairs = question.options.filter((opt) => opt.isCorrect === true);
  const rightPairs = question.options.filter((opt) => opt.isCorrect === false);
  const matchPairs = answer?.matchPairs || {};

  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (itemId: string) => {
    if (isDisabled) return;
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (leftId: string) => {
    if (isDisabled || !draggedItem) return;

    // Get current matches for this left item
    const currentMatches = matchPairs[leftId] || [];
    const matchArray = Array.isArray(currentMatches)
      ? currentMatches
      : [currentMatches];

    // Check if already matched
    if (matchArray.includes(draggedItem)) {
      setDraggedItem(null);
      return;
    }

    // Add new match
    const newMatchPairs = {
      ...matchPairs,
      [leftId]: [...matchArray, draggedItem],
    };
    onAnswerChange({ matchPairs: newMatchPairs });
    setDraggedItem(null);
  };

  const handleRemoveMatch = (leftId: string, rightId: string) => {
    if (isDisabled) return;
    const currentMatches = matchPairs[leftId] || [];
    const matchArray = Array.isArray(currentMatches)
      ? currentMatches
      : [currentMatches];
    const newMatches = matchArray.filter((id) => id !== rightId);

    const newMatchPairs = { ...matchPairs };
    if (newMatches.length === 0) {
      delete newMatchPairs[leftId];
    } else {
      newMatchPairs[leftId] = newMatches;
    }
    onAnswerChange({ matchPairs: newMatchPairs });
  };

  // Get all matched right IDs
  const getAllMatchedRightIds = () => {
    const matched = new Set<string>();
    Object.values(matchPairs).forEach((value) => {
      const matchArray = Array.isArray(value) ? value : [value];
      matchArray.forEach((id) => matched.add(id));
    });
    return matched;
  };

  const matchedRightIds = getAllMatchedRightIds();

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <p className="text-xs text-slate-600 dark:text-slate-400 italic">
        Drag options from the bottom panel and drop them into the dotted boxes
        next to each statement
      </p>

      {/* Left Column with Drop Zones */}
      <div className="space-y-3">
        {leftPairs.map((option) => {
          const matches = matchPairs[option.id] || [];
          const matchArray = Array.isArray(matches) ? matches : [matches];
          const matchedOptions = matchArray
            .map((id) => rightPairs.find((r) => r.id === id))
            .filter(Boolean);

          return (
            <div key={option.id} className="flex items-start gap-3">
              {/* Left Item */}
              <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  {option.orderIndex + 1}.
                </div>
                <ContentPreview
                  content={option.optionText}
                  className="text-xs"
                  noProse
                />
              </div>

              {/* Drop Zone */}
              <div
                className={cn(
                  "flex-1 min-h-16 border-2 border-dashed rounded-lg transition-all p-2",
                  draggedItem
                    ? "border-primary bg-primary/5 shadow-inner"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20",
                  matchArray.length > 0 && "bg-white dark:bg-slate-900",
                )}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(option.id)}
              >
                {matchArray.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                    Drop answer here
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {matchedOptions.map((matchedOption) =>
                      matchedOption ? (
                        <div
                          key={matchedOption.id}
                          className="flex items-start gap-1.5 p-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-none border border-emerald-200 dark:border-emerald-800"
                        >
                          <div className="flex-1">
                            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-0.5">
                              {String.fromCharCode(
                                65 + matchedOption.orderIndex,
                              )}
                            </div>
                            <ContentPreview
                              content={matchedOption.optionText}
                              className="text-xs"
                              noProse
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleRemoveMatch(option.id, matchedOption.id)
                            }
                            disabled={isDisabled}
                            className="h-5 w-5 p-0 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950/30"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : null,
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Available Options at Bottom */}
      <div className="border-t-2 pt-4">
        <h4 className="font-semibold mb-3 text-xs text-slate-700 dark:text-slate-300">
          Available Options (Drag to match)
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {rightPairs.map((option) => {
            const isUsed = matchedRightIds.has(option.id);
            return (
              <div
                key={option.id}
                draggable={!isDisabled && !isUsed}
                onDragStart={() => handleDragStart(option.id)}
                className={cn(
                  "p-2 border-2 rounded-lg cursor-move transition-all",
                  isUsed
                    ? "opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700"
                    : "border-slate-300 dark:border-slate-700 hover:border-primary hover:shadow-md bg-white dark:bg-slate-900",
                  draggedItem === option.id &&
                    "opacity-50 scale-95 shadow-lg ring-2 ring-primary",
                  isDisabled && "cursor-not-allowed",
                )}
              >
                <div className="flex items-start gap-1.5">
                  {!isUsed && !isDisabled && (
                    <GripVertical className="h-3 w-3 text-slate-400 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                      {String.fromCharCode(65 + option.orderIndex)}
                    </div>
                    <ContentPreview
                      content={option.optionText}
                      className="text-xs wrap-break-word"
                      noProse
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
