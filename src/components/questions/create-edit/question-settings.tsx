"use client";

import { useState } from "react";
import { BloomLevel, Difficulty, Question } from "@/types/questions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  X,
  Settings,
  Hash,
  BrainCircuit,
  Target,
  Tags,
  Gauge,
} from "lucide-react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import bankQueries from "@/repo/bank-queries/bank-queries";
import { useQuery } from "@tanstack/react-query";

interface QuestionSettingsProps {
  value: Question;
  onChange: (question: Question) => void;
  context: "bank" | "quiz";
  bankId?: string;
  hideExplanation?: boolean;
}

export default function QuestionSettings({
  value,
  onChange,
  context,
  bankId,
  hideExplanation = false,
}: QuestionSettingsProps) {
  const [newTopic, setNewTopic] = useState("");

  // Fetch bank topics if in bank context
  const { data: bankData } = useQuery({
    queryKey: ["bank", bankId],
    queryFn: () => bankQueries.getBankById(bankId!),
    enabled: context === "bank" && !!bankId,
  });

  const availableTopics =
    context === "bank" ? bankData?.topics || [] : undefined;

  const handleMarksChange = (marks: number) => {
    onChange({ ...value, marks });
  };

  const handleNegativeMarksChange = (negativeMarks: number) => {
    onChange({ ...value, negativeMarks });
  };

  const handleBloomLevelChange = (bloomLevel: BloomLevel) => {
    onChange({ ...value, bloomLevel });
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    onChange({ ...value, difficulty });
  };

  const handleCourseOutcomeChange = (courseOutcome: number | undefined) => {
    onChange({ ...value, courseOutcome });
  };

  const handleExplanationChange = (explanation: string) => {
    onChange({ ...value, explanation });
  };

  const handleAddTopic = (topic: string) => {
    if (!topic.trim()) return;

    const currentTopics = value.topics || [];
    if (!currentTopics.includes(topic.trim())) {
      onChange({
        ...value,
        topics: [...currentTopics, topic.trim()],
      });
    }
    setNewTopic("");
  };

  const handleRemoveTopic = (topic: string) => {
    onChange({
      ...value,
      topics: (value.topics || []).filter((t) => t !== topic),
    });
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Question Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        {/* Marks Section */}
        <div className="space-y-3">
          <Label
            htmlFor="marks"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Hash className="h-4 w-4 text-blue-500" />
            Marks *
          </Label>
          <InputNumber
            id="marks"
            min={0}
            step={0.5}
            placeholder="1"
            value={value.marks}
            defaultValue={1}
            onChange={(val) => handleMarksChange(val || 1)}
            required
          />
        </div>

        <div className="space-y-3">
          <Label
            htmlFor="negativeMarks"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Hash className="h-4 w-4 text-red-500" />
            Negative Marks
          </Label>
          <InputNumber
            id="negativeMarks"
            min={0}
            step={0.5}
            placeholder="0"
            value={value.negativeMarks}
            defaultValue={0}
            onChange={(val) => handleNegativeMarksChange(val || 0)}
          />
        </div>

        {/* Bloom's Taxonomy */}
        <div className="space-y-3">
          <Label
            htmlFor="bloomLevel"
            className="text-sm font-medium flex items-center gap-2"
          >
            <BrainCircuit className="h-4 w-4 text-purple-500" />
            Bloom&apos;s Taxonomy Level
          </Label>
          <Select
            value={value.bloomLevel}
            onValueChange={(val) => handleBloomLevelChange(val as BloomLevel)}
          >
            <SelectTrigger id="bloomLevel">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(BloomLevel).map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty Level */}
        <div className="space-y-3">
          <Label
            htmlFor="difficulty"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Gauge className="h-4 w-4 text-amber-500" />
            Difficulty Level
          </Label>
          <Select
            value={value.difficulty}
            onValueChange={(val) => handleDifficultyChange(val as Difficulty)}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Difficulty.EASY}>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Easy
                </span>
              </SelectItem>
              <SelectItem value={Difficulty.MEDIUM}>
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                  Medium
                </span>
              </SelectItem>
              <SelectItem value={Difficulty.HARD}>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  Hard
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Outcome */}
        <div className="space-y-3">
          <Label
            htmlFor="courseOutcome"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Target className="h-4 w-4 text-green-500" />
            Course Outcome (CO)
          </Label>
          <Select
            value={value.courseOutcome?.toString() || "none"}
            onValueChange={(val) =>
              handleCourseOutcomeChange(
                val === "none" ? undefined : parseInt(val),
              )
            }
          >
            <SelectTrigger id="courseOutcome">
              <SelectValue placeholder="Select CO" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {[1, 2, 3, 4, 5, 6].map((co) => (
                <SelectItem key={co} value={co.toString()}>
                  CO {co}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Topics Section */}
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <Tags className="h-4 w-4 text-orange-500" />
              Topics
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              {context === "bank"
                ? "Select from predefined bank topics"
                : "Add custom topics for this quiz question"}
            </p>
          </div>

          {/* For Bank: Show dropdown of predefined topics */}
          {context === "bank" && availableTopics && (
            <div className="space-y-2">
              <Select
                value="__placeholder__"
                onValueChange={(val) => {
                  if (val !== "__placeholder__") handleAddTopic(val);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select topic from bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__placeholder__" disabled>
                    Select a topic
                  </SelectItem>
                  {availableTopics
                    .filter(
                      (topic: string) => !(value.topics || []).includes(topic),
                    )
                    .map((topic: string) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* For Quiz: Show input to add custom topics */}
          {context === "quiz" && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter topic name"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTopic(newTopic);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => handleAddTopic(newTopic)}
                disabled={!newTopic.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          )}

          {/* Display selected topics */}
          {value.topics && value.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {value.topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="pl-2 pr-1">
                  {topic}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveTopic(topic)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Explanation Section - Only show if not hidden */}
        {!hideExplanation && (
          <div className="space-y-3">
            <Label htmlFor="explanation" className="text-sm font-medium">
              Explanation (Optional)
            </Label>
            <p className="text-xs text-muted-foreground">
              Provide an explanation that will be shown after the question is
              answered
            </p>
            <TiptapEditor
              initialContent={value.explanation || ""}
              onUpdate={handleExplanationChange}
              className="min-h-[150px]"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
