"use client";

import { QuestionRenderer } from "./question-renderer";
import {
  Question,
  QuestionType,
  ProgrammingLanguage,
  FillInBlanksEvaluationType,
  TestCaseVisibility,
  OutputChecker,
} from "@/types/questions";
import { StudentAnswerWithMarks } from "@/types/student-answer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function QuestionRendererDemoComprehensive() {
  // ============ MCQ QUESTIONS ============
  const mcqQuestion: Question = {
    id: "mcq-1",
    questionType: QuestionType.MCQ,
    text: "<p>What is the time complexity of binary search?</p>",
    explanation:
      "<p>Binary search divides the search space in half with each iteration, resulting in O(log n) complexity.</p>",
    marks: 2,
    negativeMarks: 0.5,
    options: [
      { id: "opt-1", optionText: "O(n)", orderIndex: 0, isCorrect: false },
      { id: "opt-2", optionText: "O(log n)", orderIndex: 1, isCorrect: true },
      { id: "opt-3", optionText: "O(n²)", orderIndex: 2, isCorrect: false },
      { id: "opt-4", optionText: "O(1)", orderIndex: 3, isCorrect: false },
    ],
  };

  const mcqCorrectAnswer: StudentAnswerWithMarks = {
    selectedOptionIds: ["opt-2"],
    marksAwarded: 2,
    isCorrect: true,
    evaluationExplanation:
      "<p>Excellent! Binary search is indeed O(log n). You demonstrated good understanding of logarithmic complexity.</p>",
  };

  const mcqWrongAnswer: StudentAnswerWithMarks = {
    selectedOptionIds: ["opt-1"],
    marksAwarded: 0,
    isCorrect: false,
    feedback: "Linear time is for sequential search, not binary search",
    evaluationExplanation:
      "<p>Remember that binary search eliminates half of the remaining elements with each comparison, which gives it logarithmic time complexity, not linear.</p>",
  };

  // ============ MMCQ QUESTIONS ============
  const mmcqQuestion: Question = {
    id: "mmcq-1",
    questionType: QuestionType.MMCQ,
    text: "<p>Which of the following are valid HTTP methods? (Select all that apply)</p>",
    explanation:
      "<p>GET, POST, PUT, and DELETE are standard HTTP methods defined in RFC 7231.</p>",
    marks: 4,
    negativeMarks: 0,
    options: [
      { id: "opt-1", optionText: "GET", orderIndex: 0, isCorrect: true },
      { id: "opt-2", optionText: "POST", orderIndex: 1, isCorrect: true },
      { id: "opt-3", optionText: "FETCH", orderIndex: 2, isCorrect: false },
      { id: "opt-4", optionText: "PUT", orderIndex: 3, isCorrect: true },
      { id: "opt-5", optionText: "DELETE", orderIndex: 4, isCorrect: true },
      { id: "opt-6", optionText: "SEND", orderIndex: 5, isCorrect: false },
    ],
  };

  const mmcqPartialCorrect: StudentAnswerWithMarks = {
    selectedOptionIds: ["opt-1", "opt-2", "opt-4"],
    marksAwarded: 3,
    isCorrect: false,
    evaluationExplanation:
      "<p>You got 3 out of 4 correct! You missed DELETE, which is also a standard HTTP method used to remove resources.</p>",
  };

  // ============ TRUE/FALSE QUESTIONS ============
  const trueFalseQuestion: Question = {
    id: "tf-1",
    questionType: QuestionType.TRUE_FALSE,
    text: "<p>JavaScript is a statically typed language.</p>",
    explanation:
      "<p>JavaScript is dynamically typed. TypeScript adds static typing on top of JavaScript.</p>",
    marks: 1,
    negativeMarks: 0,
    answer: false,
  };

  const tfCorrectAnswer: StudentAnswerWithMarks = {
    answerText: "false",
    marksAwarded: 1,
    isCorrect: true,
  };

  const tfWrongAnswer: StudentAnswerWithMarks = {
    answerText: "true",
    marksAwarded: 0,
    isCorrect: false,
    evaluationExplanation:
      "<p>JavaScript is actually dynamically typed - variables can change types at runtime. You might be confusing it with TypeScript.</p>",
  };

  // ============ FILL IN BLANKS QUESTIONS ============
  const fibQuestion: Question = {
    id: "fib-1",
    questionType: QuestionType.FILL_IN_BLANKS,
    text: "<p>In React, <strong>[blank]</strong> is used to manage component state, while <strong>[blank]</strong> is used for side effects. The <strong>[blank]</strong> hook is used to optimize performance by memoizing values.</p>",
    marks: 3,
    negativeMarks: 0,
    explanation:
      "<p>useState manages state, useEffect handles side effects, and useMemo memoizes computed values to avoid expensive recalculations.</p>",
    blankConfig: {
      blankCount: 3,
      acceptableAnswers: {
        0: ["useState", "usestate", "use state"],
        1: ["useEffect", "useeffect", "use effect"],
        2: ["useMemo", "usememo", "use memo"],
      },
      blankWeights: { 0: 1, 1: 1, 2: 1 },
      evaluationType: FillInBlanksEvaluationType.NORMAL,
    },
  };

  const fibAllCorrect: StudentAnswerWithMarks = {
    blankValues: {
      0: "useState",
      1: "useEffect",
      2: "useMemo",
    },
    marksAwarded: 3,
    isCorrect: true,
    evaluationExplanation:
      "<p>Perfect! You demonstrated excellent knowledge of React hooks and their purposes.</p>",
  };

  const fibPartialCorrect: StudentAnswerWithMarks = {
    blankValues: {
      0: "useState",
      1: "useEffect",
      2: "useCallback",
    },
    marksAwarded: 2,
    isCorrect: false,
    evaluationExplanation:
      "<p>Good job on useState and useEffect! However, useMemo is used for memoizing values, while useCallback is for memoizing functions.</p>",
  };

  const fibAllWrong: StudentAnswerWithMarks = {
    blankValues: {
      0: "useRef",
      1: "useContext",
      2: "useReducer",
    },
    marksAwarded: 0,
    isCorrect: false,
    evaluationExplanation:
      "<p>It seems you're confusing different React hooks. Review the core hooks: useState for state, useEffect for side effects, and useMemo for memoization.</p>",
  };

  // ============ MATCH THE FOLLOWING QUESTIONS ============
  const matchQuestion: Question = {
    id: "match-1",
    questionType: QuestionType.MATCH_THE_FOLLOWING,
    text: "<p>Match the HTTP status codes with their meanings:</p>",
    marks: 4,
    negativeMarks: 0,
    explanation:
      "<p>2xx codes indicate success, 4xx indicate client errors, and 5xx indicate server errors.</p>",
    options: [
      // Left items (items to match FROM)
      { id: "left-1", optionText: "200", orderIndex: 0, isCorrect: false },
      { id: "left-2", optionText: "404", orderIndex: 1, isCorrect: false },
      { id: "left-3", optionText: "500", orderIndex: 2, isCorrect: false },
      { id: "left-4", optionText: "401", orderIndex: 3, isCorrect: false },
      // Right items (items to match TO) - matchPairIds contains the correct left item id
      {
        id: "right-1",
        optionText: "OK",
        orderIndex: 4,
        isCorrect: true,
        matchPairIds: ["left-1"],
      },
      {
        id: "right-2",
        optionText: "Not Found",
        orderIndex: 5,
        isCorrect: true,
        matchPairIds: ["left-2"],
      },
      {
        id: "right-3",
        optionText: "Internal Server Error",
        orderIndex: 6,
        isCorrect: true,
        matchPairIds: ["left-3"],
      },
      {
        id: "right-4",
        optionText: "Unauthorized",
        orderIndex: 7,
        isCorrect: true,
        matchPairIds: ["left-4"],
      },
    ],
  };

  const matchAllCorrect: StudentAnswerWithMarks = {
    matchPairs: {
      "left-1": "right-1",
      "left-2": "right-2",
      "left-3": "right-3",
      "left-4": "right-4",
    },
    marksAwarded: 4,
    isCorrect: true,
  };

  const matchPartialCorrect: StudentAnswerWithMarks = {
    matchPairs: {
      "left-1": "right-1",
      "left-2": "right-4",
      "left-3": "right-3",
      "left-4": "right-2",
    },
    marksAwarded: 2,
    isCorrect: false,
    evaluationExplanation:
      "<p>You got 2 out of 4 correct. Review the difference between 404 (resource not found) and 401 (authentication required).</p>",
  };

  // ============ DESCRIPTIVE QUESTIONS ============
  const descriptiveQuestion: Question = {
    id: "desc-1",
    questionType: QuestionType.DESCRIPTIVE,
    text: "<p>Explain the concept of closures in JavaScript with an example.</p>",
    marks: 5,
    negativeMarks: 0,
    explanation:
      "<p>A closure is a function that has access to variables in its outer (enclosing) function's scope, even after the outer function has returned.</p>",
    descriptiveConfig: {
      minWords: 50,
      maxWords: 200,
      keywords: ["scope", "function", "lexical", "variables"],
      modelAnswer:
        "<p>A closure in JavaScript is created when a function is defined inside another function, giving the inner function access to the outer function's variables and scope. This happens because of JavaScript's lexical scoping. For example:</p><pre><code>function outer() {\n  let count = 0;\n  return function inner() {\n    count++;\n    return count;\n  }\n}\nconst counter = outer();\ncounter(); // 1\ncounter(); // 2</code></pre><p>Here, the inner function has access to 'count' even after outer() has finished executing.</p>",
    },
  };

  const descriptiveGoodAnswer: StudentAnswerWithMarks = {
    answerText:
      "<p>Closures are functions that remember variables from their parent scope. When you create a function inside another function, the inner function can access the outer function's variables even after the outer function returns. Example: function makeCounter() { let n = 0; return () => ++n; } const counter = makeCounter(); counter() returns 1, 2, 3... each time because it remembers n.</p>",
    marksAwarded: 4.5,
    isCorrect: true,
    evaluationExplanation:
      "<p><strong>Excellent answer!</strong> You clearly explained closures with a practical example. Minor points: Could mention 'lexical scoping' explicitly. Well done overall!</p>",
  };

  const descriptivePoorAnswer: StudentAnswerWithMarks = {
    answerText: "<p>Closures are when functions work together.</p>",
    marksAwarded: 1,
    isCorrect: false,
    evaluationExplanation:
      "<p>Your answer is too vague and lacks key concepts. A closure specifically refers to a function's access to its outer scope's variables. Please review the topic and include: lexical scoping, inner/outer functions, and a concrete example.</p>",
  };

  // ============ CODING QUESTIONS ============
  const codingQuestion: Question = {
    id: "code-1",
    questionType: QuestionType.CODING,
    text: "<p>Write a function to reverse a string in JavaScript.</p>",
    marks: 5,
    negativeMarks: 0,
    explanation:
      "<p>There are multiple ways: using split/reverse/join, loop with array, or reduce. The split method is most concise.</p>",
    codingConfig: {
      language: ProgrammingLanguage.JAVASCRIPT,
      templateCode:
        "function reverseString(str) {\n  // Write your code here\n  \n}",
      referenceSolution:
        "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
      boilerplateCode:
        "// Boilerplate code for testing\nconst testCases = [\n  { input: 'hello', expected: 'olleh' },\n  { input: 'world', expected: 'dlrow' }\n];",
      timeLimitMs: 1000,
      memoryLimitMb: 128,
    },
    testCases: [
      {
        id: "tc-1",
        input: '("hello")',
        expectedOutput: '"olleh"',
        visibility: TestCaseVisibility.VISIBLE,
        marksWeightage: 1,
        orderIndex: 0,
        generatedFromSolution: false,
        checker: OutputChecker.EXACT,
      },
      {
        id: "tc-2",
        input: '("world")',
        expectedOutput: '"dlrow"',
        visibility: TestCaseVisibility.VISIBLE,
        marksWeightage: 1,
        orderIndex: 1,
        generatedFromSolution: false,
        checker: OutputChecker.EXACT,
      },
      {
        id: "tc-3",
        input: '("")',
        expectedOutput: '""',
        visibility: TestCaseVisibility.HIDDEN,
        marksWeightage: 1,
        orderIndex: 2,
        generatedFromSolution: false,
        checker: OutputChecker.EXACT,
      },
    ],
  };

  const codingCorrectAnswer: StudentAnswerWithMarks = {
    answerText:
      "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
    marksAwarded: 5,
    isCorrect: true,
    evaluationExplanation:
      "<p><strong>Perfect solution!</strong> You used the most elegant approach with split-reverse-join. All test cases passed with optimal time and space complexity.</p>",
  };

  const codingPartialAnswer: StudentAnswerWithMarks = {
    answerText:
      "function reverseString(str) {\n  let result = '';\n  for(let i = str.length - 1; i >= 0; i--) {\n    result += str[i];\n  }\n  return result;\n}",
    marksAwarded: 4,
    isCorrect: true,
    evaluationExplanation:
      "<p>Good solution! Your loop-based approach works correctly. However, string concatenation in a loop can be less efficient for large strings. Consider using split/reverse/join or an array for better performance.</p>",
  };

  // ============ FILE UPLOAD QUESTIONS ============
  const fileUploadQuestion: Question = {
    id: "file-1",
    questionType: QuestionType.FILE_UPLOAD,
    text: "<p>Upload your system design diagram for a URL shortener service.</p>",
    marks: 10,
    negativeMarks: 0,
    explanation:
      "<p>A good design should include: database schema, API endpoints, caching strategy, and handling of collisions.</p>",
    allowedFileTypes: [".pdf", ".png", ".jpg", ".jpeg"],
    maxFileSize: 5,
  };

  const fileUploadAnswer: StudentAnswerWithMarks = {
    fileUrls: [
      "https://example.com/uploads/system-design-diagram.pdf",
      "https://example.com/uploads/api-design.png",
    ],
    marksAwarded: 8.5,
    isCorrect: true,
    evaluationExplanation:
      "<p><strong>Great work!</strong> Your system design is well-structured and covers most key components. <br/>✓ Clear database schema<br/>✓ RESTful API design<br/>✓ Caching strategy<br/>✗ Could improve: Load balancing and sharding strategy for high traffic</p>",
  };

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Question Renderer - Comprehensive Demo
        </h1>
        <p className="text-muted-foreground text-lg">
          All question types with multiple scenarios: correct answers, wrong
          answers, partial credit, and evaluation feedback
        </p>
      </div>

      <Tabs defaultValue="mcq" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="mcq">MCQ</TabsTrigger>
          <TabsTrigger value="mmcq">MMCQ</TabsTrigger>
          <TabsTrigger value="tf">True/False</TabsTrigger>
          <TabsTrigger value="fib">Fill Blanks</TabsTrigger>
          <TabsTrigger value="match">Match</TabsTrigger>
          <TabsTrigger value="desc">Descriptive</TabsTrigger>
          <TabsTrigger value="code">Coding</TabsTrigger>
          <TabsTrigger value="file">File Upload</TabsTrigger>
        </TabsList>

        {/* ============ MCQ TAB ============ */}
        <TabsContent value="mcq" className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              Multiple Choice Question (MCQ)
            </h2>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">
                  1. Question Only Mode
                </h3>
                <QuestionRenderer question={mcqQuestion} questionNumber={1} />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-green-600">
                  2. With Correct Answer
                </h3>
                <QuestionRenderer
                  question={mcqQuestion}
                  questionNumber={1}
                  showCorrectAnswer
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-purple-600">
                  3. Student Answer Only (No Grading)
                </h3>
                <QuestionRenderer
                  question={mcqQuestion}
                  questionNumber={1}
                  showStudentAnswer
                  studentAnswer={mcqCorrectAnswer}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-emerald-600">
                  4. Correct Answer + Student Got It Right
                </h3>
                <QuestionRenderer
                  question={mcqQuestion}
                  questionNumber={1}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={mcqCorrectAnswer}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-red-600">
                  5. Correct Answer + Student Got It Wrong (With Feedback)
                </h3>
                <QuestionRenderer
                  question={mcqQuestion}
                  questionNumber={1}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={mcqWrongAnswer}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-orange-600">
                  6. Editable Mode (Practice)
                </h3>
                <QuestionRenderer
                  question={mcqQuestion}
                  questionNumber={1}
                  isEditable
                  onAnswerEdit={(id, answer) =>
                    console.log("MCQ Answer:", id, answer)
                  }
                />
              </section>
            </div>
          </Card>
        </TabsContent>

        {/* ============ MMCQ TAB ============ */}
        <TabsContent value="mmcq" className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              Multiple Multiple Choice Question (MMCQ)
            </h2>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">
                  1. Question Only Mode
                </h3>
                <QuestionRenderer question={mmcqQuestion} questionNumber={2} />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-orange-600">
                  2. Partial Credit (3/4 Correct)
                </h3>
                <QuestionRenderer
                  question={mmcqQuestion}
                  questionNumber={2}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={mmcqPartialCorrect}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-green-600">
                  3. With Correct Answer
                </h3>
                <QuestionRenderer
                  question={mmcqQuestion}
                  questionNumber={2}
                  showCorrectAnswer
                />
              </section>
            </div>
          </Card>
        </TabsContent>

        {/* ============ TRUE/FALSE TAB ============ */}
        <TabsContent value="tf" className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">True/False Question</h2>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3 text-emerald-600">
                  1. Correct Answer
                </h3>
                <QuestionRenderer
                  question={trueFalseQuestion}
                  questionNumber={3}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={tfCorrectAnswer}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-red-600">
                  2. Wrong Answer (With Evaluation Explanation)
                </h3>
                <QuestionRenderer
                  question={trueFalseQuestion}
                  questionNumber={3}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={tfWrongAnswer}
                />
              </section>
            </div>
          </Card>
        </TabsContent>

        {/* ============ FILL IN BLANKS TAB ============ */}
        <TabsContent value="fib" className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              Fill in the Blanks (Improved UX)
            </h2>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">
                  1. Question Only Mode
                </h3>
                <QuestionRenderer question={fibQuestion} questionNumber={4} />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-emerald-600">
                  2. All Correct (3/3)
                </h3>
                <QuestionRenderer
                  question={fibQuestion}
                  questionNumber={4}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={fibAllCorrect}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-orange-600">
                  3. Partial Correct (2/3)
                </h3>
                <QuestionRenderer
                  question={fibQuestion}
                  questionNumber={4}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={fibPartialCorrect}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-red-600">
                  4. All Wrong (0/3)
                </h3>
                <QuestionRenderer
                  question={fibQuestion}
                  questionNumber={4}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={fibAllWrong}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-purple-600">
                  5. Editable Mode (Practice)
                </h3>
                <QuestionRenderer
                  question={fibQuestion}
                  questionNumber={4}
                  isEditable
                  onAnswerEdit={(id, answer) =>
                    console.log("FIB Answer:", id, answer)
                  }
                />
              </section>
            </div>
          </Card>
        </TabsContent>

        {/* ============ MATCH THE FOLLOWING TAB ============ */}
        <TabsContent value="match" className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Match the Following</h2>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3 text-emerald-600">
                  1. All Correct (4/4)
                </h3>
                <QuestionRenderer
                  question={matchQuestion}
                  questionNumber={5}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={matchAllCorrect}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-orange-600">
                  2. Partial Correct (2/4)
                </h3>
                <QuestionRenderer
                  question={matchQuestion}
                  questionNumber={5}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={matchPartialCorrect}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">
                  3. Question Only
                </h3>
                <QuestionRenderer question={matchQuestion} questionNumber={5} />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-purple-600">
                  4. Editable Mode (Drag to Match)
                </h3>
                <QuestionRenderer
                  question={matchQuestion}
                  questionNumber={5}
                  isEditable
                  onAnswerEdit={(id, answer) =>
                    console.log("Match Answer:", id, answer)
                  }
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-gray-600">
                  5. Student No Answer
                </h3>
                <QuestionRenderer
                  question={matchQuestion}
                  questionNumber={5}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={{}}
                />
              </section>
            </div>
          </Card>
        </TabsContent>

        {/* ============ DESCRIPTIVE TAB ============ */}
        <TabsContent value="desc" className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Descriptive Question</h2>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3 text-emerald-600">
                  1. Good Answer (4.5/5) with Feedback
                </h3>
                <QuestionRenderer
                  question={descriptiveQuestion}
                  questionNumber={6}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={descriptiveGoodAnswer}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-red-600">
                  2. Poor Answer (1/5) with Detailed Feedback
                </h3>
                <QuestionRenderer
                  question={descriptiveQuestion}
                  questionNumber={6}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={descriptivePoorAnswer}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">
                  3. Question with Model Answer
                </h3>
                <QuestionRenderer
                  question={descriptiveQuestion}
                  questionNumber={6}
                  showCorrectAnswer
                />
              </section>
            </div>
          </Card>
        </TabsContent>

        {/* ============ CODING TAB ============ */}
        <TabsContent value="code" className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Coding Question</h2>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3 text-emerald-600">
                  1. Perfect Solution (5/5)
                </h3>
                <QuestionRenderer
                  question={codingQuestion}
                  questionNumber={7}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={codingCorrectAnswer}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-orange-600">
                  2. Working Solution with Feedback (4/5)
                </h3>
                <QuestionRenderer
                  question={codingQuestion}
                  questionNumber={7}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={codingPartialAnswer}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">
                  3. Question with Template
                </h3>
                <QuestionRenderer
                  question={codingQuestion}
                  questionNumber={7}
                />
              </section>
            </div>
          </Card>
        </TabsContent>

        {/* ============ FILE UPLOAD TAB ============ */}
        <TabsContent value="file" className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">File Upload Question</h2>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3 text-emerald-600">
                  1. Submitted Files with Evaluation (8.5/10)
                </h3>
                <QuestionRenderer
                  question={fileUploadQuestion}
                  questionNumber={8}
                  showCorrectAnswer
                  showStudentAnswer
                  studentAnswer={fileUploadAnswer}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">
                  2. Question Only
                </h3>
                <QuestionRenderer
                  question={fileUploadQuestion}
                  questionNumber={8}
                />
              </section>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Section */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <h2 className="text-2xl font-bold mb-4">Features Demonstrated</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Display Modes:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Question only (for practice/exams)</li>
              <li>With correct answers (for review)</li>
              <li>With student answers (grading view)</li>
              <li>Both correct + student answers (comparison)</li>
              <li>Editable mode (practice mode)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Special Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Evaluation explanations from AI/graders</li>
              <li>Question explanations</li>
              <li>Partial credit visualization</li>
              <li>Improved Fill-in-Blanks UX</li>
              <li>Rich text with LaTeX support</li>
              <li>Color-coded correctness indicators</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
