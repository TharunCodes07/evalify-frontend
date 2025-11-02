"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Edit2 } from "lucide-react";

interface MarksEditorProps {
  currentMarks?: number;
  maxMarks: number;
  onSave: (marks: number) => void;
}

export function MarksEditor({
  currentMarks,
  maxMarks,
  onSave,
}: MarksEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [marks, setMarks] = useState(currentMarks?.toString() || "0");

  const handleSave = () => {
    const numMarks = parseFloat(marks);
    if (isNaN(numMarks) || numMarks < 0 || numMarks > maxMarks) {
      return;
    }
    onSave(numMarks);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setMarks(currentMarks?.toString() || "0");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Marks Awarded:</span>
        <span className="font-semibold">
          {currentMarks ?? 0} / {maxMarks}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="h-7 px-2"
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Marks:</span>
      <Input
        type="number"
        min="0"
        max={maxMarks}
        step="0.5"
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
        className="h-8 w-20"
      />
      <span className="text-sm text-muted-foreground">/ {maxMarks}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSave}
        className="h-7 px-2"
      >
        <Check className="h-4 w-4 text-green-600" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCancel}
        className="h-7 px-2"
      >
        <X className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
