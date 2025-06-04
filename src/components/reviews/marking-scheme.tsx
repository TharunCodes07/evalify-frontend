"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Clock, Plus, Trash2 } from "lucide-react";

interface Rubric {
  criterion: string;
  description: string;
  maxScore: number;
}

interface RubricTemplate {
  id: string;
  name: string;
  rubrics: Rubric[];
  createdBy: string;
}

interface MarkingSchemeProps {
  selectedRubricTemplate: string;
  customRubrics: Rubric[];
  rubricTemplates: RubricTemplate[];
  onTemplateSelect: (templateId: string) => void;
  onRubricChange: (
    index: number,
    field: keyof Rubric,
    value: string | number
  ) => void;
  onAddRubric: () => void;
  onRemoveRubric: (index: number) => void;
}

export function MarkingScheme({
  selectedRubricTemplate,
  customRubrics,
  rubricTemplates,
  onTemplateSelect,
  onRubricChange,
  onAddRubric,
  onRemoveRubric,
}: MarkingSchemeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Marking Scheme
        </CardTitle>
        <CardDescription>
          Define the evaluation criteria and scoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Selection */}
        <div className="space-y-2">
          <Label>Use Existing Template (Optional)</Label>
          <Select
            value={selectedRubricTemplate}
            onValueChange={onTemplateSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template or create custom criteria" />
            </SelectTrigger>
            <SelectContent>
              {rubricTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Evaluation Criteria</Label>
            <Button
              type="button"
              onClick={onAddRubric}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Criterion
            </Button>
          </div>

          <div className="space-y-3">
            {customRubrics.map((rubric, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 border rounded-lg"
              >
                <div className="md:col-span-3">
                  <Label htmlFor={`criterion-${index}`} className="text-sm">
                    Criterion
                  </Label>
                  <Input
                    id={`criterion-${index}`}
                    value={rubric.criterion}
                    onChange={(e) =>
                      onRubricChange(index, "criterion", e.target.value)
                    }
                    placeholder="e.g., Content Knowledge"
                  />
                </div>
                <div className="md:col-span-6">
                  <Label htmlFor={`description-${index}`} className="text-sm">
                    Description
                  </Label>
                  <Input
                    id={`description-${index}`}
                    value={rubric.description}
                    onChange={(e) =>
                      onRubricChange(index, "description", e.target.value)
                    }
                    placeholder="Describe what this criterion evaluates"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`score-${index}`} className="text-sm">
                    Max Score
                  </Label>
                  <Input
                    id={`score-${index}`}
                    type="number"
                    min="1"
                    max="100"
                    value={rubric.maxScore}
                    onChange={(e) =>
                      onRubricChange(
                        index,
                        "maxScore",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button
                    type="button"
                    onClick={() => onRemoveRubric(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {customRubrics.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Total Points:{" "}
              {customRubrics.reduce((sum, rubric) => sum + rubric.maxScore, 0)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
