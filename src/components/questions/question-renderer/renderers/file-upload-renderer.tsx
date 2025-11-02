"use client";

import { useState } from "react";
import { QuestionRendererProps } from "../types";
import { FileUploadQuestion } from "@/types/questions";
import { Badge } from "@/components/ui/badge";
import { File, Download, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FileUploadRenderer({
  question,
  showStudentAnswer,
  studentAnswer,
  onAnswerEdit,
  isEditable,
}: QuestionRendererProps) {
  const fileQuestion = question as FileUploadQuestion;
  const uploadedFiles = studentAnswer?.fileUrls || [];
  const [newFileUrl, setNewFileUrl] = useState("");

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getFileName = (url: string) => {
    return url.split("/").pop() || "file";
  };

  const handleAddFile = () => {
    if (!newFileUrl.trim() || !onAnswerEdit || !question.id) return;
    onAnswerEdit(question.id, {
      ...studentAnswer,
      fileUrls: [...uploadedFiles, newFileUrl.trim()],
    });
    setNewFileUrl("");
  };

  const handleRemoveFile = (index: number) => {
    if (!onAnswerEdit || !question.id) return;
    const newFiles = uploadedFiles.filter((_, idx) => idx !== index);
    onAnswerEdit(question.id, {
      ...studentAnswer,
      fileUrls: newFiles,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {fileQuestion.fileUploadConfig?.allowedFileTypes &&
          fileQuestion.fileUploadConfig.allowedFileTypes.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">
                Allowed types:
              </span>
              {fileQuestion.fileUploadConfig.allowedFileTypes.map(
                (type, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ),
              )}
            </div>
          )}
        {fileQuestion.fileUploadConfig?.maxFileSize && (
          <Badge variant="outline" className="text-xs">
            Max size:{" "}
            {formatFileSize(fileQuestion.fileUploadConfig.maxFileSize)}
          </Badge>
        )}
      </div>

      {showStudentAnswer && (
        <div className="space-y-2">
          <span className="text-sm font-semibold">Uploaded Files</span>
          {uploadedFiles.length > 0 ? (
            <div className="space-y-2">
              {uploadedFiles.map((fileUrl, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {getFileName(fileUrl)}
                      </p>
                      <p className="text-xs text-muted-foreground">{fileUrl}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    {isEditable && onAnswerEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(idx)}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No files uploaded
            </p>
          )}

          {isEditable && onAnswerEdit && (
            <div className="flex gap-2 mt-3">
              <Input
                value={newFileUrl}
                onChange={(e) => setNewFileUrl(e.target.value)}
                placeholder="Enter file URL"
                onKeyDown={(e) => e.key === "Enter" && handleAddFile()}
              />
              <Button onClick={handleAddFile} size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
