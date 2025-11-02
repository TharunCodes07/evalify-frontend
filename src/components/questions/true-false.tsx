"use client";

import { TrueFalseQuestion } from "@/types/questions";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Check, X } from "lucide-react";
import QuestionAttachments from "./question-attachments";

interface TrueFalseComponentProps {
  value: TrueFalseQuestion;
  onChange: (question: TrueFalseQuestion) => void;
}

export default function TrueFalseComponent({
  value,
  onChange,
}: TrueFalseComponentProps) {
  const handleQuestionChange = (content: string) => {
    onChange({ ...value, text: content });
  };

  const handleAnswerChange = (answer: boolean) => {
    onChange({ ...value, answer });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            initialContent={value.text || ""}
            onUpdate={handleQuestionChange}
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Correct Answer</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Choose whether the statement is True or False
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => handleAnswerChange(true)}
              variant={value.answer === true ? "default" : "outline"}
              className={`flex-1 h-20 text-lg font-semibold ${
                value.answer === true
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-500"
              }`}
            >
              <Check className="h-6 w-6 mr-2" />
              True
            </Button>
            <Button
              type="button"
              onClick={() => handleAnswerChange(false)}
              variant={value.answer === false ? "default" : "outline"}
              className={`flex-1 h-20 text-lg font-semibold ${
                value.answer === false
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-500"
              }`}
            >
              <X className="h-6 w-6 mr-2" />
              False
            </Button>
          </div>
        </CardContent>
      </Card>

      <QuestionAttachments
        attachedFiles={value.attachedFiles}
        onChange={(files) => onChange({ ...value, attachedFiles: files })}
      />
    </div>
  );
}
