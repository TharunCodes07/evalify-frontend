"use client";

import { QuestionRenderer } from "./question-renderer";
import {
  Question,
  QuestionType,
  FillInBlanksEvaluationType,
} from "@/types/questions";
import { StudentAnswerWithMarks } from "@/types/student-answer";

export default function QuestionRendererDemo() {
  const sampleMCQ: Question = {
    id: "mcq-1",
    questionType: QuestionType.MCQ,
    text: "<p>What is the capital of France?</p>",
    explanation:
      "<p>Paris has been the capital of France since the 12th century.</p>",
    marks: 2,
    negativeMarks: 0.5,
    options: [
      { id: "opt-1", optionText: "London", orderIndex: 0, isCorrect: false },
      { id: "opt-2", optionText: "Paris", orderIndex: 1, isCorrect: true },
      { id: "opt-3", optionText: "Berlin", orderIndex: 2, isCorrect: false },
      { id: "opt-4", optionText: "Madrid", orderIndex: 3, isCorrect: false },
    ],
  };

  const studentMCQAnswer: StudentAnswerWithMarks = {
    selectedOptionIds: ["opt-2"],
    marksAwarded: 2,
    isCorrect: true,
  };

  const sampleTrueFalse: Question = {
    id: "tf-1",
    questionType: QuestionType.TRUE_FALSE,
    text: "<p>The Earth is flat.</p>",
    marks: 1,
    negativeMarks: 0,
    answer: false,
  };

  const studentTFAnswer: StudentAnswerWithMarks = {
    answerText: "false",
    marksAwarded: 1,
    isCorrect: true,
  };

  const sampleFIB: Question = {
    id: "fib-1",
    questionType: QuestionType.FILL_IN_BLANKS,
    text: "<p>The capital of [blank] is [blank].</p>",
    marks: 2,
    negativeMarks: 0,
    blankConfig: {
      blankCount: 2,
      acceptableAnswers: {
        0: ["France", "france"],
        1: ["Paris", "paris"],
      },
      blankWeights: { 0: 1, 1: 1 },
      evaluationType: FillInBlanksEvaluationType.NORMAL,
    },
  };

  const studentFIBAnswer: StudentAnswerWithMarks = {
    blankValues: {
      0: "France",
      1: "Paris",
    },
    marksAwarded: 2,
    isCorrect: true,
  };

  const handleEdit = (questionId: string) => {
    console.log("Edit question:", questionId);
  };

  const handleDelete = (questionId: string) => {
    console.log("Delete question:", questionId);
  };

  const handleMarksEdit = (questionId: string, marks: number) => {
    console.log("Update marks for question:", questionId, "to:", marks);
  };

  const handleAnswerEdit = (
    questionId: string,
    answer: StudentAnswerWithMarks,
  ) => {
    console.log("Update answer for question:", questionId, "to:", answer);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Question Renderer Demo</h1>
        <p className="text-muted-foreground">
          Demonstrating different modes and question types
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Question Only (Default)
          </h2>
          <QuestionRenderer question={sampleMCQ} questionNumber={1} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. Question + Correct Answer (Review Mode)
          </h2>
          <QuestionRenderer
            question={sampleMCQ}
            questionNumber={2}
            showCorrectAnswer
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. Question + Student Answer + Correct Answer (Grading Mode)
          </h2>
          <QuestionRenderer
            question={sampleMCQ}
            questionNumber={3}
            showCorrectAnswer
            showStudentAnswer
            studentAnswer={studentMCQAnswer}
            onMarksEdit={handleMarksEdit}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            4. Question with Edit Controls
          </h2>
          <QuestionRenderer
            question={sampleMCQ}
            questionNumber={4}
            showCorrectAnswer
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            5. Editable Student Answer (Practice Mode)
          </h2>
          <QuestionRenderer
            question={sampleMCQ}
            questionNumber={5}
            showStudentAnswer
            studentAnswer={studentMCQAnswer}
            onAnswerEdit={handleAnswerEdit}
            isEditable
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            6. True/False Question
          </h2>
          <QuestionRenderer
            question={sampleTrueFalse}
            questionNumber={6}
            showCorrectAnswer
            showStudentAnswer
            studentAnswer={studentTFAnswer}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Fill in the Blanks</h2>
          <QuestionRenderer
            question={sampleFIB}
            questionNumber={7}
            showCorrectAnswer
            showStudentAnswer
            studentAnswer={studentFIBAnswer}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Compact Mode</h2>
          <QuestionRenderer
            question={sampleMCQ}
            questionNumber={8}
            showCorrectAnswer
            compact
          />
        </section>
      </div>
    </div>
  );
}
