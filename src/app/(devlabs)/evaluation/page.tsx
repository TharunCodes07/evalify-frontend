"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  MessageSquare,
  Code,
  Save,
  CheckCircle,
  Lightbulb,
  Briefcase,
  HelpCircle,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  avatar: string;
  studentId: string;
}

interface Criterion {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isTeamScored: boolean;
  maxScore: number;
  weight: number;
}

interface Evaluation {
  criterionId: string;
  studentId: string;
  score: number | null;
  feedback: string;
}

const students: Student[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    studentId: "S2023001",
  },
  {
    id: "2",
    name: "David Lee",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    studentId: "S2023002",
  },
  {
    id: "3",
    name: "Emily Wong",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    studentId: "S2023003",
  },
  {
    id: "4",
    name: "Michael Johnson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    studentId: "S2023004",
  },
];

const evaluationCriteria: Criterion[] = [
  {
    id: "1",
    name: "Innovation and Creativity",
    icon: <Lightbulb className="w-5 h-5" />,
    description:
      "Ability to generate novel ideas and creative solutions to problems",
    isTeamScored: false,
    maxScore: 5,
    weight: 25,
  },
  {
    id: "2",
    name: "Collaboration and Communication",
    icon: <MessageSquare className="w-5 h-5" />,
    description: "Effectiveness in team collaboration and clear communication",
    isTeamScored: false,
    maxScore: 5,
    weight: 25,
  },
  {
    id: "3",
    name: "Technical Skills",
    icon: <Code className="w-5 h-5" />,
    description: "Proficiency in required technical skills and implementation",
    isTeamScored: false,
    maxScore: 5,
    weight: 30,
  },
  {
    id: "4",
    name: "Project Management",
    icon: <Briefcase className="w-5 h-5" />,
    description:
      "Ability to plan, execute, and deliver project components on time",
    isTeamScored: false,
    maxScore: 5,
    weight: 20,
  },
];

// Feedback templates to help faculty quickly add common feedback
const feedbackTemplates = {
  excellent: [
    "Demonstrated exceptional understanding and application of concepts.",
    "Outstanding work that exceeds expectations in all areas.",
    "Excellent critical thinking and problem-solving skills.",
  ],
  good: [
    "Shows good understanding of core concepts with minor areas for improvement.",
    "Solid work that meets all requirements effectively.",
    "Good application of skills with some room for refinement.",
  ],
  needsImprovement: [
    "Basic understanding demonstrated, but needs more depth.",
    "Several key areas require additional attention and development.",
    "Fundamental concepts need to be strengthened.",
  ],
};

