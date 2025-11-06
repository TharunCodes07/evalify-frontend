import React from "react";
import { StudentFileUploadQuestion } from "@/types/student-questions";
import { Input } from "@/components/ui/input";
import { AnswerData } from "@/types/quiz";
import { FileUp } from "lucide-react";

interface FileUploadQuestionProps {
  question: StudentFileUploadQuestion;
  answer: AnswerData | undefined;
  onAnswerChange: (answer: Partial<AnswerData>) => void;
  isDisabled?: boolean;
}

export function FileUploadQuestion({
  question,
  answer,
  onAnswerChange,
  isDisabled,
}: FileUploadQuestionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        fileUrls.push(files[i].name);
      }
      onAnswerChange({ fileUrls });
    }
  };

  return (
    <div className="space-y-4">
      {(question.fileUploadConfig?.allowedFileTypes ||
        question.fileUploadConfig?.maxFileSize) && (
        <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
          {question.fileUploadConfig?.allowedFileTypes && (
            <span>
              Allowed: {question.fileUploadConfig.allowedFileTypes.join(", ")}
            </span>
          )}
          {question.fileUploadConfig?.maxFileSize && (
            <span>
              Max size:{" "}
              {(question.fileUploadConfig.maxFileSize / (1024 * 1024)).toFixed(
                2,
              )}{" "}
              MB
            </span>
          )}
        </div>
      )}
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-primary/50 transition-all bg-slate-50 dark:bg-slate-800/30">
        <FileUp className="h-12 w-12 mx-auto mb-3 text-slate-400" />
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Click to upload or drag and drop
        </p>
        <Input
          type="file"
          onChange={handleFileChange}
          disabled={isDisabled}
          accept={question.fileUploadConfig?.allowedFileTypes?.join(",")}
          className="cursor-pointer"
        />
        {answer?.fileUrls && answer.fileUrls.length > 0 && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Uploaded: {answer.fileUrls.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
