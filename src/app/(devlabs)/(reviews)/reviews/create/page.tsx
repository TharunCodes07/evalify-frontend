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
import { Separator } from "@/components/ui/separator";
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
  Plus,
  Trash2,
  Save,
  GraduationCap,
  Users,
  BookOpen,
  Clock,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

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
  name: string,
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
  const router = useRouter(); // Form state - starts empty for progressive loading
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
  const { data: session } = useSession();

  // Load initial data (departments and rubric templates)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!session?.accessToken) return;

      setIsLoading(true);
      try {
        // Fetch departments
        const departmentsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/departments`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (departmentsResponse.ok) {
          const departmentsData = await departmentsResponse.json();
          setDepartments(departmentsData);
        }

        // Fetch rubric templates
        const templatesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rubrics`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (templatesResponse.ok) {
          const templatesData = await templatesResponse.json();
          setRubricTemplates(templatesData._embedded?.rubrics || []);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load initial data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [session]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Load batches when department changes
  useEffect(() => {
    const fetchBatches = async () => {
      if (!selectedDepartment || !session?.accessToken) return;

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/departments/${selectedDepartment}/batches`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBatches(data);
        } else {
          setError("Failed to load batches for selected department");
        }
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
  }, [selectedDepartment, session]);
  // Determine current semester and load classes when batch changes
  useEffect(() => {
    const fetchClassesAndSemester = async () => {
      if (!selectedBatch || !selectedDepartment || !session?.accessToken)
        return;

      setLoadingClasses(true);
      // Reset dependent selections
      setSelectedClasses([]);
      setSelectedSemester("");
      setSelectedSubjects([]);
      setClasses([]);
      setSubjects([]);

      try {
        // Fetch current semester for the batch
        const semesterResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/batch/${selectedBatch}/active-semester`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (semesterResponse.ok) {
          const semesterData = await semesterResponse.json();
          console.log("Current Semester Data:", semesterData);
          setCurrentSemester(semesterData.name);
          setSelectedSemester(semesterData.name.toString());
        }

        // Fetch classes for the batch and department
        const classesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/batches/${selectedBatch}/classes?departmentId=${selectedDepartment}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (classesResponse.ok) {
          const classesData = await classesResponse.json();
          setClasses(classesData);
        } else {
          setError("Failed to load classes for selected batch");
        }
      } catch (error) {
        console.error("Error fetching classes and semester:", error);
        setError(
          "Failed to load classes and semester information. Please try again."
        );
      } finally {
        setLoadingClasses(false);
      }
    };

    if (selectedBatch && selectedDepartment) {
      fetchClassesAndSemester();
    } else {
      setClasses([]);
      setCurrentSemester(null);
    }
  }, [selectedBatch, selectedDepartment, session]);
  // Load subjects when department and semester are known
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedDepartment || !selectedSemester || !session?.accessToken)
        return;

      setLoadingSubjects(true);
      setSelectedSubjects([]);
      setSubjects([]);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/departments/${selectedDepartment}/subjects?semester=${selectedSemester}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSubjects(data);
        } else {
          setError(
            "Failed to load subjects for selected department and semester"
          );
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setError("Failed to load subjects. Please try again.");
      } finally {
        setLoadingSubjects(false);
      }
    };

    if (selectedDepartment && selectedSemester) {
      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [selectedDepartment, selectedSemester, session]);

  const selectedDept = departments.find(
    (dept) => dept.id === selectedDepartment
  );
  const semesterOptions = [1, 2, 3, 4, 5, 6, 7, 8];

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
    try {
      setIsSubmitting(true);

      // Prepare review data for submission
      const reviewData = {
        name: reviewName,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        departmentId: selectedDepartment,
        batchId: selectedBatch,
        classIds: selectedClasses,
        semester: parseInt(selectedSemester),
        subjectIds: selectedSubjects,
        rubrics: customRubrics,
        rubricTemplateId: selectedRubricTemplate || null,
      };

      // Submit the review
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (response.ok) {
        setSuccess("Review created successfully!");
        // Redirect to reviews page after successful creation
        setTimeout(() => {
          router.push("/reviews");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create review");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
                    )}
                  </SelectTrigger>
                  {/* <SelectContent>
                    {semesterOptions.map((sem) => (
                      <SelectItem key={`${selectedDept.id}-sem-${sem}`} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent> */}
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
        {/* Subjects Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Selection
            </CardTitle>
            <CardDescription>
              Choose the subjects to evaluate in this review
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subjects.length > 0 ? (
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
          </CardContent>
        </Card>
        {/* Marking Scheme */}
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
                onValueChange={handleTemplateSelect}
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

            {/* Custom Rubrics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  Evaluation Criteria
                </Label>
                <Button
                  type="button"
                  onClick={addRubric}
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
                          handleRubricChange(index, "criterion", e.target.value)
                        }
                        placeholder="e.g., Content Knowledge"
                      />
                    </div>
                    <div className="md:col-span-6">
                      <Label
                        htmlFor={`description-${index}`}
                        className="text-sm"
                      >
                        Description
                      </Label>
                      <Input
                        id={`description-${index}`}
                        value={rubric.description}
                        onChange={(e) =>
                          handleRubricChange(
                            index,
                            "description",
                            e.target.value
                          )
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
                          handleRubricChange(
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
                        onClick={() => removeRubric(index)}
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
                  {customRubrics.reduce(
                    (sum, rubric) => sum + rubric.maxScore,
                    0
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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
