"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { FileList } from "./file-list";
import { useToast } from "@/hooks/use-toast";
import fileUploadQueries, {
  FileUploadParams,
} from "@/repo/file-upload-queries";
import reviewQueries from "@/repo/review-queries/review-queries";
import teamQueries from "@/repo/team-queries/team-queries";
import { projectQueries } from "@/repo/project-queries/project-queries";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Upload, ExternalLink, Trash2, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProjectWithTeam } from "@/types/types";
import { calculateReviewStatus } from "@/utils/review-status";

interface FileUploadSectionProps {
  reviewId: string;
  projectId: string;
}

export function FileUploadSection({
  reviewId,
  projectId,
}: FileUploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileListKey, setFileListKey] = useState(0);
  const { success, error } = useToast();
  const currentUser = useCurrentUser();

  const { data: review } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => reviewQueries.getReviewById(reviewId),
    enabled: !!reviewId,
  });

  const { data: project } = useQuery<ProjectWithTeam>({
    queryKey: ["project", projectId],
    queryFn: () => projectQueries.fetchProjectByProjectId(projectId),
    enabled: !!projectId,
  });

  const { data: team } = useQuery({
    queryKey: ["team", project?.teamId],
    queryFn: () => teamQueries.getTeamById(project!.teamId),
    enabled: !!project?.teamId,
  });

  // Calculate review status and permissions
  const reviewStatus = review
    ? calculateReviewStatus(review.startDate, review.endDate)
    : null;
  const isReviewComplete = reviewStatus === "COMPLETED";

  // Check if user can upload files
  const userGroups = (currentUser?.groups as string[]) || [];
  const canUpload =
    currentUser &&
    !isReviewComplete &&
    (userGroups.includes("student") ||
      userGroups.includes("admin") ||
      userGroups.includes("manager"));

  const uploadMutation = useMutation({
    mutationFn: (params: FileUploadParams) =>
      fileUploadQueries.uploadFile(params, (progress) => {
        setUploadProgress(progress);
      }),
    onSuccess: (_data) => {
      success("Your file has been uploaded successfully.");
      setSelectedFile(null);
      setUploadProgress(0);
      setFileListKey((prev) => prev + 1);
    },
    onError: (err: Error) => {
      error(err.message || "Failed to upload file. Please try again.");
      setUploadProgress(0);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (objectName: string) =>
      fileUploadQueries.deleteFile(objectName),
    onSuccess: () => {
      success("The file has been deleted successfully.");
    },
    onError: (err: Error) => {
      error(err.message || "Failed to delete file. Please try again.");
    },
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadProgress(0);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleUpload = () => {
    if (!selectedFile || !review || !project) return;

    const teamId = project.teamId;
    const teamName = team?.name || "UnknownTeam";
    const projectName = project.title;
    const reviewName = review.name;

    const uploadParams: FileUploadParams = {
      file: selectedFile,
      teamId,
      teamName,
      projectId,
      projectName,
      reviewId,
      reviewName,
    };

    uploadMutation.mutate(uploadParams);
  };

  const handleOpenFile = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadFile = async (url: string, fileName: string) => {
    try {
      // Fetch the file as a blob to handle CORS and ensure download
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (downloadError) {
      console.error("Download error:", downloadError);
      error("Failed to download the file. Please try again.");
    }
  };

  const handleDeleteFile = (objectName: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      deleteMutation.mutate(objectName);
    }
  };

  const uploadResult = uploadMutation.data;
  const isUploading = uploadMutation.isPending;
  const uploadError = uploadMutation.error?.message || null;
  const uploadSuccess = uploadMutation.isSuccess;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!uploadSuccess && canUpload ? (
          <>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              maxSizeInMB={70}
              disabled={isUploading}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
              uploadError={uploadError}
              uploadSuccess={uploadSuccess}
            />

            {selectedFile && !isUploading && !uploadSuccess && (
              <div className="flex justify-end">
                <Button onClick={handleUpload} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload File
                </Button>
              </div>
            )}

            {uploadError && (
              <Alert variant="destructive">
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}
          </>
        ) : !canUpload && isReviewComplete ? (
          <Alert>
            <AlertDescription>
              Files cannot be uploaded for this review as it is already
              completed.
            </AlertDescription>
          </Alert>
        ) : !canUpload ? (
          <Alert>
            <AlertDescription>
              You do not have permission to upload files for this review.
            </AlertDescription>
          </Alert>
        ) : null}

        {uploadSuccess && uploadResult && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                File uploaded successfully! You can access it using the link
                below.
              </AlertDescription>
            </Alert>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-green-800">
                      {selectedFile?.name || "Uploaded File"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenFile(uploadResult.url)}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownloadFile(
                          uploadResult.url,
                          selectedFile?.name || "downloaded-file"
                        )
                      }
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFile(uploadResult.objectName)}
                      disabled={deleteMutation.isPending}
                      className="gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  uploadMutation.reset();
                  setSelectedFile(null);
                  setUploadProgress(0);
                }}
              >
                Upload Another File
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6">
          <FileList
            key={fileListKey}
            projectId={projectId}
            projectName={project?.title}
            reviewId={reviewId}
            reviewName={review?.name}
            teamId={project?.teamId}
            teamName={team?.name || "Unknown"}
            onFileDeleted={() => setFileListKey((prev) => prev + 1)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
