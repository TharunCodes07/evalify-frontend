"use client";

import { StudentQuestion } from "@/types/student-questions";
import { QuestionType } from "@/types/questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface QuestionRendererProps {
  question: StudentQuestion;
  questionNumber: number;
}

export function QuestionRenderer({
  question,
  questionNumber,
}: QuestionRendererProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-muted-foreground">
                Question {questionNumber}
              </span>
              <Badge variant="outline">{question.questionType}</Badge>
              {question.difficulty && (
                <Badge
                  variant={
                    question.difficulty === "EASY"
                      ? "default"
                      : question.difficulty === "MEDIUM"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {question.difficulty}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">
              <div dangerouslySetInnerHTML={{ __html: question.text }} />
            </CardTitle>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-primary">
              {question.marks} marks
            </div>
            {question.negativeMarks > 0 && (
              <div className="text-xs text-destructive">
                -{question.negativeMarks} marks
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {question.questionType === QuestionType.MCQ && (
          <MCQRenderer question={question} />
        )}
        {question.questionType === QuestionType.MMCQ && (
          <MMCQRenderer question={question} />
        )}
        {question.questionType === QuestionType.TRUE_FALSE && (
          <TrueFalseRenderer />
        )}
        {question.questionType === QuestionType.FILL_IN_BLANKS && (
          <FillInBlanksRenderer question={question} />
        )}
        {question.questionType === QuestionType.MATCH_THE_FOLLOWING && (
          <MatchTheFollowingRenderer question={question} />
        )}
        {question.questionType === QuestionType.DESCRIPTIVE && (
          <DescriptiveRenderer question={question} />
        )}
        {question.questionType === QuestionType.CODING && (
          <CodingRenderer question={question} />
        )}
        {question.questionType === QuestionType.FILE_UPLOAD && (
          <FileUploadRenderer question={question} />
        )}
      </CardContent>
    </Card>
  );
}

function MCQRenderer({ question }: { question: StudentQuestion }) {
  if (question.questionType !== QuestionType.MCQ) return null;

  return (
    <div className="space-y-3">
      {question.options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <input
            type="radio"
            name="mcq-answer"
            value={option.id}
            id={option.id}
            className="h-4 w-4 cursor-pointer"
          />
          <Label
            htmlFor={option.id}
            className="flex-1 cursor-pointer text-base"
          >
            <div dangerouslySetInnerHTML={{ __html: option.optionText }} />
          </Label>
        </div>
      ))}
    </div>
  );
}

function MMCQRenderer({ question }: { question: StudentQuestion }) {
  if (question.questionType !== QuestionType.MMCQ) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        Select all that apply
      </p>
      {question.options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox id={option.id} />
          <Label
            htmlFor={option.id}
            className="flex-1 cursor-pointer text-base"
          >
            <div dangerouslySetInnerHTML={{ __html: option.optionText }} />
          </Label>
        </div>
      ))}
    </div>
  );
}

function TrueFalseRenderer() {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          name="true-false-answer"
          value="true"
          id="true"
          className="h-4 w-4 cursor-pointer"
        />
        <Label htmlFor="true" className="cursor-pointer text-base">
          True
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          name="true-false-answer"
          value="false"
          id="false"
          className="h-4 w-4 cursor-pointer"
        />
        <Label htmlFor="false" className="cursor-pointer text-base">
          False
        </Label>
      </div>
    </div>
  );
}

function FillInBlanksRenderer({ question }: { question: StudentQuestion }) {
  if (question.questionType !== QuestionType.FILL_IN_BLANKS) return null;

  return (
    <div className="space-y-3">
      {Array.from({ length: question.blankConfig.blankCount }).map(
        (_, index) => (
          <div key={index}>
            <Label htmlFor={`blank-${index}`} className="text-sm mb-2 block">
              Blank {index + 1}
            </Label>
            <Input
              id={`blank-${index}`}
              placeholder={`Enter answer for blank ${index + 1}`}
            />
          </div>
        ),
      )}
    </div>
  );
}

