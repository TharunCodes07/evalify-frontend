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
    <div className="border-b bg-white dark:bg-gray-900 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Question Type Selection */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground">
              {isEdit ? "Edit Question" : "Create Question"}
            </h1>
            {!isEdit && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {getModeIcon()}
                {getModeText()}
              </Badge>
            )}
          </div>

          {/* Question Type Dropdown - Only show in create mode */}
          {!isEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {selectedTypeInfo && <selectedTypeInfo.icon className="h-4 w-4" />}
                  {selectedTypeInfo?.label || "Select Type"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                {questionTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.type}
                    onClick={() => onTypeSelect(type.type)}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <type.icon className="h-5 w-5 mt-0.5 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {type.description}
                      </div>
                    </div>
                    {selectedType === type.type && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Show selected type in edit mode */}
          {isEdit && selectedTypeInfo && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <selectedTypeInfo.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{selectedTypeInfo.label}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Preview Button */}
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

          {/* Save Buttons */}
          {isEdit ? (
            <Button
              onClick={onSave}
              disabled={isLoading || !hasChanges}
              size="sm"
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {getSaveButtonText()}
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              
              <Button
                onClick={onSaveAndAddNew}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Save & Add New
              </Button>
              <Button
                onClick={onSave}
                disabled={isLoading}
                size="sm"
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </Button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionTypeSelector;
