"use client";

import { MatchTheFollowingQuestion, QuestionOption } from "@/types/questions";
import { useState, useRef } from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  GripVertical,
  Plus,
  Trash2,
  Save,
  X,
  Edit3,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import QuestionAttachments from "./question-attachments";
import { useToast } from "@/hooks/use-toast";

interface MatchTheFollowingComponentProps {
  value: MatchTheFollowingQuestion;
  onChange: (question: MatchTheFollowingQuestion) => void;
}

interface DragItem {
  type: "left" | "right";
  id: string;
  index: number;
}

export default function MatchTheFollowingComponent({
  value,
  onChange,
}: MatchTheFollowingComponentProps) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const [editingLeftItemId, setEditingLeftItemId] = useState<string | null>(
    null,
  );
  const [editingRightItemId, setEditingRightItemId] = useState<string | null>(
    null,
  );
  const [isCreatingNewLeftItem, setIsCreatingNewLeftItem] = useState(false);
  const [isCreatingNewRightItem, setIsCreatingNewRightItem] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const dragCounter = useRef(0);
  const { success } = useToast();

  const rightItems = (value.options || []).filter((opt) =>
    opt.matchPairIds?.includes(opt.id),
  );

  const leftItems = (value.options || []).filter(
    (opt) => !opt.matchPairIds?.includes(opt.id),
  );

  const handleQuestionChange = (content: string) => {
    onChange({ ...value, text: content });
  };

  const generateId = () => crypto.randomUUID();

  const addLeftItem = () => {
    setIsCreatingNewLeftItem(true);
    setIsCreatingNewRightItem(false);
    setEditingLeftItemId(null);
    setEditingRightItemId(null);
    setEditorContent("");
  };

  const addRightItem = () => {
    setIsCreatingNewRightItem(true);
    setIsCreatingNewLeftItem(false);
    setEditingLeftItemId(null);
    setEditingRightItemId(null);
    setEditorContent("");
  };

  const handleSaveItem = () => {
    if (!editorContent.trim()) return;

    if (isCreatingNewLeftItem) {
      const newOption: QuestionOption = {
        id: generateId(),
        optionText: editorContent,
        orderIndex: leftItems.length,
        isCorrect: false,
      };
      onChange({
        ...value,
        options: [...(value.options || []), newOption],
      });
      setIsCreatingNewLeftItem(false);
    } else if (isCreatingNewRightItem) {
      const newId = generateId();
      const newOption: QuestionOption = {
        id: newId,
        optionText: editorContent,
        orderIndex: rightItems.length,
        isCorrect: false,
        matchPairIds: [newId],
      };
      onChange({
        ...value,
        options: [...(value.options || []), newOption],
      });
      setIsCreatingNewRightItem(false);
    } else if (editingLeftItemId) {
      onChange({
        ...value,
        options: (value.options || []).map((opt) =>
          opt.id === editingLeftItemId
            ? { ...opt, optionText: editorContent }
            : opt,
        ),
      });
      setEditingLeftItemId(null);
    } else if (editingRightItemId) {
      onChange({
        ...value,
        options: (value.options || []).map((opt) =>
          opt.id === editingRightItemId
            ? { ...opt, optionText: editorContent }
            : opt,
        ),
      });
      setEditingRightItemId(null);
    }

    setEditorContent("");
  };

  const handleCancelEdit = () => {
    setIsCreatingNewLeftItem(false);
    setIsCreatingNewRightItem(false);
    setEditingLeftItemId(null);
    setEditingRightItemId(null);
    setEditorContent("");
  };

  const handleEditLeftItem = (id: string) => {
    const item = leftItems.find((k) => k.id === id);
    if (item) {
      setEditingLeftItemId(id);
      setEditorContent(item.optionText);
      setEditingRightItemId(null);
      setIsCreatingNewLeftItem(false);
      setIsCreatingNewRightItem(false);
    }
  };

  const handleEditRightItem = (id: string) => {
    const item = rightItems.find((v) => v.id === id);
    if (item) {
      setEditingRightItemId(id);
      setEditorContent(item.optionText);
      setEditingLeftItemId(null);
      setIsCreatingNewLeftItem(false);
      setIsCreatingNewRightItem(false);
    }
  };

  const removeLeftItem = (id: string) => {
    // Remove the left item completely
    onChange({
      ...value,
      options: (value.options || []).filter((opt) => opt.id !== id),
    });
  };

  const removeRightItem = (id: string) => {
    onChange({
      ...value,
      options: (value.options || [])
        .filter((opt) => opt.id !== id)
        .map((opt) => {
          if (opt.matchPairIds?.includes(id)) {
            const updatedMatches = opt.matchPairIds.filter(
              (matchId) => matchId !== id,
            );
            return {
              ...opt,
              isCorrect: updatedMatches.length > 0,
              matchPairIds:
                updatedMatches.length > 0 ? updatedMatches : undefined,
            };
          }
          return opt;
        }),
    });
  };

  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
    dragCounter.current = 0;
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverTarget(targetId);
  };

  const handleDragEnter = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverTarget(targetId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverTarget(null);

    if (!draggedItem) return;

    if (draggedItem.type === "right") {
      const rightItemId = draggedItem.id;

      onChange({
        ...value,
        options: (value.options || []).map((opt) => {
          if (opt.id === targetId) {
            const existingMatches = opt.matchPairIds || [];
            if (existingMatches.includes(rightItemId)) {
              return opt;
            }
            return {
              ...opt,
              isCorrect: true,
              matchPairIds: [...existingMatches, rightItemId],
            };
          }
          return opt;
        }),
      });

      success("Match created");
    }

    setDraggedItem(null);
  };

  const removeMatch = (leftId: string, rightIdToRemove?: string) => {
    onChange({
      ...value,
      options: (value.options || []).map((opt) => {
        if (opt.id === leftId) {
          if (rightIdToRemove) {
            const updatedMatches = (opt.matchPairIds || []).filter(
              (id) => id !== rightIdToRemove,
            );
            return {
              ...opt,
              isCorrect: updatedMatches.length > 0,
              matchPairIds:
                updatedMatches.length > 0 ? updatedMatches : undefined,
            };
          }
          return { ...opt, isCorrect: false, matchPairIds: undefined };
        }
        return opt;
      }),
    });
  };

  const getMatchedRightItems = (leftId: string): QuestionOption[] => {
    const leftItem = leftItems.find((l) => l.id === leftId);
    if (!leftItem || !leftItem.matchPairIds) return [];

    return rightItems.filter((r) => leftItem.matchPairIds?.includes(r.id));
  };

  const isRightItemUsed = (rightItemId: string): boolean => {
    return leftItems.some((left) => left.matchPairIds?.includes(rightItemId));
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Items Column */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-primary" />
                Left Items
              </CardTitle>
              <Button onClick={addLeftItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {leftItems.map((item, index) => {
              const matchedRights = getMatchedRightItems(item.id);

              return (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 ${
                    dragOverTarget === item.id && draggedItem?.type === "right"
                      ? "border-primary border-2 bg-primary/10"
                      : ""
                  }`}
                  onDragOver={(e) => handleDragOver(e, item.id)}
                  onDragEnter={(e) => handleDragEnter(e, item.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, item.id)}
                >
                  {editingLeftItemId === item.id ? (
                    <div className="space-y-2">
                      <div className="flex items-start justify-between mb-3">
                        <Label className="text-sm font-medium">
                          Edit Left Item {index + 1}
                        </Label>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleSaveItem}
                            disabled={!editorContent.trim()}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <TiptapEditor
                        key={`edit-left-${item.id}`}
                        initialContent={editorContent}
                        onUpdate={setEditorContent}
                        className="min-h-20"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <Label className="text-sm font-medium">
                          Left Item {index + 1}
                        </Label>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditLeftItem(item.id)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeLeftItem(item.id)}
                            className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div
                        className="prose prose-sm dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: item.optionText }}
                      />
                      {matchedRights.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            Matched with:
                          </Label>
                          <div className="space-y-2">
                            {matchedRights.map((matchedRight) => (
                              <div
                                key={matchedRight.id}
                                className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded"
                              >
                                <div
                                  className="prose prose-xs dark:prose-invert flex-1"
                                  dangerouslySetInnerHTML={{
                                    __html: matchedRight.optionText,
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    removeMatch(item.id, matchedRight.id)
                                  }
                                  className="ml-2"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}

            {isCreatingNewLeftItem && (
              <div className="border-2 border-dashed rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <Label className="text-sm font-medium">
                    Left Item {leftItems.length + 1}
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveItem}
                      disabled={!editorContent.trim()}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <TiptapEditor
                  key="create-left"
                  initialContent=""
                  onUpdate={setEditorContent}
                  className="min-h-[80px]"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Items Column */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-primary" />
                Right Items
              </CardTitle>
              <Button onClick={addRightItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {rightItems.map((item, index) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 cursor-move ${
                  isRightItemUsed(item.id)
                    ? "bg-green-50 dark:bg-green-950/20 border-green-500"
                    : "hover:border-primary"
                }`}
                draggable
                onDragStart={(e) =>
                  handleDragStart(e, { type: "right", id: item.id, index })
                }
              >
                {editingRightItemId === item.id ? (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between mb-3">
                      <Label className="text-sm font-medium">
                        Edit Right Item {index + 1}
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveItem}
                          disabled={!editorContent.trim()}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <TiptapEditor
                      key={`edit-right-${item.id}`}
                      initialContent={editorContent}
                      onUpdate={setEditorContent}
                      className="min-h-[80px]"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <GripVertical className="h-4 w-4" />
                        Right Item {index + 1}
                        {isRightItemUsed(item.id) && (
                          <Badge variant="secondary" className="text-xs">
                            Matched
                          </Badge>
                        )}
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditRightItem(item.id)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeRightItem(item.id)}
                          className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div
                      className="prose prose-sm dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: item.optionText }}
                    />
                  </>
                )}
              </div>
            ))}

            {isCreatingNewRightItem && (
              <div className="border-2 border-dashed rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <Label className="text-sm font-medium">
                    Right Item {rightItems.length + 1}
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveItem}
                      disabled={!editorContent.trim()}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <TiptapEditor
                  key="create-right"
                  initialContent=""
                  onUpdate={setEditorContent}
                  className="min-h-[80px]"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <QuestionAttachments
        attachedFiles={value.attachedFiles}
        onChange={(files) => onChange({ ...value, attachedFiles: files })}
      />
    </div>
  );
}
