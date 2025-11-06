import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StudentQuestion } from "@/types/student-questions";
import { cn } from "@/lib/utils";

interface QuestionPaletteProps {
  questions: StudentQuestion[];
  currentQuestionIndex: number;
  getQuestionStatus: (questionId: string) => string;
  onNavigate: (index: number) => void;
  isNavigationDisabled: boolean;
}

export function QuestionPalette({
  questions,
  currentQuestionIndex,
  getQuestionStatus,
  onNavigate,
  isNavigationDisabled,
}: QuestionPaletteProps) {
  return (
    <div className="min-h-[200px] lg:min-h-[calc(100vh-120px)] max-h-[300px] lg:max-h-[90vh] flex flex-col">
      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="p-3 lg:p-4 border-b bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
            Question Palette
          </h3>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 lg:p-3">
            <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-5 gap-1">
              {questions.map((question, index) => {
                const status = getQuestionStatus(question.id);
                return (
                  <button
                    key={question.id}
                    onClick={() => onNavigate(index)}
                    disabled={isNavigationDisabled}
                    className={cn(
                      "w-full h-10 lg:h-12 p-1 lg:p-2 rounded-lg font-medium text-xs lg:text-sm transition-all duration-200 flex items-center justify-center",
                      "hover:brightness-110 active:scale-98 hover:shadow-sm transform-gpu",
                      "focus:outline-none focus:ring-2 focus:ring-offset-1",
                      currentQuestionIndex === index &&
                        "ring-2 ring-primary ring-offset-1 ring-offset-background shadow-md",
                      status === "answered" &&
                        "bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900/70",
                      status === "marked" &&
                        "bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900/70",
                      status === "unanswered" &&
                        "bg-white text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                      isNavigationDisabled && "cursor-not-allowed opacity-50",
                    )}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
