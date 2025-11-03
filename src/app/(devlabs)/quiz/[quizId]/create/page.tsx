"use client";

import { useParams, useRouter } from "next/navigation";
import QuestionCreation from "@/components/questions/create-edit/question-creation";

export default function CreateQuizQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add Question</h1>
        <p className="text-muted-foreground mt-2">
          Create a new question for this quiz
        </p>
      </div>

      <QuestionCreation
        context="quiz"
        contextId={quizId}
        onSave={() => router.push(`/quiz/${quizId}`)}
        onCancel={() => router.push(`/quiz/${quizId}`)}
      />
    </div>
  );
}