export default function EvaluationPage() {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState("criteria");
  const [criteria] = useState<Criterion[]>(evaluationCriteria);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);  // Removed activeCriterion state - now showing all criteria
  const [teamMode, setTeamMode] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Initialize evaluations with empty data for each student and criterion
  useEffect(() => {
    const initialEvaluations: Evaluation[] = [];

    criteria.forEach((criterion) => {
      students.forEach((student) => {
        initialEvaluations.push({
          criterionId: criterion.id,
          studentId: student.id,
          score: null,
          feedback: "",
        });
      });
    });    setEvaluations(initialEvaluations);
  }, [criteria]);

  const getEvaluation = (criterionId: string, studentId: string) => {
    return (
      evaluations.find(
        (e) => e.criterionId === criterionId && e.studentId === studentId
      ) || {
        criterionId,
        studentId,
        score: null,
        feedback: "",
      }
    );
  };

  const updateEvaluation = (
    criterionId: string,
    studentId: string,
    field: "score" | "feedback",
    value: number | string
  ) => {
    setUnsavedChanges(true);

    setEvaluations((prev) => {
      const index = prev.findIndex(
        (e) => e.criterionId === criterionId && e.studentId === studentId
      );

      if (index === -1) {
        return [
          ...prev,
          {
            criterionId,
            studentId,
            score: field === "score" ? (value as number) : null,
            feedback: field === "feedback" ? (value as string) : "",
          },
        ];
      }

      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  const applyTeamScore = (criterionId: string, score: number) => {
    setUnsavedChanges(true);

    setEvaluations((prev) => {
      const updated = [...prev];

      students.forEach((student) => {
        const index = updated.findIndex(
          (e) => e.criterionId === criterionId && e.studentId === student.id
        );

        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            score,
          };
        } else {
          updated.push({
            criterionId,
            studentId: student.id,
            score,
            feedback: "",
          });
        }
      });

      return updated;
    });
  };

  const applyFeedbackTemplate = (
    criterionId: string,
    studentId: string,
    templateType: keyof typeof feedbackTemplates
  ) => {
    const templates = feedbackTemplates[templateType];
    const randomTemplate =
      templates[Math.floor(Math.random() * templates.length)];

    updateEvaluation(criterionId, studentId, "feedback", randomTemplate);
  };  const saveEvaluations = () => {
    // In a real app, this would save to a database
    setUnsavedChanges(false);

    success("Evaluations saved successfully!");
  };

  const getScoreColor = (score: number | null, maxScore: number) => {
    if (score === null) return "text-gray-400";

    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-emerald-500";
    if (percentage >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  const getAverageScore = (criterionId: string) => {
    const relevantEvaluations = evaluations.filter(
      (e) => e.criterionId === criterionId && e.score !== null
    );

    if (relevantEvaluations.length === 0) return null;

    const sum = relevantEvaluations.reduce(
      (acc, curr) => acc + (curr.score || 0),
      0
    );

    return sum / relevantEvaluations.length;
  };

  const getCompletionPercentage = () => {
    const totalEvaluations = criteria.length * students.length;
    const completedEvaluations = evaluations.filter(
      (e) => e.score !== null
    ).length;

    return Math.round((completedEvaluations / totalEvaluations) * 100);
  };
  // Removed navigation functions - now showing all criteria simultaneously

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-6 w-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">
                Project Evaluation: Team Alpha
              </h1>
            </div>
            <p className="text-gray-400">
              CS401 - Advanced Software Engineering
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="team-mode"
                checked={teamMode}
                onCheckedChange={setTeamMode}
              />
              <Label htmlFor="team-mode" className="text-sm">
                Team Evaluation Mode
              </Label>
            </div>

            <Button
              onClick={saveEvaluations}
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
              disabled={!unsavedChanges}
            >
              <Save className="h-4 w-4" />
              Save Evaluations
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-gray-800 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
            style={{ width: `${getCompletionPercentage()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-6">
          <span>Evaluation Progress</span>
          <span>{getCompletionPercentage()}% Complete</span>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="criteria"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="criteria">Criteria-Based View</TabsTrigger>
            <TabsTrigger value="students">Student-Based View</TabsTrigger>
          </TabsList>          {/* Criteria-Based View */}
          <TabsContent value="criteria" className="space-y-6">
            {teamMode && (
              <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Team Evaluation Mode: Apply scores to all students across all criteria
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <Button
                        key={score}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          criteria.forEach(criterion => {
                            applyTeamScore(criterion.id, score);
                          });
                        }}
                        className="w-8 h-8 p-0"
                      >
                        {score}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* All Criteria Details */}
            {criteria.map((criterion) => (
                <div
                  key={criterion.id}
                  className="rounded-xl bg-gray-900 p-6 border border-gray-800 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-gray-800 p-2">
                      {criterion.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-white">
                          {criterion.name}
                        </h2>
                        <Badge variant="outline" className="ml-2">
                          Weight: {criterion.weight}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {criterion.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    {students.map((student) => {
                      const evaluation = getEvaluation(
                        criterion.id,
                        student.id
                      );

                      return (
                        <Card
                          key={student.id}
                          className="bg-gray-800 border-gray-700 overflow-hidden"
                        >
                          <CardContent className="p-0">
                            <div className="bg-gray-850 p-4 border-b border-gray-700 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className="h-10 w-10 rounded-full bg-cover bg-center"
                                  style={{
                                    backgroundImage: `url(${student.avatar})`,
                                  }}
                                />
                                <div>
                                  <p className="font-medium text-white">
                                    {student.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {student.studentId}
                                  </p>
                                </div>
                              </div>
                              <div
                                className={`text-2xl font-bold ${getScoreColor(
                                  evaluation.score,
                                  criterion.maxScore
                                )}`}
                              >
                                {evaluation.score !== null
                                  ? `${evaluation.score}/${criterion.maxScore}`
                                  : "-"}
                              </div>
                            </div>

                            <div className="p-4 space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label
                                    htmlFor={`score-${student.id}`}
                                    className="text-sm"
                                  >
                                    Score
                                  </Label>
                                  <div className="text-sm text-gray-400">
                                    Max: {criterion.maxScore}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <Slider
                                    id={`score-${student.id}`}
                                    min={0}
                                    max={criterion.maxScore}
                                    step={1}
                                    value={
                                      evaluation.score !== null
                                        ? [evaluation.score]
                                        : [0]
                                    }
                                    onValueChange={(value) =>
                                      updateEvaluation(
                                        criterion.id,
                                        student.id,
                                        "score",
                                        value[0]
                                      )
                                    }
                                    className="flex-1"
                                  />
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((score) => (
                                      <Button
                                        key={score}
                                        variant={
                                          evaluation.score === score
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                          updateEvaluation(
                                            criterion.id,
                                            student.id,
                                            "score",
                                            score
                                          )
                                        }
                                        className="w-8 h-8 p-0"
                                      >
                                        {score}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label
                                    htmlFor={`feedback-${student.id}`}
                                    className="text-sm"
                                  >
                                    Feedback
                                  </Label>
                                  <div className="flex gap-1">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              applyFeedbackTemplate(
                                                criterion.id,
                                                student.id,
                                                "excellent"
                                              )
                                            }
                                          >
                                            <span className="text-emerald-500">
                                              +
                                            </span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Add excellent feedback template</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              applyFeedbackTemplate(
                                                criterion.id,
                                                student.id,
                                                "good"
                                              )
                                            }
                                          >
                                            <span className="text-amber-500">
                                              ~
                                            </span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Add good feedback template</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              applyFeedbackTemplate(
                                                criterion.id,
                                                student.id,
                                                "needsImprovement"
                                              )
                                            }
                                          >
                                            <span className="text-rose-500">
                                              -
                                            </span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            Add needs improvement feedback
                                            template
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>

                                <Textarea
                                  id={`feedback-${student.id}`}
                                  value={evaluation.feedback}
                                  onChange={(e) =>
                                    updateEvaluation(
                                      criterion.id,
                                      student.id,
                                      "feedback",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter feedback for this criterion..."
                                  className="h-24 bg-gray-850 border-gray-700"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>                  <div className="mt-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        Average Score:
                      </span>
                      <span className="font-bold text-white">
                        {getAverageScore(criterion.id)?.toFixed(1) || "-"}/
                        {criterion.maxScore}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </TabsContent>

          {/* Student-Based View */}
          <TabsContent value="students" className="space-y-6">
            {students.map((student) => (
              <Card
                key={student.id}
                className="bg-gray-900 border-gray-800 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="bg-gray-850 p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${student.avatar})` }}
                      />
                      <div>
                        <p className="font-medium text-white text-lg">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {student.studentId}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-gray-800">
                      {criteria
                        .reduce((acc, criterion) => {
                          const evaluation = getEvaluation(
                            criterion.id,
                            student.id
                          );
                          if (evaluation.score === null) return acc;
                          return (
                            acc + (evaluation.score * criterion.weight) / 100
                          );
                        }, 0)
                        .toFixed(1)}{" "}
                      / 5
                    </Badge>
                  </div>

                  <div className="p-4">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-6">
                        {criteria.map((criterion) => {
                          const evaluation = getEvaluation(
                            criterion.id,
                            student.id
                          );

                          return (
                            <div
                              key={criterion.id}
                              className="pb-4 border-b border-gray-800"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="rounded-lg bg-gray-800 p-1.5">
                                    {criterion.icon}
                                  </div>
                                  <h3 className="font-medium text-white">
                                    {criterion.name}
                                  </h3>
                                </div>
                                <div
                                  className={`text-lg font-bold ${getScoreColor(
                                    evaluation.score,
                                    criterion.maxScore
                                  )}`}
                                >
                                  {evaluation.score !== null
                                    ? `${evaluation.score}/${criterion.maxScore}`
                                    : "-"}
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`student-score-${student.id}-${criterion.id}`}
                                    className="text-sm"
                                  >
                                    Score
                                  </Label>
                                  <div className="flex items-center gap-3">
                                    <Slider
                                      id={`student-score-${student.id}-${criterion.id}`}
                                      min={0}
                                      max={criterion.maxScore}
                                      step={1}
                                      value={
                                        evaluation.score !== null
                                          ? [evaluation.score]
                                          : [0]
                                      }
                                      onValueChange={(value) =>
                                        updateEvaluation(
                                          criterion.id,
                                          student.id,
                                          "score",
                                          value[0]
                                        )
                                      }
                                      className="flex-1"
                                    />
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((score) => (
                                        <Button
                                          key={score}
                                          variant={
                                            evaluation.score === score
                                              ? "default"
                                              : "outline"
                                          }
                                          size="sm"
                                          onClick={() =>
                                            updateEvaluation(
                                              criterion.id,
                                              student.id,
                                              "score",
                                              score
                                            )
                                          }
                                          className="w-8 h-8 p-0"
                                        >
                                          {score}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label
                                      htmlFor={`student-feedback-${student.id}-${criterion.id}`}
                                      className="text-sm"
                                    >
                                      Feedback
                                    </Label>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          applyFeedbackTemplate(
                                            criterion.id,
                                            student.id,
                                            "excellent"
                                          )
                                        }
                                      >
                                        <span className="text-emerald-500">
                                          +
                                        </span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          applyFeedbackTemplate(
                                            criterion.id,
                                            student.id,
                                            "good"
                                          )
                                        }
                                      >
                                        <span className="text-amber-500">
                                          ~
                                        </span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          applyFeedbackTemplate(
                                            criterion.id,
                                            student.id,
                                            "needsImprovement"
                                          )
                                        }
                                      >
                                        <span className="text-rose-500">-</span>
                                      </Button>
                                    </div>
                                  </div>

                                  <Textarea
                                    id={`student-feedback-${student.id}-${criterion.id}`}
                                    value={evaluation.feedback}
                                    onChange={(e) =>
                                      updateEvaluation(
                                        criterion.id,
                                        student.id,
                                        "feedback",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter feedback for this criterion..."
                                    className="h-20 bg-gray-850 border-gray-700"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 gap-2"
            onClick={saveEvaluations}
            disabled={!unsavedChanges}
          >
            <CheckCircle className="h-5 w-5" />
            Submit Evaluation
          </Button>
        </div>
      </main>

      {/* Help Button */}
      <div className="fixed bottom-6 right-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="rounded-full h-12 w-12 bg-purple-600 hover:bg-purple-700 shadow-lg"
              >
                <HelpCircle className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Need help with evaluations?</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
