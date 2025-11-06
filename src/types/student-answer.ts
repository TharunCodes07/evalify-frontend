export interface StudentAnswer {
  answerText?: string;
  selectedOptionIds?: string[];
  blankValues?: Record<number, string>;
  matchPairs?: Record<string, string[]>;
  fileUrls?: string[];
  answeredAt?: string;
}

export interface StudentAnswerWithMarks extends StudentAnswer {
  marksAwarded?: number;
  isCorrect?: boolean;
  feedback?: string;
  evaluationExplanation?: string;
}
