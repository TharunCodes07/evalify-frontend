"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Question, QuestionType } from "@/types/questions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import questionQueries from "@/repo/question-queries/question-queries";
import {
  BankQuestionResponse,
  CreateBankQuestionRequest,
  UpdateBankQuestionRequest,
} from "@/types/bank";
import {
  QuizQuestionResponse,
  CreateQuizQuestionRequest,
  UpdateQuizQuestionRequest,
} from "@/types/quiz";
import QuestionTypeSelector from "./question-type-selector";
import QuestionSettings from "./question-settings";
import {
  getQuestionComponent,
  createDefaultQuestion,
} from "../question-factory";
import { validateQuestion } from "../question-validator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TiptapEditor } from "@/components/rich-text-editor/editor";

interface QuestionCreationProps {
  context: "bank" | "quiz";
  contextId: string;
  editingQuestion?: BankQuestionResponse | QuizQuestionResponse | null;
  onSave?: (question: BankQuestionResponse | QuizQuestionResponse) => void;
  onCancel?: () => void;
}

export default function QuestionCreation({
  context,
  contextId,
  editingQuestion,
  onSave,
}: QuestionCreationProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<QuestionType>(
    editingQuestion?.questionType || QuestionType.MCQ,
  );
  const [question, setQuestion] = useState<Question | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saveAndBack, setSaveAndBack] = useState(false);

  const queryClient = useQueryClient();
  const { success, error } = useToast();

  useEffect(() => {
    if (editingQuestion) {
      const transformedQuestion = { ...editingQuestion } as Question;

      setQuestion(transformedQuestion);
      setSelectedType(editingQuestion.questionType);
    } else {
      // When changing question type, preserve text, explanation, and settings
      const currentText = question?.text || "";
      const currentExplanation = question?.explanation || "";
      const currentMarks = question?.marks || 1;
      const currentNegativeMarks = question?.negativeMarks || 0;
      const currentTopics = question?.topics || [];
      const currentBloomLevel = question?.bloomLevel;
      const currentCourseOutcome = question?.courseOutcome;
      const currentAttachedFiles = question?.attachedFiles || [];

      const newQuestion = createDefaultQuestion(selectedType);
      setQuestion({
        ...newQuestion,
        text: currentText,
        explanation: currentExplanation,
        marks: currentMarks,
        negativeMarks: currentNegativeMarks,
        topics: currentTopics,
        bloomLevel: currentBloomLevel,
        courseOutcome: currentCourseOutcome,
        attachedFiles: currentAttachedFiles,
      });
    }
  }, [editingQuestion, selectedType]);

  const validateQuestionData = (): boolean => {
    if (!question) {
      setValidationErrors(["Question data is missing"]);
      return false;
    }

    const result = validateQuestion(question);
    setValidationErrors(result.errors.map((e) => e.message));
    return result.isValid;
  };

  const createMutation = useMutation({
    mutationFn: async (questionData: Question) => {
      const requestData: Partial<
        CreateBankQuestionRequest | CreateQuizQuestionRequest
      > = {
        questionType: questionData.questionType,
        text: questionData.text,
        explanation: questionData.explanation,
        marks: questionData.marks,
        negativeMarks: questionData.negativeMarks,
        topics: questionData.topics || [],
        bloomLevel: questionData.bloomLevel,
        courseOutcome: questionData.courseOutcome,
        attachedFiles: questionData.attachedFiles,
      };

      switch (questionData.questionType) {
        case QuestionType.MCQ:
        case QuestionType.MMCQ:
          if ("options" in questionData) {
            requestData.options = questionData.options.map((opt) => ({
              optionText: opt.optionText,
              orderIndex: opt.orderIndex,
              isCorrect: opt.isCorrect,
              marksWeightage: opt.marksWeightage,
            }));
          }
          break;

        case QuestionType.TRUE_FALSE:
          if ("trueFalseAnswer" in questionData) {
            requestData.trueFalseAnswer = Boolean(questionData.trueFalseAnswer);
          }
          break;

        case QuestionType.FILL_IN_BLANKS:
          if ("blankConfig" in questionData) {
            requestData.blankConfig = {
              blankCount: questionData.blankConfig.blankCount,
              acceptableAnswers: questionData.blankConfig.acceptableAnswers,
              blankWeights: questionData.blankConfig.blankWeights,
              evaluationType: questionData.blankConfig.evaluationType,
            };
          }
          break;

        case QuestionType.MATCH_THE_FOLLOWING:
          if ("options" in questionData) {
            requestData.options = questionData.options.map((opt) => ({
              optionText: opt.optionText,
              orderIndex: opt.orderIndex,
              isCorrect: opt.isCorrect,
              matchPairIds: opt.matchPairIds,
            }));
          }
          break;

        case QuestionType.DESCRIPTIVE:
          if ("descriptiveConfig" in questionData) {
            requestData.descriptiveConfig = {
              modelAnswer: questionData.descriptiveConfig.modelAnswer,
              keywords: questionData.descriptiveConfig.keywords,
              minWords: questionData.descriptiveConfig.minWords,
              maxWords: questionData.descriptiveConfig.maxWords,
            };
          }
          break;

        case QuestionType.CODING:
          if ("codingConfig" in questionData && "testCases" in questionData) {
            requestData.codingConfig = {
              language: questionData.codingConfig.language,
              templateCode: questionData.codingConfig.templateCode,
              boilerplateCode: questionData.codingConfig.boilerplateCode,
              referenceSolution: questionData.codingConfig.referenceSolution,
              timeLimitMs: questionData.codingConfig.timeLimitMs || 10000,
              memoryLimitMb:
                questionData.codingConfig.memoryLimitMb || undefined,
            };
            requestData.testCases = questionData.testCases.map((tc) => ({
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              visibility: tc.visibility,
              marksWeightage: tc.marksWeightage,
              orderIndex: tc.orderIndex,
              generatedFromSolution: tc.generatedFromSolution,
              floatTolerance: tc.floatTolerance,
              checker: tc.checker,
            }));
          }
          break;

        case QuestionType.FILE_UPLOAD:
          if (questionData.fileUploadConfig) {
            requestData.fileUploadConfig = {
              allowedFileTypes: questionData.fileUploadConfig.allowedFileTypes,
              maxFileSize: questionData.fileUploadConfig.maxFileSize,
            };
          }
          break;
      }

      if (context === "bank") {
        return questionQueries.bank.createQuestion(
          contextId,
          requestData as CreateBankQuestionRequest,
        );
      } else {
        (requestData as CreateQuizQuestionRequest).orderIndex = 0;
        return questionQueries.quiz.createQuestion(
          contextId,
          requestData as CreateQuizQuestionRequest,
        );
      }
    },
    onSuccess: (data) => {
      success("Question created successfully!");
      queryClient.invalidateQueries({
        queryKey: [context, contextId, "questions"],
      });
      queryClient.invalidateQueries({
        queryKey: [`${context}-questions`, contextId],
      });

      if (saveAndBack) {
        router.push(`/${context}/${contextId}`);
      } else if (onSave) {
        onSave(data);
      }
    },
    onError: (err: Error) => {
      error(err.message || "Failed to create question");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (questionData: Question & { id: string }) => {
      const requestData: Partial<
        UpdateBankQuestionRequest | UpdateQuizQuestionRequest
      > = {
        questionType: questionData.questionType,
        text: questionData.text,
        explanation: questionData.explanation,
        marks: questionData.marks,
        negativeMarks: questionData.negativeMarks,
        topics: questionData.topics || [],
        bloomLevel: questionData.bloomLevel,
        courseOutcome: questionData.courseOutcome,
        attachedFiles: questionData.attachedFiles,
      };

      // Include question type specific configurations
      switch (questionData.questionType) {
        case QuestionType.MCQ:
        case QuestionType.MMCQ:
          if ("options" in questionData) {
            requestData.options = questionData.options.map((opt) => ({
              optionText: opt.optionText,
              orderIndex: opt.orderIndex,
              isCorrect: opt.isCorrect,
              marksWeightage: opt.marksWeightage,
            }));
          }
          break;

        case QuestionType.TRUE_FALSE:
          if ("trueFalseAnswer" in questionData) {
            requestData.trueFalseAnswer = Boolean(questionData.trueFalseAnswer);
          }
          break;

        case QuestionType.FILL_IN_BLANKS:
          if ("blankConfig" in questionData) {
            requestData.blankConfig = {
              blankCount: questionData.blankConfig.blankCount,
              acceptableAnswers: questionData.blankConfig.acceptableAnswers,
              blankWeights: questionData.blankConfig.blankWeights,
              evaluationType: questionData.blankConfig.evaluationType,
            };
          }
          break;

        case QuestionType.MATCH_THE_FOLLOWING:
          if ("options" in questionData) {
            requestData.options = questionData.options.map((opt) => ({
              optionText: opt.optionText,
              orderIndex: opt.orderIndex,
              isCorrect: opt.isCorrect,
              matchPairIds: opt.matchPairIds,
            }));
          }
          break;

        case QuestionType.DESCRIPTIVE:
          if ("descriptiveConfig" in questionData) {
            requestData.descriptiveConfig = {
              modelAnswer: questionData.descriptiveConfig.modelAnswer,
              keywords: questionData.descriptiveConfig.keywords,
              minWords: questionData.descriptiveConfig.minWords,
              maxWords: questionData.descriptiveConfig.maxWords,
            };
          }
          break;

        case QuestionType.CODING:
          if ("codingConfig" in questionData && "testCases" in questionData) {
            requestData.codingConfig = {
              language: questionData.codingConfig.language,
              templateCode: questionData.codingConfig.templateCode,
              boilerplateCode: questionData.codingConfig.boilerplateCode,
              referenceSolution: questionData.codingConfig.referenceSolution,
              timeLimitMs: questionData.codingConfig.timeLimitMs || 10000,
              memoryLimitMb:
                questionData.codingConfig.memoryLimitMb || undefined,
            };
            requestData.testCases = questionData.testCases.map((tc) => ({
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              visibility: tc.visibility,
              marksWeightage: tc.marksWeightage,
              orderIndex: tc.orderIndex,
              generatedFromSolution: tc.generatedFromSolution,
              floatTolerance: tc.floatTolerance,
              checker: tc.checker,
            }));
          }
          break;

        case QuestionType.FILE_UPLOAD:
          if (questionData.fileUploadConfig) {
            requestData.fileUploadConfig = {
              allowedFileTypes: questionData.fileUploadConfig.allowedFileTypes,
              maxFileSize: questionData.fileUploadConfig.maxFileSize,
            };
          }
          break;
      }

      if (context === "bank") {
        return questionQueries.bank.updateQuestion(
          contextId,
          questionData.id,
          requestData as UpdateBankQuestionRequest,
        );
      } else {
        const quizQuestion = editingQuestion as QuizQuestionResponse;
        (requestData as UpdateQuizQuestionRequest).orderIndex =
          quizQuestion?.orderIndex || 0;
        return questionQueries.quiz.updateQuestion(
          contextId,
          questionData.id,
          requestData as UpdateQuizQuestionRequest,
        );
      }
    },
    onSuccess: (data) => {
      success("Question updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [context, contextId, "questions"],
      });
      if (onSave) {
        onSave(data);
      }
    },
    onError: (err: Error) => {
      error(err.message || "Failed to update question");
    },
  });

  const handleSave = (andBack = false) => {
    if (!validateQuestionData() || !question) {
      return;
    }

    setSaveAndBack(andBack);

    if (editingQuestion) {
      updateMutation.mutate({
        ...question,
        id: editingQuestion.id,
      } as Question & { id: string });
    } else {
      createMutation.mutate(question);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const QuestionComponent = selectedType
    ? getQuestionComponent(selectedType)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background">
        <QuestionTypeSelector
          selectedType={selectedType}
          onSelect={setSelectedType}
        />
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-6 lg:pr-0">
          {validationErrors.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {QuestionComponent && question && (
            <QuestionComponent value={question} onChange={setQuestion} />
          )}

          {/* Explanation Section - Moved to Bottom of Main Content */}
          {question && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Explanation (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Provide an explanation that will be shown after the question
                  is answered
                </p>
                <TiptapEditor
                  initialContent={question.explanation || ""}
                  onUpdate={(content) =>
                    setQuestion({ ...question, explanation: content })
                  }
                  className="min-h-[150px]"
                />
              </CardContent>
            </Card>
          )}

          <Card className="p-4 mt-6">
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                onClick={() => handleSave(false)}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading
                  ? "Saving..."
                  : editingQuestion
                    ? "Update Question"
                    : "Create Question"}
              </Button>
              {!editingQuestion && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleSave(true)}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create & Back
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="w-full lg:w-96 ">
          <div className="lg:sticky lg:top-[73px] p-6">
            <Card>
              <CardContent>
                <QuestionSettings
                  value={question || createDefaultQuestion(selectedType)}
                  onChange={setQuestion}
                  context={context}
                  bankId={context === "bank" ? contextId : undefined}
                  hideExplanation={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
