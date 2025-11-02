import { Question, QuestionType } from "@/types/questions";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateQuestion(question: Question | null): ValidationResult {
  const errors: ValidationError[] = [];

  if (!question) {
    errors.push({
      field: "question",
      message: "Question data is missing",
    });
    return { isValid: false, errors };
  }

  // Common validations
  if (
    !question.text ||
    question.text.trim() === "" ||
    question.text === "<p></p>"
  ) {
    errors.push({
      field: "text",
      message: "Question text is required",
    });
  }

  if (question.marks <= 0) {
    errors.push({
      field: "marks",
      message: "Marks must be greater than 0",
    });
  }

  if (question.negativeMarks < 0) {
    errors.push({
      field: "negativeMarks",
      message: "Negative marks cannot be less than 0",
    });
  }

  // Type-specific validations
  switch (question.questionType) {
    case QuestionType.MCQ:
    case QuestionType.MMCQ:
      if ("options" in question) {
        if (!question.options || question.options.length < 2) {
          errors.push({
            field: "options",
            message: "At least 2 options are required",
          });
        }

        if (
          question.options &&
          !question.options.some((opt) => opt.isCorrect)
        ) {
          errors.push({
            field: "options",
            message: "At least one correct answer must be selected",
          });
        }

        if (
          question.questionType === QuestionType.MCQ &&
          question.options &&
          question.options.filter((opt) => opt.isCorrect).length > 1
        ) {
          errors.push({
            field: "options",
            message:
              "MCQ can have only one correct answer. Use MMCQ for multiple correct answers.",
          });
        }

        // Check for empty option text
        if (question.options) {
          question.options.forEach((opt, index) => {
            if (
              !opt.optionText ||
              opt.optionText.trim() === "" ||
              opt.optionText === "<p></p>"
            ) {
              errors.push({
                field: `options[${index}]`,
                message: `Option ${index + 1} text cannot be empty`,
              });
            }
          });
        }
      }
      break;

    case QuestionType.TRUE_FALSE:
      if ("answer" in question && question.answer === undefined) {
        errors.push({
          field: "answer",
          message: "True/False answer must be selected",
        });
      }
      break;

    case QuestionType.FILL_IN_BLANKS:
      if ("blankConfig" in question) {
        if (question.blankConfig.blankCount === 0) {
          errors.push({
            field: "blankConfig",
            message:
              "At least one blank is required. Use three or more underscores (___) in question text.",
          });
        }

        for (let i = 0; i < question.blankConfig.blankCount; i++) {
          const answers = question.blankConfig.acceptableAnswers[i];
          if (!answers || answers.length === 0) {
            errors.push({
              field: `blankConfig.acceptableAnswers[${i}]`,
              message: `Blank ${i + 1} must have at least one answer`,
            });
          } else if (!answers.some((a) => a && a.trim())) {
            errors.push({
              field: `blankConfig.acceptableAnswers[${i}]`,
              message: `Blank ${i + 1} must have at least one non-empty answer`,
            });
          }

          const weight = question.blankConfig.blankWeights[i];
          if (weight !== undefined && weight <= 0) {
            errors.push({
              field: `blankConfig.blankWeights[${i}]`,
              message: `Blank ${i + 1} weight must be greater than 0`,
            });
          }
        }
      }
      break;

    case QuestionType.MATCH_THE_FOLLOWING:
      if ("options" in question) {
        const leftOptions = question.options.filter(
          (opt) => !opt.matchPairIds?.includes(opt.id),
        );
        const rightOptions = question.options.filter((opt) =>
          opt.matchPairIds?.includes(opt.id),
        );

        if (leftOptions.length === 0) {
          errors.push({
            field: "options.left",
            message: "At least one left item is required",
          });
        }

        if (rightOptions.length === 0) {
          errors.push({
            field: "options.right",
            message: "At least one right item is required",
          });
        }

        leftOptions.forEach((opt, index) => {
          if (
            !opt.optionText ||
            opt.optionText.trim() === "" ||
            opt.optionText === "<p></p>"
          ) {
            errors.push({
              field: `options.left[${index}]`,
              message: `Left item ${index + 1} text cannot be empty`,
            });
          }
        });

        rightOptions.forEach((opt, index) => {
          if (
            !opt.optionText ||
            opt.optionText.trim() === "" ||
            opt.optionText === "<p></p>"
          ) {
            errors.push({
              field: `options.right[${index}]`,
              message: `Right item ${index + 1} text cannot be empty`,
            });
          }
        });

        const rightOptionIds = new Set(rightOptions.map((opt) => opt.id));
        leftOptions.forEach((opt, index) => {
          if (!opt.matchPairIds || opt.matchPairIds.length === 0) {
            errors.push({
              field: `options.left[${index}]`,
              message: `Left item ${index + 1} must be matched with at least one right item`,
            });
          } else {
            const invalidMatches = opt.matchPairIds.filter(
              (id) => !rightOptionIds.has(id),
            );
            if (invalidMatches.length > 0) {
              errors.push({
                field: `options.left[${index}]`,
                message: `Left item ${index + 1} has invalid match references`,
              });
            }
          }
        });
      }
      break;

    case QuestionType.CODING:
      if ("codingConfig" in question && !question.codingConfig.language) {
        errors.push({
          field: "codingConfig.language",
          message: "Programming language must be selected",
        });
      }

      if ("testCases" in question) {
        if (!question.testCases || question.testCases.length === 0) {
          errors.push({
            field: "testCases",
            message: "At least one test case is required",
          });
        } else {
          question.testCases.forEach((tc, index) => {
            if (!tc.input && tc.input !== "") {
              errors.push({
                field: `testCases[${index}].input`,
                message: `Test case ${index + 1} input is required`,
              });
            }

            if (!tc.expectedOutput && tc.expectedOutput !== "") {
              errors.push({
                field: `testCases[${index}].expectedOutput`,
                message: `Test case ${index + 1} expected output is required`,
              });
            }

            if (tc.marksWeightage !== undefined && tc.marksWeightage <= 0) {
              errors.push({
                field: `testCases[${index}].marksWeightage`,
                message: `Test case ${index + 1} marks weightage must be greater than 0`,
              });
            }
          });
        }
      }

      if ("codingConfig" in question) {
        if (
          question.codingConfig.timeLimitMs !== undefined &&
          question.codingConfig.timeLimitMs <= 0
        ) {
          errors.push({
            field: "codingConfig.timeLimitMs",
            message: "Time limit must be greater than 0",
          });
        }

        if (
          question.codingConfig.memoryLimitMb !== undefined &&
          question.codingConfig.memoryLimitMb <= 0
        ) {
          errors.push({
            field: "codingConfig.memoryLimitMb",
            message: "Memory limit must be greater than 0",
          });
        }
      }
      break;

    case QuestionType.DESCRIPTIVE:
      // Optional fields, basic validation only
      if ("descriptiveConfig" in question) {
        if (
          question.descriptiveConfig.minWords !== undefined &&
          question.descriptiveConfig.minWords < 0
        ) {
          errors.push({
            field: "descriptiveConfig.minWords",
            message: "Minimum words cannot be negative",
          });
        }

        if (
          question.descriptiveConfig.maxWords !== undefined &&
          question.descriptiveConfig.maxWords < 0
        ) {
          errors.push({
            field: "descriptiveConfig.maxWords",
            message: "Maximum words cannot be negative",
          });
        }

        if (
          question.descriptiveConfig.minWords !== undefined &&
          question.descriptiveConfig.maxWords !== undefined &&
          question.descriptiveConfig.minWords >
            question.descriptiveConfig.maxWords
        ) {
          errors.push({
            field: "descriptiveConfig",
            message: "Minimum words cannot be greater than maximum words",
          });
        }
      }
      break;

    case QuestionType.FILE_UPLOAD:
      if (
        "maxFileSize" in question &&
        question.maxFileSize !== undefined &&
        question.maxFileSize <= 0
      ) {
        errors.push({
          field: "maxFileSize",
          message: "Maximum file size must be greater than 0",
        });
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Helper function to get user-friendly error messages
export function getValidationErrorMessages(
  errors: ValidationError[],
): string[] {
  return errors.map((error) => error.message);
}

// Helper function to group errors by field
export function groupErrorsByField(
  errors: ValidationError[],
): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  errors.forEach((error) => {
    if (!grouped[error.field]) {
      grouped[error.field] = [];
    }
    grouped[error.field].push(error.message);
  });

  return grouped;
}
