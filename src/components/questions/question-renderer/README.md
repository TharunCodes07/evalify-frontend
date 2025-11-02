# Question Renderer Component

A production-grade, multipurpose question rendering component that supports all question types with flexible display modes and editing capabilities.

## Features

### Display Modes

- **Question Only**: Display just the question
- **Question + Correct Answer**: Review mode showing correct answers
- **Question + Student Answer**: Show student's submitted answers
- **Question + Student Answer + Correct Answer**: Full grading mode
- **Question + Student Answer + Marks**: Results view with awarded marks

### Edit Capabilities

- **Question Edit**: Redirect to question creation page
- **Student Answer Edit**: Inline editing with drag-and-drop for match questions
- **Student Marks Edit**: Inline marks editing with validation
- **Delete Question**: With confirmation dialog

### Question Types Supported

1. **MCQ/MMCQ**: Multiple choice with visual indicators
2. **True/False**: Clean true/false selection
3. **Fill in the Blanks**: Inline blank filling with validation
4. **Match the Following**: Drag-and-drop matching interface
5. **Descriptive**: Rich text editor with word count
6. **Coding**: Code editor with syntax highlighting and test cases
7. **File Upload**: File preview and download

## Usage

### Basic Usage

```tsx
import { QuestionRenderer } from "@/components/questions/question-renderer";

<QuestionRenderer question={question} questionNumber={1} />;
```

### Review Mode (Show Correct Answers)

```tsx
<QuestionRenderer question={question} questionNumber={1} showCorrectAnswer />
```

### Grading Mode (Show Student Answer + Correct Answer + Edit Marks)

```tsx
<QuestionRenderer
  question={question}
  questionNumber={1}
  showCorrectAnswer
  showStudentAnswer
  studentAnswer={studentAnswer}
  onMarksEdit={(questionId, marks) => {
    // Handle marks update
  }}
/>
```

### Practice Mode (Editable Student Answer)

```tsx
<QuestionRenderer
  question={question}
  questionNumber={1}
  showStudentAnswer
  studentAnswer={studentAnswer}
  onAnswerEdit={(questionId, answer) => {
    // Handle answer update
  }}
  isEditable
/>
```

### With Edit/Delete Controls

```tsx
<QuestionRenderer
  question={question}
  questionNumber={1}
  showCorrectAnswer
  onEdit={(questionId) => {
    // Redirect to edit page
    router.push(`/questions/${questionId}/edit`);
  }}
  onDelete={(questionId) => {
    // Handle deletion
  }}
/>
```

## Props

```typescript
interface QuestionRendererProps {
  question: Question; // The question object
  questionNumber?: number; // Question number to display
  showCorrectAnswer?: boolean; // Show correct answers
  showStudentAnswer?: boolean; // Show student's answer
  studentAnswer?: StudentAnswerWithMarks; // Student answer data
  onEdit?: (questionId: string) => void; // Edit question callback
  onDelete?: (questionId: string) => void; // Delete question callback
  onMarksEdit?: (questionId: string, marks: number) => void; // Edit marks callback
  onAnswerEdit?: (questionId: string, answer: StudentAnswerWithMarks) => void; // Edit answer callback
  isEditable?: boolean; // Enable answer editing
  compact?: boolean; // Compact display mode
}
```

## Student Answer Types

```typescript
interface StudentAnswer {
  answerText?: string; // For descriptive, true/false, coding
  selectedOptionIds?: string[]; // For MCQ/MMCQ
  blankValues?: Record<number, string>; // For fill in blanks
  matchPairs?: Record<string, string>; // For match the following
  fileUrls?: string[]; // For file upload
  answeredAt?: string; // Timestamp
}

interface StudentAnswerWithMarks extends StudentAnswer {
  marksAwarded?: number; // Marks given
  isCorrect?: boolean; // Correctness indicator
  feedback?: string; // Teacher feedback
}
```

## Conditional Rendering Logic

The component intelligently renders based on the props:

1. **Question Header**: Always shown with question type, marks, and optional indicators
2. **Correct Answer Indicators**: Shown when `showCorrectAnswer` is true
3. **Student Answer Display**: Shown when `showStudentAnswer` is true
4. **Edit Controls**: Shown when respective callback props are provided
5. **Marks Editor**: Shown when `onMarksEdit` is provided and has student answer
6. **Answer Editor**: Enabled when `isEditable` is true and `onAnswerEdit` is provided
7. **Explanation**: Shown when available and `showCorrectAnswer` is true

## Styling

The component uses:

- Tailwind CSS for styling
- shadcn/ui components for consistency
- Color coding:
  - Green: Correct answers
  - Red: Incorrect answers
  - Blue: Selected but not yet graded
  - Gray: Neutral/unselected states

## Examples

See `demo.tsx` for comprehensive examples of all display modes and question types.

## Best Practices

1. **Type Safety**: Always use the proper `Question` union type
2. **Student Answers**: Use `StudentAnswerWithMarks` for complete answer data
3. **Editing**: Provide either all edit callbacks or none for consistency
4. **Performance**: Use `compact` mode for lists with many questions
5. **Accessibility**: Component includes proper ARIA labels and keyboard navigation

## Dependencies

- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- shadcn/ui components
- @dnd-kit (for drag-and-drop)
- DOMPurify (for HTML sanitization)
- CodeMirror (for code editor)
