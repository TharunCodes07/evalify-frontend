import { Question } from "@/types/questions";
import { StudentAnswerWithMarks } from "@/types/student-answer";

export interface QuestionRendererProps {
  question: Question;
  questionNumber?: number;
  showCorrectAnswer?: boolean;
  showStudentAnswer?: boolean;
  studentAnswer?: StudentAnswerWithMarks;
  onEdit?: (questionId: string) => void;
  onDelete?: (questionId: string) => void;
  onMarksEdit?: (questionId: string, marks: number) => void;
  onAnswerEdit?: (questionId: string, answer: StudentAnswerWithMarks) => void;
  isEditable?: boolean;
  compact?: boolean;
}
