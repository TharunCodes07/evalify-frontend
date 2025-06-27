"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import QuestionTypeSelector, { QuestionType } from "./question-type-selector";
import QuestionEditor, { QuestionData } from "./question-editor";
import QuestionSettings from "./question-settings";
import ValidationErrorModal from "./validation-error-modal";
import { validateQuestionData, ValidationError } from "./validation";
import { useToast } from "@/hooks/use-toast";
import { questionsService } from "@/app/api/services/questions";
import Bank from "@/repo/bank/bank";
import { transformQuestionDataForAPI } from "./question-transformer";

interface QuestionCreationSettings {
  marks: number;
  difficulty: string;
  bloomsTaxonomy: string;
  courseOutcome: string;
  topics: { value: string; label: string }[];
}

type QuestionMode = "bank" | "quiz";

interface QuestionCreationPageProps {
  isEdit?: boolean;
  initialQuestionData?: QuestionData;
  initialQuestionSettings?: QuestionCreationSettings;
  questionId?: string;
  mode?: QuestionMode;
  bankId?: string;
  quizId?: string;
}

const QuestionCreationPage: React.FC<QuestionCreationPageProps> = ({
  isEdit = false,
  initialQuestionData,
  initialQuestionSettings,
  questionId,
  mode = "bank",
  bankId,
  quizId,
}) => {
  const router = useRouter();
  const { info, success, error } = useToast();

  // Initialize question type from initial data or default to "mcq"
  const [selectedType, setSelectedType] = React.useState<QuestionType>(
    initialQuestionData?.type || "mcq",
  );

  // Initialize question data from initial data or use defaults
  const [questionData, setQuestionData] = React.useState<QuestionData>(
    initialQuestionData || {
      type: "mcq",
      question: "",
      explanation: "",
      showExplanation: false,
      allowMultipleCorrect: false,
      options: [],
    },
  );

  // Initialize question settings from initial data or use defaults
  const [questionSettings, setQuestionSettings] =
    React.useState<QuestionCreationSettings>(
      initialQuestionSettings || {
        marks: 1,
        difficulty: "medium",
        bloomsTaxonomy: "",
        courseOutcome: "",
        topics: [],
      },
    );

  // Store initial state for change tracking
  const initialStateRef = React.useRef({
    type: selectedType,
    data: questionData,
    settings: questionSettings,
  });

  // Update initial state when props change
  React.useEffect(() => {
    if (isEdit && initialQuestionData && initialQuestionSettings) {
      const newInitialState = {
        type: initialQuestionData.type,
        data: initialQuestionData,
        settings: initialQuestionSettings,
      };
      initialStateRef.current = newInitialState;
      setSelectedType(initialQuestionData.type);
      setQuestionData(initialQuestionData);
      setQuestionSettings(initialQuestionSettings);
    }
  }, [isEdit, initialQuestionData, initialQuestionSettings]);

  // Track if there are changes
  const hasChanges = React.useMemo(() => {
    if (!isEdit) return false;

    const current = {
      type: selectedType,
      data: questionData,
      settings: questionSettings,
    };

    return JSON.stringify(current) !== JSON.stringify(initialStateRef.current);
  }, [isEdit, selectedType, questionData, questionSettings]);

  // Validation state
  const [validationErrors, setValidationErrors] = React.useState<
    ValidationError[]
  >([]);
  const [showValidationModal, setShowValidationModal] = React.useState(false);

  // Mutation for saving questions to bank
  const saveQuestionToBankMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!bankId) throw new Error("Bank ID is required");
      const transformedData = transformQuestionDataForAPI(questionData, questionSettings);
      return await Bank.addQuestionToBank(bankId, transformedData);
    },
    onSuccess: (response, variables, context) => {
      success("Question added to bank successfully!", {
        description: "Question has been saved to the question bank",
      });
    },
    onError: (err: any) => {
      console.error("Error saving question to bank:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save question to bank";
      error("Failed to save question", { description: errorMessage });
    },
  });

  // Mutation for updating questions
  const updateQuestionMutation = useMutation({
    mutationFn: async () => {
      if (!questionId) throw new Error("Question ID is required");
      return await questionsService.updateQuestion(questionId, {
        type: selectedType,
        data: questionData,
        settings: questionSettings,
      });
    },
    onSuccess: (response) => {
      success("Question updated successfully!", {
        description: `Question ID: ${response.id}`,
      });
      // Update initial state ref to reflect the new saved state
      initialStateRef.current = {
        type: selectedType,
        data: questionData,
        settings: questionSettings,
      };
    },
    onError: (err: any) => {
      console.error("Error updating question:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update question";
      error("Failed to update question", { description: errorMessage });
    },
  });

  const isLoading = saveQuestionToBankMutation.isPending || updateQuestionMutation.isPending;

  // Handle question type change
  const handleTypeSelect = (type: QuestionType) => {
    if (isEdit) {
      // In edit mode, don't allow type changes
      return;
    }
    setSelectedType(type);

    // Reset question data to default for the new type
    const baseData = {
      question: "",
      explanation: "",
      showExplanation: false,
    };

    let newQuestionData: QuestionData;

    switch (type) {
      case "mcq":
        newQuestionData = {
          ...baseData,
          type: "mcq",
          allowMultipleCorrect: false,
          options: [],
        };
        break;
      case "fillup":
        newQuestionData = {
          ...baseData,
          type: "fillup",
          blanks: [],
          strictMatch: false,
          useHybridEvaluation: false,
        };
        break;
      case "match-following":
        newQuestionData = {
          ...baseData,
          type: "match-following",
          matchItems: [],
        };
        break;
      case "descriptive":
        newQuestionData = {
          ...baseData,
          type: "descriptive",
          sampleAnswer: "",
          wordLimit: 500,
          gradingCriteria: "",
        };
        break;
      case "true-false":
        newQuestionData = {
          ...baseData,
          type: "true-false",
          correctAnswer: null,
        };
        break;
      case "coding":
        newQuestionData = {
          ...baseData,
          type: "coding",
          language: "",
          starterCode: "",
          testCases: [],
          timeLimit: 30,
          memoryLimit: 256,
          functionName: "",
        };
        break;
      case "file-upload":
        newQuestionData = {
          ...baseData,
          type: "file-upload",
          allowedFileTypes: [],
          maxFileSize: 10,
          maxFiles: 1,
        };
        break;
      default:
        newQuestionData = {
          ...baseData,
          type: "mcq",
          allowMultipleCorrect: false,
          options: [],
        };
    }

    setQuestionData(newQuestionData);
  };

  // Handle preview
  const handlePreview = () => {
    console.log("Preview question:", {
      type: selectedType,
      data: questionData,
      settings: questionSettings,
    });
    // Show info toast instead of alert
    info("Preview functionality will be implemented soon!");
  };

  const resetForm = () => {
    setSelectedType("mcq");
    setQuestionData({
      type: "mcq",
      question: "",
      explanation: "",
      showExplanation: false,
      allowMultipleCorrect: false,
      options: [],
    });
    setQuestionSettings({
      marks: 1,
      difficulty: "medium",
      bloomsTaxonomy: "",
      courseOutcome: "",
      topics: [],
    });
    setValidationErrors([]);
    setShowValidationModal(false);
  };
  // Validate and prepare data
  const validateAndPrepareData = () => {
    // Comprehensive validation using the validation system
    const validationResult = validateQuestionData(
      questionData,
      questionSettings.marks,
    );

    if (!validationResult.isValid) {
      setValidationErrors(validationResult.errors);
      setShowValidationModal(true);
      return false;
    }

    // Validate required IDs based on mode
    if (mode === "bank" && !bankId) {
      error("Bank ID is required for adding questions to bank");
      return false;
    }

    if (mode === "quiz" && !quizId) {
      error("Quiz ID is required for adding questions to quiz");
      return false;
    }

    return true;
  };

  // Handle save (redirect to bank after save)
  const handleSave = async () => {
    if (!validateAndPrepareData()) return;

    try {
      if (isEdit && questionId) {
        await updateQuestionMutation.mutateAsync();
      } else {
        if (mode === "bank" && bankId) {
          await saveQuestionToBankMutation.mutateAsync({});

          // Redirect to bank questions page after successful save
          router.push(`/question-bank/${bankId}`);
        } else if (mode === "quiz" && quizId) {
          // TODO: Implement quiz API call when available
          // For now, use the existing questionsService
          const response = await questionsService.createQuestion({
            type: selectedType,
            data: questionData,
            settings: questionSettings,
          });

          success("Question added to quiz successfully!", {
            description: `Question ID: ${response.id}`,
          });

          // Redirect to quiz questions page (when available)
          // router.push(`/quiz/${quizId}`);
        }
      }
    } catch (err) {
      // Error handling is done in the mutations
      console.error("Save operation failed:", err);
    }
  };

  // Handle save and add new (reset form for new question)
  const handleSaveAndAddNew = async () => {
    if (!validateAndPrepareData()) return;

    try {
      if (mode === "bank" && bankId) {
        await saveQuestionToBankMutation.mutateAsync({});

        // Reset form for new question
        resetForm();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (mode === "quiz" && quizId) {
        // TODO: Implement quiz API call when available
        const response = await questionsService.createQuestion({
          type: selectedType,
          data: questionData,
          settings: questionSettings,
        });

        success("Question added to quiz successfully!", {
          description: `Question ID: ${response.id}`,
        });

        // Reset form for new question
        resetForm();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      // Error handling is done in the mutations
      console.error("Save and add new operation failed:", err);
    }
  };

  // Handle validation modal close
  const handleValidationModalClose = () => {
    setShowValidationModal(false);
    setValidationErrors([]);
  };

  // Handle settings changes
  const handleMarksChange = (marks: number) => {
    setQuestionSettings((prev) => ({ ...prev, marks }));
  };
  const handleDifficultyChange = (difficulty: string) => {
    setQuestionSettings((prev) => ({ ...prev, difficulty }));
  };

  const handleBloomsTaxonomyChange = (bloomsTaxonomy: string) => {
    setQuestionSettings((prev) => ({ ...prev, bloomsTaxonomy }));
  };

  const handleCourseOutcomeChange = (courseOutcome: string) => {
    setQuestionSettings((prev) => ({ ...prev, courseOutcome }));
  };

  const handleTopicsChange = (topics: { value: string; label: string }[]) => {
    setQuestionSettings((prev) => ({ ...prev, topics }));
  };
  return (
    <div className="h-screen flex flex-col bg-background">
      <QuestionTypeSelector
        selectedType={selectedType}
        onTypeSelect={handleTypeSelect}
        onPreview={handlePreview}
        onSave={handleSave}
        onSaveAndAddNew={handleSaveAndAddNew}
        isLoading={isLoading}
        isEdit={isEdit}
        hasChanges={hasChanges}
        mode={mode}
      />
      {/* Main Content Area - Fixed Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel - Question Editor (fixed width) */}
        <div className="flex-1 min-w-0 p-6 overflow-auto bg-background">
          <QuestionEditor
            questionType={selectedType}
            questionData={questionData}
            onQuestionDataChange={setQuestionData}
          />
        </div>
        {/* Right Panel - Question Settings (fixed width) */}
        <div className="w-96 border-l overflow-hidden">
          <QuestionSettings
            marks={questionSettings.marks}
            difficulty={questionSettings.difficulty}
            bloomsTaxonomy={questionSettings.bloomsTaxonomy}
            courseOutcome={questionSettings.courseOutcome}
            topics={questionSettings.topics}
            onMarksChange={handleMarksChange}
            onDifficultyChange={handleDifficultyChange}
            onBloomsTaxonomyChange={handleBloomsTaxonomyChange}
            onCourseOutcomeChange={handleCourseOutcomeChange}
            onTopicsChange={handleTopicsChange}
          />
        </div>
      </div>
      {/* Validation Error Modal */}
      <ValidationErrorModal
        isOpen={showValidationModal}
        onClose={handleValidationModalClose}
        errors={validationErrors}
        questionType={selectedType}
      />
    </div>
  );
};

export default QuestionCreationPage;
