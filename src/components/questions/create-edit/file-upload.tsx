"use client";

import { FileUploadQuestion } from "@/types/questions";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface FileUploadComponentProps {
  value: FileUploadQuestion;
  onChange: (question: FileUploadQuestion) => void;
}

export default function FileUploadComponent({
  value,
  onChange,
}: FileUploadComponentProps) {
  const [newFileType, setNewFileType] = useState("");

  const handleQuestionChange = (content: string) => {
    onChange({ ...value, text: content });
  };

  const handleMaxFileSizeChange = (size: number) => {
    onChange({
      ...value,
      fileUploadConfig: {
        ...value.fileUploadConfig,
        maxFileSize: size,
      },
    });
  };

  const handleAddFileType = () => {
    if (!newFileType.trim()) return;

    const fileType = newFileType.trim().startsWith(".")
      ? newFileType.trim()
      : `.${newFileType.trim()}`;

    const currentTypes = value.fileUploadConfig?.allowedFileTypes || [];
    if (!currentTypes.includes(fileType)) {
      onChange({
        ...value,
        fileUploadConfig: {
          ...value.fileUploadConfig,
          allowedFileTypes: [...currentTypes, fileType],
        },
      });
    }
    setNewFileType("");
  };

  const handleRemoveFileType = (fileType: string) => {
    onChange({
      ...value,
      fileUploadConfig: {
        ...value.fileUploadConfig,
        allowedFileTypes: (
          value.fileUploadConfig?.allowedFileTypes || []
        ).filter((ft) => ft !== fileType),
      },
    });
  };

  const commonFileTypes = [
    { label: "PDF", value: ".pdf" },
    { label: "Word", value: ".docx" },
    { label: "Excel", value: ".xlsx" },
    { label: "PowerPoint", value: ".pptx" },
    { label: "Images", value: ".jpg,.jpeg,.png,.gif" },
    { label: "Videos", value: ".mp4,.avi,.mov" },
    { label: "Text", value: ".txt" },
    { label: "Code", value: ".py,.java,.cpp,.js,.ts" },
  ];

  const handleQuickAddFileType = (types: string) => {
    const typeArray = types.split(",").map((t) => t.trim());
    const currentTypes = value.fileUploadConfig?.allowedFileTypes || [];
    const newTypes = [...new Set([...currentTypes, ...typeArray])];
    onChange({
      ...value,
      fileUploadConfig: {
        ...value.fileUploadConfig,
        allowedFileTypes: newTypes,
      },
    });
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            File Upload Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
            <Input
              id="maxFileSize"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g., 10"
              value={value.fileUploadConfig?.maxFileSize || ""}
              onChange={(e) =>
                handleMaxFileSizeChange(parseFloat(e.target.value) || 0)
              }
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for no size limit
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Allowed File Types</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to allow all file types
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Quick Add Common Types</Label>
              <div className="flex flex-wrap gap-2">
                {commonFileTypes.map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAddFileType(type.value)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="e.g., .pdf or .docx"
                value={newFileType}
                onChange={(e) => setNewFileType(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFileType();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddFileType}
                disabled={!newFileType.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {value.fileUploadConfig?.allowedFileTypes &&
              value.fileUploadConfig.allowedFileTypes.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Configured File Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {value.fileUploadConfig.allowedFileTypes.map(
                      (fileType: string) => (
                        <Badge
                          key={fileType}
                          variant="secondary"
                          className="flex items-center gap-1 pl-2 pr-1"
                        >
                          {fileType}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveFileType(fileType)}
                            className="h-4 w-4 p-0 hover:bg-transparent"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
