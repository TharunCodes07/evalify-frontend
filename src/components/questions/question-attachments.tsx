"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, FileIcon, ExternalLink } from "lucide-react";
import fileUploadQueries, {
  FileUploadResponse,
} from "@/repo/file-upload-queries/file-upload-queries";
import { useToast } from "@/hooks/use-toast";

interface QuestionAttachmentsProps {
  attachedFiles?: string[];
  onChange: (files: string[]) => void;
}

export default function QuestionAttachments({
  attachedFiles = [],
  onChange,
}: QuestionAttachmentsProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { success, error } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const timestamp = Date.now();
      const uniqueFileName = `${file.name.split(".").slice(0, -1).join(".")}_${timestamp}.${file.name.split(".").pop()}`;

      const response: FileUploadResponse = await fileUploadQueries.uploadFile(
        {
          file,
          customName: uniqueFileName,
        },
        (progress) => {
          setUploadProgress(progress);
        },
      );

      onChange([...attachedFiles, response.objectName]);
      success(`File "${file.name}" uploaded successfully!`);
      setShowUpload(false);
    } catch (err) {
      error(
        `Failed to upload file: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleRemoveFile = async (objectName: string) => {
    try {
      await fileUploadQueries.deleteFile(objectName);
      onChange(attachedFiles.filter((f) => f !== objectName));
      success("File removed successfully!");
    } catch (err) {
      error(
        `Failed to remove file: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  const handlePreview = (objectName: string) => {
    const url = fileUploadQueries.constructMinioUrl(objectName);
    window.open(url, "_blank");
  };

  const getFileNameFromObjectName = (objectName: string): string => {
    const parts = objectName.split("/");
    return parts[parts.length - 1];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Attachments
          </CardTitle>
          {!showUpload && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUpload(true)}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Attach File
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showUpload && (
          <div className="border-2 border-dashed rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Upload File</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowUpload(false)}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <input
              type="file"
              onChange={handleFileSelect}
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90
                file:cursor-pointer cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {uploading && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {attachedFiles.length > 0 ? (
          <div className="space-y-2">
            <span className="text-sm font-medium">Attached Files</span>
            <div className="space-y-2">
              {attachedFiles.map((objectName) => (
                <div
                  key={objectName}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileIcon className="h-5 w-5 text-blue-500 shrink-0" />
                    <span className="text-sm truncate">
                      {getFileNameFromObjectName(objectName)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreview(objectName)}
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveFile(objectName)}
                      className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                      title="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No files attached yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
