"use client";

import {
  FillInBlanksQuestion,
  FillInBlanksEvaluationType,
} from "@/types/questions";
import { useEffect, useState, useRef } from "react";
import {
  TiptapEditor,
  TiptapEditorRef,
} from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ListOrdered, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionAttachments from "./question-attachments";

interface FillInBlanksComponentProps {
  value: FillInBlanksQuestion;
  onChange: (question: FillInBlanksQuestion) => void;
}

const BLANK_REGEX = /_{3,}/g;

export default function FillInBlanksComponent({
  value,
  onChange,
}: FillInBlanksComponentProps) {
  const [detectedBlanks, setDetectedBlanks] = useState<number>(0);
  const editorRef = useRef<TiptapEditorRef>(null);

  // Calculate total weight
  const totalWeight = Object.values(
    value.blankConfig?.blankWeights || {},
  ).reduce((sum, weight) => sum + (weight || 0), 0);
  const isWeightValid = totalWeight === value.marks;

  useEffect(() => {
    const blanks = (value.text || "").match(BLANK_REGEX);
    const blankCount = blanks ? blanks.length : 0;
    setDetectedBlanks(blankCount);

    // Check if blankConfig exists before accessing properties
    if (!value.blankConfig || blankCount !== value.blankConfig.blankCount) {
      const newAcceptableAnswers: Record<number, string[]> = {};
      const newBlankWeights: Record<number, number> = {};

      for (let i = 0; i < blankCount; i++) {
        newAcceptableAnswers[i] = value.blankConfig?.acceptableAnswers?.[i] || [
          "",
        ];
        newBlankWeights[i] = value.blankConfig?.blankWeights?.[i] || 1;
      }

      onChange({
        ...value,
        blankConfig: {
          blankCount,
          acceptableAnswers: newAcceptableAnswers,
          blankWeights: newBlankWeights,
          evaluationType:
            value.blankConfig?.evaluationType ||
            FillInBlanksEvaluationType.NORMAL,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.text]);

  const handleQuestionChange = (content: string) => {
    onChange({ ...value, text: content });
  };

  const handleAddAnswer = (blankIndex: number) => {
    const currentAnswers =
      value.blankConfig.acceptableAnswers[blankIndex] || [];
    onChange({
      ...value,
      blankConfig: {
        ...value.blankConfig,
        acceptableAnswers: {
          ...value.blankConfig.acceptableAnswers,
          [blankIndex]: [...currentAnswers, ""],
        },
      },
    });
  };

  const handleRemoveAnswer = (blankIndex: number, answerIndex: number) => {
    const currentAnswers =
      value.blankConfig.acceptableAnswers[blankIndex] || [];
    onChange({
      ...value,
      blankConfig: {
        ...value.blankConfig,
        acceptableAnswers: {
          ...value.blankConfig.acceptableAnswers,
          [blankIndex]: currentAnswers.filter((_, i) => i !== answerIndex),
        },
      },
    });
  };

  const handleAnswerChange = (
    blankIndex: number,
    answerIndex: number,
    answer: string,
  ) => {
    const currentAnswers =
      value.blankConfig.acceptableAnswers[blankIndex] || [];
    const newAnswers = [...currentAnswers];
    newAnswers[answerIndex] = answer;
    onChange({
      ...value,
      blankConfig: {
        ...value.blankConfig,
        acceptableAnswers: {
          ...value.blankConfig.acceptableAnswers,
          [blankIndex]: newAnswers,
        },
      },
    });
  };

  const handleWeightChange = (blankIndex: number, weight: number) => {
    onChange({
      ...value,
      blankConfig: {
        ...value.blankConfig,
        blankWeights: {
          ...value.blankConfig.blankWeights,
          [blankIndex]: weight,
        },
      },
    });
  };

  const handleEvaluationTypeChange = (
    evaluationType: FillInBlanksEvaluationType,
  ) => {
    onChange({
      ...value,
      blankConfig: {
        ...value.blankConfig,
        evaluationType,
      },
    });
  };

  const handleInsertBlank = () => {
    if (editorRef.current?.editor) {
      editorRef.current.editor.commands.insertContent("___");
      editorRef.current.editor.commands.focus();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Question
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Use three or more underscores (___) to create blanks in your
                question text
              </p>
            </div>
            <Button onClick={handleInsertBlank} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Insert Blank
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TiptapEditor
            ref={editorRef}
            initialContent={value.text || ""}
            onUpdate={handleQuestionChange}
            className="min-h-[200px]"
          />
          <div className="mt-4 text-sm">
            <span className="font-medium">Detected Blanks:</span>{" "}
            <span className="text-primary font-semibold">{detectedBlanks}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evaluation Settings</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Choose how student answers will be evaluated
          </p>
        </CardHeader>
        <CardContent>
          <Tabs
            value={
              value.blankConfig?.evaluationType ||
              FillInBlanksEvaluationType.NORMAL
            }
            onValueChange={(val) =>
              handleEvaluationTypeChange(val as FillInBlanksEvaluationType)
            }
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value={FillInBlanksEvaluationType.STRICT}>
                Strict
              </TabsTrigger>
              <TabsTrigger value={FillInBlanksEvaluationType.NORMAL}>
                Normal
              </TabsTrigger>
              <TabsTrigger value={FillInBlanksEvaluationType.HYBRID}>
                Hybrid
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value={FillInBlanksEvaluationType.STRICT}
              className="mt-4"
            >
              <div className="p-4 bg-muted/50 rounded-md">
                <h4 className="font-medium mb-2">Strict Evaluation</h4>
                <p className="text-sm text-muted-foreground">
                  Case-sensitive matching with spaces stripped. Student answer
                  must exactly match one of the acceptable answers (case
                  matters).
                </p>
              </div>
            </TabsContent>
            <TabsContent
              value={FillInBlanksEvaluationType.NORMAL}
              className="mt-4"
            >
              <div className="p-4 bg-muted/50 rounded-md">
                <h4 className="font-medium mb-2">Normal Evaluation</h4>
                <p className="text-sm text-muted-foreground">
                  Case-insensitive matching with spaces stripped. Student answer
                  must match one of the acceptable answers (case doesn&apos;t
                  matter).
                </p>
              </div>
            </TabsContent>
            <TabsContent
              value={FillInBlanksEvaluationType.HYBRID}
              className="mt-4"
            >
              <div className="p-4 bg-muted/50 rounded-md">
                <h4 className="font-medium mb-2">Hybrid Evaluation (LLM)</h4>
                <p className="text-sm text-muted-foreground">
                  Uses AI-powered evaluation to assess semantic similarity
                  between student answers and acceptable answers. More flexible
                  but requires LLM processing.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {detectedBlanks > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-primary" />
              Blank Answers
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Define acceptable answers for each blank
            </p>
            {!isWeightValid && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Total weight ({totalWeight}) must equal total marks (
                  {value.marks})
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: detectedBlanks }).map((_, blankIndex) => (
              <div
                key={blankIndex}
                className="p-4 border rounded-lg space-y-4 bg-muted/20"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Blank {blankIndex + 1}</h4>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`weight-${blankIndex}`} className="text-sm">
                      Weight:
                    </Label>
                    <InputNumber
                      id={`weight-${blankIndex}`}
                      min={0}
                      step={0.1}
                      value={value.blankConfig.blankWeights[blankIndex]}
                      defaultValue={1}
                      onChange={(val) =>
                        handleWeightChange(blankIndex, val || 1)
                      }
                      placeholder="1"
                      className="w-20 h-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {(
                    value.blankConfig.acceptableAnswers[blankIndex] || [""]
                  ).map((answer, answerIndex) => (
                    <div key={answerIndex} className="flex gap-2">
                      <Input
                        placeholder={`Answer ${answerIndex + 1}`}
                        value={answer}
                        onChange={(e) =>
                          handleAnswerChange(
                            blankIndex,
                            answerIndex,
                            e.target.value,
                          )
                        }
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleRemoveAnswer(blankIndex, answerIndex)
                        }
                        disabled={
                          (
                            value.blankConfig.acceptableAnswers[blankIndex] ||
                            []
                          ).length === 1
                        }
                        className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddAnswer(blankIndex)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Alternative Answer
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <QuestionAttachments
        attachedFiles={value.attachedFiles}
        onChange={(files) => onChange({ ...value, attachedFiles: files })}
      />
    </div>
  );
}
