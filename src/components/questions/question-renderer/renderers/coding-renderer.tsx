"use client";

import { useState } from "react";
import { QuestionRendererProps } from "../types";
import { CodingQuestion } from "@/types/questions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Edit2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from "@/components/ui/code-editor";

export function CodingRenderer({
  question,
  showCorrectAnswer,
  showStudentAnswer,
  studentAnswer,
  onAnswerEdit,
  isEditable,
}: QuestionRendererProps) {
  const codingQuestion = question as CodingQuestion;
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(
    studentAnswer?.answerText || codingQuestion.codingConfig.templateCode || "",
  );

  const handleSave = () => {
    if (onAnswerEdit && question.id) {
      onAnswerEdit(question.id, {
        ...studentAnswer,
        answerText: editedCode,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedCode(studentAnswer?.answerText || "");
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary">
          {codingQuestion.codingConfig.language}
        </Badge>
        {codingQuestion.codingConfig.timeLimitMs && (
          <Badge variant="outline">
            Time: {codingQuestion.codingConfig.timeLimitMs}ms
          </Badge>
        )}
        {codingQuestion.codingConfig.memoryLimitMb && (
          <Badge variant="outline">
            Memory: {codingQuestion.codingConfig.memoryLimitMb}MB
          </Badge>
        )}
      </div>

      {showStudentAnswer && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Student Solution</span>
            {isEditable && onAnswerEdit && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-7"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <CodeEditor
                initial={editedCode}
                onChange={setEditedCode}
                language={codingQuestion.codingConfig.language}
                minHeight={300}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <CodeEditor
              initial={studentAnswer?.answerText || "// No code submitted"}
              language={codingQuestion.codingConfig.language}
              minHeight={300}
              readOnly
            />
          )}
        </div>
      )}

      {showCorrectAnswer && (
        <Tabs defaultValue="template" className="w-full">
          <TabsList>
            <TabsTrigger value="template">Template Code</TabsTrigger>
            {codingQuestion.codingConfig.boilerplateCode && (
              <TabsTrigger value="boilerplate">Boilerplate</TabsTrigger>
            )}
            {codingQuestion.codingConfig.referenceSolution && (
              <TabsTrigger value="reference">Reference Solution</TabsTrigger>
            )}
            {codingQuestion.testCases &&
              codingQuestion.testCases.length > 0 && (
                <TabsTrigger value="testcases">Test Cases</TabsTrigger>
              )}
          </TabsList>

          <TabsContent value="template" className="mt-4">
            {codingQuestion.codingConfig.templateCode ? (
              <CodeEditor
                initial={codingQuestion.codingConfig.templateCode}
                language={codingQuestion.codingConfig.language}
                minHeight={300}
                readOnly
              />
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No template code available
              </p>
            )}
          </TabsContent>

          {codingQuestion.codingConfig.boilerplateCode && (
            <TabsContent value="boilerplate" className="mt-4">
              <CodeEditor
                initial={codingQuestion.codingConfig.boilerplateCode}
                language={codingQuestion.codingConfig.language}
                minHeight={300}
                readOnly
              />
            </TabsContent>
          )}

          {codingQuestion.codingConfig.referenceSolution && (
            <TabsContent value="reference" className="mt-4">
              <CodeEditor
                initial={codingQuestion.codingConfig.referenceSolution}
                language={codingQuestion.codingConfig.language}
                minHeight={300}
                readOnly
              />
            </TabsContent>
          )}

          {codingQuestion.testCases && codingQuestion.testCases.length > 0 && (
            <TabsContent value="testcases" className="mt-4">
              <div className="space-y-4">
                {codingQuestion.testCases
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((testCase, idx) => (
                    <div
                      key={testCase.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          Test Case {idx + 1}
                        </span>
                        <Badge variant="outline">{testCase.visibility}</Badge>
                        {testCase.marksWeightage && (
                          <Badge variant="secondary">
                            {testCase.marksWeightage} marks
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-semibold text-muted-foreground">
                            Input
                          </span>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-muted-foreground">
                            Expected Output
                          </span>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                            {testCase.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}
