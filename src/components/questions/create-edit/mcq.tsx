"use client";

import {
  MCQQuestion,
  MMCQQuestion,
  QuestionType,
  QuestionOption,
} from "@/types/questions";
import { useEffect, useState } from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Save,
  X,
  ListChecks,
  FileText,
  Edit3,
  Check,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import QuestionAttachments from "./question-attachments";

interface MCQComponentProps {
  value: MCQQuestion | MMCQQuestion;
  onChange: (question: MCQQuestion | MMCQQuestion) => void;
}

export default function MCQComponent({ value, onChange }: MCQComponentProps) {
  const [isCreatingNewOption, setIsCreatingNewOption] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editor, setEditor] = useState<string>("");
  const [marksWeightage, setMarksWeightage] = useState<number>(1);
  const [allowMultipleCorrect, setAllowMultipleCorrect] = useState(
    value.questionType === QuestionType.MMCQ,
  );

  useEffect(() => {
    setAllowMultipleCorrect(value.questionType === QuestionType.MMCQ);
  }, [value.questionType]);

  const handleAddOption = () => {
    setIsCreatingNewOption(true);
    setEditingOptionId(null);
    setEditor("");
    setMarksWeightage(1);
  };

  const handleEditOption = (optionId: string) => {
    setIsCreatingNewOption(false);
    setEditingOptionId(optionId);
    const option = (value.options || []).find((opt) => opt.id === optionId);
    if (option) {
      setEditor(option.optionText);
      setMarksWeightage(option.marksWeightage || 1);
    }
  };

  const handleCancelEdit = () => {
    setIsCreatingNewOption(false);
    setEditingOptionId(null);
    setEditor("");
    setMarksWeightage(1);
  };

  const handleDeleteOption = (optionId: string) => {
    onChange({
      ...value,
      options: (value.options || []).filter((opt) => opt.id !== optionId),
    });
  };

  const handleSaveOption = () => {
    if (!editor.trim()) return;

    if (editingOptionId) {
      onChange({
        ...value,
        options: (value.options || []).map((opt) =>
          opt.id === editingOptionId
            ? { ...opt, optionText: editor, marksWeightage }
            : opt,
        ),
      });
    } else {
      const newOption: QuestionOption = {
        id: crypto.randomUUID(),
        optionText: editor,
        orderIndex: (value.options || []).length,
        isCorrect: false,
        marksWeightage: allowMultipleCorrect ? marksWeightage : undefined,
      };
      onChange({
        ...value,
        options: [...(value.options || []), newOption],
      });
    }
    setIsCreatingNewOption(false);
    setEditingOptionId(null);
    setEditor("");
    setMarksWeightage(1);
  };

  const handleSetCorrect = (optionId: string) => {
    const currentOption = (value.options || []).find(
      (opt) => opt.id === optionId,
    );
    const isCurrentlyCorrect = currentOption?.isCorrect || false;

    onChange({
      ...value,
      options: (value.options || []).map((opt) => {
        if (opt.id === optionId) {
          return { ...opt, isCorrect: !isCurrentlyCorrect };
        }
        return allowMultipleCorrect ? opt : { ...opt, isCorrect: false };
      }),
    });
  };

  const handleQuestionChange = (content: string) => {
    onChange({ ...value, text: content });
  };

  const handleMultipleCorrectToggle = (enabled: boolean) => {
    setAllowMultipleCorrect(enabled);
    const newType = enabled ? QuestionType.MMCQ : QuestionType.MCQ;

    const updatedQuestion = {
      ...value,
      questionType: newType,
    };

    if (!enabled) {
      const correctOptions = (value.options || []).filter(
        (opt) => opt.isCorrect,
      );
      if (correctOptions.length > 1) {
        const firstCorrectIndex = (value.options || []).findIndex(
          (opt) => opt.isCorrect,
        );
        updatedQuestion.options = (value.options || []).map((opt, index) => ({
          ...opt,
          isCorrect: index === firstCorrectIndex,
          marksWeightage: undefined,
        }));
      }
    }

    onChange(updatedQuestion as MCQQuestion | MMCQQuestion);
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Options
            </CardTitle>

            <div className="flex items-center gap-2">
              <Label htmlFor="allow-multiple" className="text-sm">
                Allow multiple correct answers
              </Label>
              <Checkbox
                id="allow-multiple"
                checked={allowMultipleCorrect}
                onCheckedChange={handleMultipleCorrectToggle}
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            {allowMultipleCorrect
              ? "Mode: MMCQ - Click options to select multiple correct answers"
              : "Mode: MCQ - Click to select the single correct answer"}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(value.options || []).map((option, index) => (
            <div
              key={option.id}
              className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md ${
                option.isCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              onClick={() => !editingOptionId && handleSetCorrect(option.id)}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    option.isCorrect
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + index)}.
                </span>
                {option.isCorrect && (
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                )}
              </div>

              {editingOptionId === option.id ? (
                <div className="flex-1 space-y-2">
                  <TiptapEditor
                    initialContent={editor}
                    onUpdate={setEditor}
                    className="min-h-[100px]"
                  />
                  {allowMultipleCorrect && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="weightage" className="text-xs">
                        Marks Weightage:
                      </Label>
                      <Input
                        id="weightage"
                        type="number"
                        min="0"
                        step="0.1"
                        value={marksWeightage}
                        onChange={(e) =>
                          setMarksWeightage(parseFloat(e.target.value) || 1)
                        }
                        className="w-20 h-8"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveOption}
                      disabled={!editor.trim()}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <div
                      className="prose prose-sm dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: option.optionText }}
                    />
                    {allowMultipleCorrect && option.marksWeightage && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Weightage: {option.marksWeightage}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={option.isCorrect ? "default" : "ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetCorrect(option.id);
                      }}
                      className={`${
                        option.isCorrect
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditOption(option.id);
                      }}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOption(option.id);
                      }}
                      className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          {isCreatingNewOption && (
            <div className="flex items-start gap-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground pt-2">
                {String.fromCharCode(65 + (value.options || []).length)}.
              </span>
              <div className="flex-1 space-y-2">
                <TiptapEditor
                  initialContent=""
                  onUpdate={setEditor}
                  className="min-h-[100px]"
                />
                {allowMultipleCorrect && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="new-weightage" className="text-xs">
                      Marks Weightage:
                    </Label>
                    <Input
                      id="new-weightage"
                      type="number"
                      min="0"
                      step="0.1"
                      value={marksWeightage}
                      onChange={(e) =>
                        setMarksWeightage(parseFloat(e.target.value) || 1)
                      }
                      className="w-20 h-8"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveOption}
                    disabled={!editor.trim()}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleAddOption}
            disabled={isCreatingNewOption || editingOptionId !== null}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </CardContent>
      </Card>

      <QuestionAttachments
        attachedFiles={value.attachedFiles}
        onChange={(files) => onChange({ ...value, attachedFiles: files })}
      />
    </div>
  );
}