function MatchTheFollowingRenderer({
  question,
}: {
  question: StudentQuestion;
}) {
  if (question.questionType !== QuestionType.MATCH_THE_FOLLOWING) return null;

  const leftPairs = question.options.filter((opt) => opt.isCorrect === true);
  const rightPairs = question.options.filter((opt) => opt.isCorrect === false);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h4 className="font-semibold mb-3">Column A</h4>
        <div className="space-y-2">
          {leftPairs.map((option) => (
            <div key={option.id} className="p-3 border rounded-md bg-muted/30">
              <div className="text-sm font-medium mb-1">
                {option.orderIndex + 1}.
              </div>
              <div dangerouslySetInnerHTML={{ __html: option.optionText }} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Column B</h4>
        <div className="space-y-2">
          {rightPairs.map((option) => (
            <div key={option.id} className="p-3 border rounded-md bg-muted/30">
              <div className="text-sm font-medium mb-1">
                {String.fromCharCode(65 + option.orderIndex)}.
              </div>
              <div dangerouslySetInnerHTML={{ __html: option.optionText }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DescriptiveRenderer({ question }: { question: StudentQuestion }) {
  if (question.questionType !== QuestionType.DESCRIPTIVE) return null;

  return (
    <div className="space-y-2">
      {question.descriptiveConfig.minWords && (
        <p className="text-sm text-muted-foreground">
          Minimum words: {question.descriptiveConfig.minWords}
        </p>
      )}
      {question.descriptiveConfig.maxWords && (
        <p className="text-sm text-muted-foreground">
          Maximum words: {question.descriptiveConfig.maxWords}
        </p>
      )}
      <Textarea
        placeholder="Write your answer here..."
        className="min-h-[200px]"
      />
    </div>
  );
}

function CodingRenderer({ question }: { question: StudentQuestion }) {
  if (question.questionType !== QuestionType.CODING) return null;

  const visibleTestCases = question.testCases.filter(
    (tc) => tc.visibility === "VISIBLE" || tc.visibility === "SAMPLE",
  );

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm mb-2 block">
          Language: {question.codingConfig.language}
        </Label>
        {question.codingConfig.timeLimitMs && (
          <p className="text-xs text-muted-foreground">
            Time Limit: {question.codingConfig.timeLimitMs}ms
          </p>
        )}
        {question.codingConfig.memoryLimitMb && (
          <p className="text-xs text-muted-foreground">
            Memory Limit: {question.codingConfig.memoryLimitMb}MB
          </p>
        )}
      </div>

      <div>
        <Label className="text-sm mb-2 block">Your Code</Label>
        <Textarea
          placeholder={
            question.codingConfig.templateCode ||
            question.codingConfig.boilerplateCode ||
            "Write your code here..."
          }
          className="font-mono text-sm min-h-[300px]"
          defaultValue={
            question.codingConfig.templateCode ||
            question.codingConfig.boilerplateCode
          }
        />
      </div>

      {visibleTestCases.length > 0 && (
        <div>
          <Label className="text-sm mb-2 block">Sample Test Cases</Label>
          <div className="space-y-3">
            {visibleTestCases.map((testCase, index) => (
              <div key={testCase.id} className="border rounded-md p-3">
                <p className="text-sm font-semibold mb-2">
                  Test Case {index + 1}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Input:</p>
                    <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                      {testCase.input}
                    </pre>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">
                      Expected Output:
                    </p>
                    <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                      {testCase.expectedOutput}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FileUploadRenderer({ question }: { question: StudentQuestion }) {
  if (question.questionType !== QuestionType.FILE_UPLOAD) return null;

  return (
    <div className="space-y-2">
      {question.fileUploadConfig?.allowedFileTypes && (
        <p className="text-sm text-muted-foreground">
          Allowed file types:{" "}
          {question.fileUploadConfig.allowedFileTypes.join(", ")}
        </p>
      )}
      {question.fileUploadConfig?.maxFileSize && (
        <p className="text-sm text-muted-foreground">
          Max file size:{" "}
          {(question.fileUploadConfig.maxFileSize / (1024 * 1024)).toFixed(2)}{" "}
          MB
        </p>
      )}
      <Input type="file" />
    </div>
  );
}
