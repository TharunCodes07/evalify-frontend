"use client";

import {
  CodingQuestion,
  ProgrammingLanguage,
  TestCaseVisibility,
  OutputChecker,
  TestCase,
} from "@/types/questions";
import { useState } from "react";
import { TiptapEditor } from "@/components/rich-text-editor/editor";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Code, TestTube, Plus, Trash2, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from "@/components/ui/code-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QuestionAttachments from "./question-attachments";

interface CodingComponentProps {
  value: CodingQuestion;
  onChange: (question: CodingQuestion) => void;
}

export default function CodingComponent({
  value,
  onChange,
}: CodingComponentProps) {
  const [expandedTestCase, setExpandedTestCase] = useState<string | null>(null);

  const totalWeightage = (value.testCases || []).reduce(
    (sum, tc) => sum + (tc.marksWeightage || 1),
    0,
  );

  const weightageError =
    value.marks > 0 && Math.abs(totalWeightage - value.marks) > 0.01;

  const handleQuestionChange = (content: string) => {
    onChange({ ...value, text: content });
  };

  const handleLanguageChange = (language: ProgrammingLanguage) => {
    onChange({
      ...value,
      codingConfig: {
        ...(value.codingConfig || {}),
        language,
        templateCode: value.codingConfig?.templateCode || "",
        boilerplateCode: value.codingConfig?.boilerplateCode || "",
        referenceSolution: value.codingConfig?.referenceSolution || "",
        timeLimitMs: value.codingConfig?.timeLimitMs || 1000,
        memoryLimitMb: value.codingConfig?.memoryLimitMb,
      },
    });
  };

  const handleTemplateCodeChange = (code: string) => {
    onChange({
      ...value,
      codingConfig: {
        ...(value.codingConfig || { language: ProgrammingLanguage.JAVA }),
        templateCode: code,
      },
    });
  };

  const handleBoilerplateCodeChange = (code: string) => {
    onChange({
      ...value,
      codingConfig: {
        ...(value.codingConfig || { language: ProgrammingLanguage.JAVA }),
        boilerplateCode: code,
      },
    });
  };

  const handleReferenceSolutionChange = (code: string) => {
    onChange({
      ...value,
      codingConfig: {
        ...(value.codingConfig || { language: ProgrammingLanguage.JAVA }),
        referenceSolution: code,
      },
    });
  };

  const handleTimeLimitChange = (timeLimit: number | undefined) => {
    onChange({
      ...value,
      codingConfig: {
        ...(value.codingConfig || { language: ProgrammingLanguage.JAVA }),
        timeLimitMs: timeLimit,
      },
    });
  };

  const handleMemoryLimitChange = (memoryLimit: number | undefined) => {
    onChange({
      ...value,
      codingConfig: {
        ...(value.codingConfig || { language: ProgrammingLanguage.JAVA }),
        memoryLimitMb: memoryLimit,
      },
    });
  };

  const handleAddTestCase = () => {
    const newTestCase: TestCase = {
      id: crypto.randomUUID(),
      input: "",
      expectedOutput: "",
      visibility: TestCaseVisibility.VISIBLE,
      orderIndex: (value.testCases || []).length,
      generatedFromSolution: false,
      checker: OutputChecker.EXACT,
    };
    onChange({
      ...value,
      testCases: [...(value.testCases || []), newTestCase],
    });
    setExpandedTestCase(newTestCase.id);
  };

  const handleDeleteTestCase = (testCaseId: string) => {
    onChange({
      ...value,
      testCases: (value.testCases || []).filter((tc) => tc.id !== testCaseId),
    });
  };

  const handleTestCaseChange = (
    testCaseId: string,
    updates: Partial<TestCase>,
  ) => {
    onChange({
      ...value,
      testCases: (value.testCases || []).map((tc) =>
        tc.id === testCaseId ? { ...tc, ...updates } : tc,
      ),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Problem Statement
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
            <Settings className="h-5 w-5 text-primary" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Programming Language</Label>
              <Select
                value={value.codingConfig?.language || ProgrammingLanguage.JAVA}
                onValueChange={(val) =>
                  handleLanguageChange(val as ProgrammingLanguage)
                }
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProgrammingLanguage).map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time Limit (ms) (Optional)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="0"
                placeholder="e.g., 10000 (default: 10 seconds)"
                value={value.codingConfig?.timeLimitMs || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleTimeLimitChange(
                    val ? parseInt(val) : (undefined as unknown as number),
                  );
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memoryLimit">Memory Limit (MB) (Optional)</Label>
              <Input
                id="memoryLimit"
                type="number"
                min="0"
                placeholder="e.g., 256 (leave empty for no limit)"
                value={value.codingConfig?.memoryLimitMb || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleMemoryLimitChange(
                    val ? parseInt(val) : (undefined as unknown as number),
                  );
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Code Templates (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="template" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="template">Template Code</TabsTrigger>
              <TabsTrigger value="boilerplate">Boilerplate Code</TabsTrigger>
              <TabsTrigger value="reference">Reference Solution</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Initial code shown to students
              </p>
              <CodeEditor
                language={
                  value.codingConfig?.language || ProgrammingLanguage.JAVA
                }
                initial={value.codingConfig?.templateCode || ""}
                onChange={handleTemplateCodeChange}
                ariaLabel="Template code editor"
                minHeight={200}
              />
            </TabsContent>

            <TabsContent value="boilerplate" className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Non-editable code prepended to student solutions
              </p>
              <CodeEditor
                language={
                  value.codingConfig?.language || ProgrammingLanguage.JAVA
                }
                initial={value.codingConfig?.boilerplateCode || ""}
                onChange={handleBoilerplateCodeChange}
                ariaLabel="Boilerplate code editor"
                minHeight={200}
              />
            </TabsContent>

            <TabsContent value="reference" className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Your solution for testing and grading reference
              </p>
              <CodeEditor
                language={
                  value.codingConfig?.language || ProgrammingLanguage.JAVA
                }
                initial={value.codingConfig?.referenceSolution || ""}
                onChange={handleReferenceSolutionChange}
                ariaLabel="Reference solution editor"
                minHeight={250}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <TestTube className="h-5 w-5 text-primary" />
                Test Cases
              </CardTitle>
              {weightageError && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  Total weightage ({totalWeightage.toFixed(1)}) must equal
                  question marks ({value.marks})
                </p>
              )}
              {!weightageError && (value.testCases || []).length > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Total weightage: {totalWeightage.toFixed(1)} / {value.marks}{" "}
                  marks
                </p>
              )}
            </div>
            <Button onClick={handleAddTestCase} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Test Case
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(value.testCases || []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No test cases yet. Add one to get started.
            </p>
          ) : (
            (value.testCases || []).map((testCase, index) => (
              <div
                key={testCase.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Test Case {index + 1}</h4>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setExpandedTestCase(
                          expandedTestCase === testCase.id ? null : testCase.id,
                        )
                      }
                    >
                      {expandedTestCase === testCase.id ? "Collapse" : "Expand"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTestCase(testCase.id)}
                      className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {expandedTestCase === testCase.id && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Visibility</Label>
                        <Select
                          value={testCase.visibility}
                          onValueChange={(val) =>
                            handleTestCaseChange(testCase.id, {
                              visibility: val as TestCaseVisibility,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(TestCaseVisibility).map((vis) => (
                              <SelectItem key={vis} value={vis}>
                                {vis}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Output Checker</Label>
                        <Select
                          value={testCase.checker}
                          onValueChange={(val) =>
                            handleTestCaseChange(testCase.id, {
                              checker: val as OutputChecker,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(OutputChecker).map((checker) => (
                              <SelectItem key={checker} value={checker}>
                                {checker}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Input</Label>
                      <CodeEditor
                        language="markup"
                        initial={testCase.input}
                        onChange={(val) =>
                          handleTestCaseChange(testCase.id, { input: val })
                        }
                        ariaLabel="Test case input"
                        minHeight={120}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Expected Output</Label>
                      <CodeEditor
                        language="markup"
                        initial={testCase.expectedOutput}
                        onChange={(val) =>
                          handleTestCaseChange(testCase.id, {
                            expectedOutput: val,
                          })
                        }
                        ariaLabel="Expected output"
                        minHeight={120}
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`weightage-${testCase.id}`}>
                          Marks Weightage:
                        </Label>
                        <Input
                          id={`weightage-${testCase.id}`}
                          type="number"
                          min="0"
                          step="0.1"
                          value={testCase.marksWeightage || 1}
                          onChange={(e) =>
                            handleTestCaseChange(testCase.id, {
                              marksWeightage: parseFloat(e.target.value) || 1,
                            })
                          }
                          className="w-20 h-8"
                        />
                      </div>

                      {testCase.checker === OutputChecker.FLOAT_TOLERANCE && (
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`tolerance-${testCase.id}`}>
                            Float Tolerance:
                          </Label>
                          <Input
                            id={`tolerance-${testCase.id}`}
                            type="number"
                            min="0"
                            step="0.000001"
                            value={testCase.floatTolerance || 0.000001}
                            onChange={(e) =>
                              handleTestCaseChange(testCase.id, {
                                floatTolerance:
                                  parseFloat(e.target.value) || 0.000001,
                              })
                            }
                            className="w-32 h-8"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <QuestionAttachments
        attachedFiles={value.attachedFiles}
        onChange={(files) => onChange({ ...value, attachedFiles: files })}
      />
    </div>
  );
}
