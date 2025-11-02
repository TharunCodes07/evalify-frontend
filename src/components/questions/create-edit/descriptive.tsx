"use client";

import { DescriptiveQuestion } from "@/types/questions";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FileText,
  BookOpen,
  Key,
  FileSignature,
  Plus,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import QuestionAttachments from "./question-attachments";

interface DescriptiveComponentProps {
  value: DescriptiveQuestion;
  onChange: (question: DescriptiveQuestion) => void;
}

export default function DescriptiveComponent({
  value,
  onChange,
}: DescriptiveComponentProps) {
  const handleQuestionChange = (content: string) => {
    onChange({ ...value, text: content });
  };

  const handleModelAnswerChange = (content: string) => {
    onChange({
      ...value,
      descriptiveConfig: {
        ...value.descriptiveConfig,
        modelAnswer: content,
      },
    });
  };

  const handleKeywordsChange = (keywords: string[]) => {
    onChange({
      ...value,
      descriptiveConfig: {
        ...value.descriptiveConfig,
        keywords,
      },
    });
  };

  const handleAddKeyword = () => {
    const currentKeywords = value.descriptiveConfig?.keywords || [];
    handleKeywordsChange([...currentKeywords, ""]);
  };

  const handleRemoveKeyword = (index: number) => {
    const currentKeywords = value.descriptiveConfig?.keywords || [];
    handleKeywordsChange(currentKeywords.filter((_, i) => i !== index));
  };

  const handleKeywordChange = (index: number, keyword: string) => {
    const currentKeywords = value.descriptiveConfig?.keywords || [];
    const updatedKeywords = [...currentKeywords];
    updatedKeywords[index] = keyword;
    handleKeywordsChange(updatedKeywords);
  };

  const handleMinWordsChange = (minWords: number) => {
    onChange({
      ...value,
      descriptiveConfig: {
        ...value.descriptiveConfig,
        minWords,
      },
    });
  };

  const handleMaxWordsChange = (maxWords: number) => {
    onChange({
      ...value,
      descriptiveConfig: {
        ...value.descriptiveConfig,
        maxWords,
      },
    });
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
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Model Answer (Optional)
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Provide a reference answer for grading purposes
          </p>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            initialContent={value.descriptiveConfig?.modelAnswer || ""}
            onUpdate={handleModelAnswerChange}
            className="min-h-[150px]"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Keywords (Optional)
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter keywords for automated grading assistance
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {(value.descriptiveConfig?.keywords || [""]).map((keyword, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Keyword ${index + 1}`}
                value={keyword}
                onChange={(e) => handleKeywordChange(index, e.target.value)}
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveKeyword(index)}
                disabled={
                  (value.descriptiveConfig?.keywords || []).length === 1
                }
                className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddKeyword}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Keyword
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-primary" />
            Word Limits (Optional)
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Set minimum and maximum word count for the answer
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minWords">Minimum Words</Label>
              <Input
                id="minWords"
                type="number"
                min="0"
                placeholder="e.g., 50"
                value={value.descriptiveConfig?.minWords || ""}
                onChange={(e) =>
                  handleMinWordsChange(parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxWords">Maximum Words</Label>
              <Input
                id="maxWords"
                type="number"
                min="0"
                placeholder="e.g., 500"
                value={value.descriptiveConfig?.maxWords || ""}
                onChange={(e) =>
                  handleMaxWordsChange(parseInt(e.target.value) || 0)
                }
              />
            </div>
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
