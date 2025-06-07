"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert } from "@/components/ui/alert";
import {
  CalendarIcon,
  Save,
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios/axios-client";
import { MarkingScheme } from "@/components/reviews/marking-scheme";

interface Subject {
  id: string;
  name: string;
  departmentId: string;
  semester: number;
}

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

interface Department {
  id: string;
  name: string;
}

interface Batch {
  id: string;
  name: string;
  graduationYear: number;
  section: string;
}

interface Class {
  id: string;
  section: string;
}

export default function CreateReviewPage() {
  const router = useRouter();
  const [reviewName, setReviewName] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedRubricTemplate, setSelectedRubricTemplate] = useState("");
  const [customRubrics, setCustomRubrics] = useState<Rubric[]>([]);

  // Data state - starts empty and gets populated via API calls
  const [departments, setDepartments] = useState<Department[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [currentSemester, setCurrentSemester] = useState<number | null>(null);
  const [rubricTemplates, setRubricTemplates] = useState<RubricTemplate[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const departmentsResponse = await axiosInstance.get("/departments");
        setDepartments(departmentsResponse.data);

        const templatesResponse = await axiosInstance.get("/api/rubrics");
        setRubricTemplates(templatesResponse.data._embedded?.rubrics || []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load initial data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Load batches when department changes
  useEffect(() => {
    const fetchBatches = async () => {
      if (!selectedDepartment) return;

      setLoadingBatches(true);
      // Reset dependent selections
      setSelectedBatch("");
      setSelectedClasses([]);
      setSelectedSemester("");
      setSelectedSubjects([]);
      setCurrentSemester(null);
      setBatches([]);
      setClasses([]);
      setSubjects([]);

      try {
        const response = await axiosInstance.get(
          `/departments/${selectedDepartment}/batches`
        );
        setBatches(response.data);
      } catch (error) {
        console.error("Error fetching batches:", error);
        setError("Failed to load batches. Please try again.");
      } finally {
        setLoadingBatches(false);
      }
    };

    if (selectedDepartment) {
      fetchBatches();
    } else {
      setBatches([]);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    const fetchClassesAndSemester = async () => {
      if (!selectedBatch || !selectedDepartment) return;

      setLoadingClasses(true);
      setSelectedClasses([]);
      setSelectedSemester("");
      setSelectedSubjects([]);
      setClasses([]);
      setSubjects([]);

      try {
        const semesterResponse = await axiosInstance.get(
          `/batch/${selectedBatch}/active-semester`
        );
        const semesterData = semesterResponse.data;
        console.log("Current Semester Data:", semesterData);
        setCurrentSemester(semesterData.name);
        setSelectedSemester(semesterData.name.toString());

        const classesResponse = await axiosInstance.get(
          `/api/batches/${selectedBatch}/classes?departmentId=${selectedDepartment}`
        );
        setClasses(classesResponse.data);
      } catch (error) {
        console.error("Error fetching classes and semester:", error);
        setError("Failed to load class information. Please try again.");
      } finally {
        setLoadingClasses(false);
      }
    };

    if (selectedBatch && selectedDepartment) {
      fetchClassesAndSemester();
    }
  }, [selectedBatch, selectedDepartment]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedSemester || !selectedDepartment) return;
      setLoadingSubjects(true);
      setSelectedSubjects([]);
      setSubjects([]);
      try {
        const response = await axiosInstance.get(
          `/api/subjects?departmentId=${selectedDepartment}&semester=${selectedSemester}`
        );
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setError("Failed to load subjects. Please try again.");
      } finally {
        setLoadingSubjects(false);
      }
    };

    if (selectedSemester && selectedDepartment) {
      fetchSubjects();
    }
  }, [selectedSemester, selectedDepartment]);

  const handleClassToggle = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleRubricChange = (
    index: number,
    field: keyof Rubric,
    value: string | number
  ) => {
    setCustomRubrics((prev) =>
      prev.map((rubric, i) =>
        i === index ? { ...rubric, [field]: value } : rubric
      )
    );
  };

  const addRubric = () => {
    setCustomRubrics((prev) => [
      ...prev,
      { criterion: "", description: "", maxScore: 0 },
    ]);
  };

  const removeRubric = (index: number) => {
    setCustomRubrics((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedRubricTemplate(templateId);
    const template = rubricTemplates.find((t) => t.id === templateId);
    if (template) {
      setCustomRubrics([...template.rubrics]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !reviewName ||
      !startDate ||
      !endDate ||
      !selectedDepartment ||
      !selectedBatch ||
      selectedClasses.length === 0 ||
      !selectedSemester ||
      selectedSubjects.length === 0 ||
      customRubrics.length === 0
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (endDate <= startDate) {
      setError("End date must be after start date");
      return;
    }
    setIsSubmitting(true);

    const finalRubrics =
      selectedRubricTemplate === "custom"
        ? customRubrics
        : rubricTemplates.find((t) => t.id === selectedRubricTemplate)?.rubrics;

    const reviewData = {
      name: reviewName,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      departmentId: selectedDepartment,
      batchId: selectedBatch,
      classIds: selectedClasses,
      semester: parseInt(selectedSemester),
      subjectIds: selectedSubjects,
      rubrics: finalRubrics,
      rubricTemplateId: selectedRubricTemplate || null,
    };

    try {
      await axiosInstance.post("/api/reviews", reviewData);
      setSuccess("Review created successfully!");
      setTimeout(() => router.push("/reviews"), 2000);
    } catch (error) {
      console.error("Error creating review:", error);
      setError("Failed to create review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Create New Review
        </h1>
        <p className="text-muted-foreground mt-2">
          Set up a new performance review with custom evaluation criteria
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <div>{error}</div>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500 bg-green-50 text-green-700">
          <div>{success}</div>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details for your review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reviewName">Review Name *</Label>
                <Input
                  id="reviewName"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Enter review name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>{" "}
        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Information
            </CardTitle>
            <CardDescription>
              Select the department, batch, and semester details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Batch *</Label>
                <Select
                  value={selectedBatch}
                  onValueChange={setSelectedBatch}
                  disabled={!selectedDepartment || loadingBatches}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingBatches
                          ? "Loading batches..."
                          : !selectedDepartment
                          ? "Select department first"
                          : "Select batch"
                      }
                    />
                    {loadingBatches && (
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Semester *</Label>
                <Select
                  value={selectedSemester}
                  onValueChange={setSelectedSemester}
                  disabled={!selectedBatch || loadingClasses}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingClasses
                          ? "Determining semester..."
                          : !selectedBatch
                          ? "Select batch first"
                          : `Current Semester: ${
                              currentSemester || "Loading..."
                            }`
                      }
                    />
                    {loadingClasses && (
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    )}{" "}
                  </SelectTrigger>
                </Select>
                {currentSemester && (
                  <p className="text-xs text-muted-foreground">
                    Auto-detected current semester for this batch
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>{" "}
        {/* Classes Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Class Selection
              {loadingClasses && (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              )}
            </CardTitle>
            <CardDescription>
              Choose the classes to include in this review
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingClasses ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-muted-foreground">
                  Loading classes...
                </span>
              </div>
            ) : classes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={cls.id}
                      checked={selectedClasses.includes(cls.id)}
                      onCheckedChange={() => handleClassToggle(cls.id)}
                    />
                    <Label htmlFor={cls.id} className="text-sm">
                      Section {cls.section}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {selectedBatch
                  ? "No classes available for selected batch"
                  : "Please select a batch first"}
              </p>
            )}
            {selectedClasses.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedClasses.map((classId) => {
                  const cls = classes.find((c) => c.id === classId);
                  return cls ? (
                    <Badge key={classId} variant="secondary">
                      Section {cls.section}
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Subjects Selection */}{" "}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Selection
              {loadingSubjects && (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              )}
            </CardTitle>
            <CardDescription>
              Choose the subjects to evaluate in this review
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSubjects ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-muted-foreground">
                  Loading subjects...
                </span>
              </div>
            ) : subjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={subject.id}
                      checked={selectedSubjects.includes(subject.id)}
                      onCheckedChange={() => handleSubjectToggle(subject.id)}
                    />
                    <Label htmlFor={subject.id} className="text-sm">
                      {subject.name}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {selectedSemester
                  ? "No subjects available for selected semester"
                  : "Please select a semester first"}
              </p>
            )}
            {selectedSubjects.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedSubjects.map((subjectId) => {
                  const subject = subjects.find((s) => s.id === subjectId);
                  return subject ? (
                    <Badge key={subjectId} variant="secondary">
                      {subject.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </CardContent>{" "}
        </Card>
        {/* Marking Scheme */}
        <MarkingScheme
          selectedRubricTemplate={selectedRubricTemplate}
          customRubrics={customRubrics}
          rubricTemplates={rubricTemplates}
          onTemplateSelect={handleTemplateSelect}
          onRubricChange={handleRubricChange}
          onAddRubric={addRubric}
          onRemoveRubric={removeRubric}
        />
        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Review...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Review
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
