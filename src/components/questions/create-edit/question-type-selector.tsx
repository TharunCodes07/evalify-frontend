"use client";

import { QuestionType } from "@/types/questions";
import { Button } from "@/components/ui/button";
import {
  CircleDot,
  FileInput,
  Network,
  FileText,
  ToggleLeft,
  Code,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionTypeSelectorProps {
  selectedType?: QuestionType;
  onSelect: (type: QuestionType) => void;
}

const questionTypes: {
  type: QuestionType;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    type: QuestionType.MCQ,
    label: "Multiple Choice",
    icon: <CircleDot className="h-4 w-4" />,
    description: "Single or multiple correct answers",
  },
  {
    type: QuestionType.TRUE_FALSE,
    label: "True or False",
    icon: <ToggleLeft className="h-4 w-4" />,
    description: "Binary choice question",
  },
  {
    type: QuestionType.FILL_IN_BLANKS,
    label: "Fill in Blanks",
    icon: <FileInput className="h-4 w-4" />,
    description: "Complete the sentence",
  },
  {
    type: QuestionType.MATCH_THE_FOLLOWING,
    label: "Match Following",
    icon: <Network className="h-4 w-4" />,
    description: "Connect related items",
  },
  {
    type: QuestionType.CODING,
    label: "Coding",
    icon: <Code className="h-4 w-4" />,
    description: "Programming challenge",
  },
  {
    type: QuestionType.FILE_UPLOAD,
    label: "File Upload",
    icon: <Upload className="h-4 w-4" />,
    description: "Submit a file",
  },
  {
    type: QuestionType.DESCRIPTIVE,
    label: "Descriptive",
    icon: <FileText className="h-4 w-4" />,
    description: "Long form answer",
  },
];

export default function QuestionTypeSelector({
  selectedType,
  onSelect,
}: QuestionTypeSelectorProps) {
  return (
    <div className="px-4 sm:px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-wrap items-center gap-2">
        {questionTypes.map(({ type, label, icon, description }) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(type)}
            className={cn(
              "whitespace-nowrap flex items-center gap-2 transition-all duration-200 hover:scale-105",
              selectedType === type && "shadow-md ring-2 ring-primary/20",
            )}
            title={description}
          >
            <span
              className={cn(
                "transition-colors",
                selectedType === type
                  ? "text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              {icon}
            </span>
            <span className="font-medium">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
