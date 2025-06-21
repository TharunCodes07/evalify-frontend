"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  CheckCircle,
  SquareCheck,
  Type,
  Edit3,
  Code,
  Link,
  Upload,
  Eye,
  Save,
  Plus,
  ChevronDown,
  Archive,
  Loader2,
} from "lucide-react";

export type QuestionType =
  | "mcq"
  | "true-false"
  | "fillup"
  | "descriptive"
  | "coding"
  | "match-following"
  | "file-upload";

interface QuestionTypeSelectorProps {
  selectedType: QuestionType;
  onTypeSelect: (type: QuestionType) => void;
  onPreview: () => void;
  onSave: () => void;
  onSaveAndAddNew: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
  hasChanges?: boolean;
  mode?: "bank" | "quiz";
}

const questionTypes = [
  {
    type: "mcq" as QuestionType,
    label: "Multiple Choice",
    icon: CheckCircle,
    description: "Single or multiple correct answers",
  },
  {
    type: "true-false" as QuestionType,
    label: "True/False",
    icon: SquareCheck,
    description: "Binary choice questions",
  },
  {
    type: "fillup" as QuestionType,
    label: "Fill in the Blanks",
    icon: Type,
    description: "Complete the missing parts",
  },
  {
    type: "descriptive" as QuestionType,
    label: "Descriptive",
    icon: Edit3,
    description: "Long-form text answers",
  },
  {
    type: "coding" as QuestionType,
    label: "Coding",
    icon: Code,
    description: "Programming challenges",
  },
  {
    type: "match-following" as QuestionType,
    label: "Match Following",
    icon: Link,
    description: "Connect related items",
  },
  {
    type: "file-upload" as QuestionType,
    label: "File Upload",
    icon: Upload,
    description: "Document submissions",
  },
];

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  onPreview,
  onSave,
  onSaveAndAddNew,
  isLoading = false,
  isEdit = false,
  hasChanges = false,
  mode = "bank",
}) => {
  const selectedTypeInfo = questionTypes.find((type) => type.type === selectedType);

  const getModeText = () => {
    return mode === "bank" ? "Add to Bank" : "Add to Quiz";
  };

  const getModeIcon = () => {
    return mode === "bank" ? <Archive className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  const getSaveButtonText = () => {
    if (isEdit) {
      return hasChanges ? "Update Question" : "No Changes";
    }
    return "Save Question";
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
      {/* Left side - Question types */}
      <div className="flex flex-wrap gap-2">
        {questionTypes.map(({ type, label, icon }) => (
          <Button
            onClick={onPreview}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        ))}
      </div>
      {/* Right side - Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onPreview}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button
          onClick={onSave}
          disabled={isLoading || (isEdit && !hasChanges)}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isLoading
            ? isEdit
              ? "Updating..."
              : "Saving..."
            : isEdit
              ? "Update Question"
              : "Save Question"}
        </Button>
      </div>
    </div>
  );
};

export default QuestionTypeSelector;
