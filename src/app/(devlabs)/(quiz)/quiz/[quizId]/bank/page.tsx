"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import quizQueries from "@/repo/quiz-queries/quiz-queries";
import { BankSummary } from "@/types/bank";
import { BankQuestionSection } from "@/components/quiz/bank-question-section";

export default function AddQuestionsFromBankPage() {
  const params = useParams();
  const router = useRouter();
  const { toast, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const quizId = params.quizId as string;

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedBankIds, setSelectedBankIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedQuestions, setSelectedQuestions] = useState<
    Map<string, Set<string>>
  >(new Map());
  const [randomCounts, setRandomCounts] = useState<Map<string, number>>(
    new Map(),
  );
  const [activeBank, setActiveBank] = useState<string | null>(null);

  // Store selected banks with their metadata
  const [selectedBanksMetadata, setSelectedBanksMetadata] = useState<
    Map<string, BankSummary>
  >(new Map());

  // Search banks - only trigger if query is at least 1 character
  const { data: banks = [], isLoading: banksLoading } = useQuery({
    queryKey: ["quiz", quizId, "banks", debouncedSearchQuery],
    queryFn: () => quizQueries.searchBanksForQuiz(quizId, debouncedSearchQuery),
    enabled: debouncedSearchQuery.length >= 1,
  });

  const bulkAddMutation = useMutation({
    mutationFn: async () => {
      const promises = Array.from(selectedQuestions.entries())
        .filter(([_, qIds]) => qIds.size > 0)
        .map(([bankId, questionIds]) =>
          quizQueries.bulkAddQuestionsToQuiz(quizId, {
            bankId,
            questionIds: Array.from(questionIds),
          }),
        );
      await Promise.all(promises);
    },
    onSuccess: () => {
      toast("Questions added successfully!");
      // Invalidate both quiz details and questions list
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
      router.push(`/quiz/${quizId}`);
    },
    onError: (error: Error) => {
      toastError(
        "Failed to add questions: " + (error.message || "Unknown error"),
      );
    },
  });

  // Handle bank selection
  const toggleBankSelection = (bankId: string, bankMetadata?: BankSummary) => {
    const newSelected = new Set(selectedBankIds);
    const newMetadata = new Map(selectedBanksMetadata);

    if (newSelected.has(bankId)) {
      newSelected.delete(bankId);
      newMetadata.delete(bankId);
      selectedQuestions.delete(bankId);
      randomCounts.delete(bankId);
    } else {
      newSelected.add(bankId);
      if (bankMetadata) {
        newMetadata.set(bankId, bankMetadata);
      }
      if (!activeBank) setActiveBank(bankId);
    }

    setSelectedBankIds(newSelected);
    setSelectedBanksMetadata(newMetadata);
  };

  // Remove a selected bank
  const removeBankSelection = (bankId: string) => {
    const newSelected = new Set(selectedBankIds);
    const newMetadata = new Map(selectedBanksMetadata);
    newSelected.delete(bankId);
    newMetadata.delete(bankId);

    const newQuestions = new Map(selectedQuestions);
    newQuestions.delete(bankId);

    const newCounts = new Map(randomCounts);
    newCounts.delete(bankId);

    setSelectedBankIds(newSelected);
    setSelectedBanksMetadata(newMetadata);
    setSelectedQuestions(newQuestions);
    setRandomCounts(newCounts);

    // Update active bank if removed
    if (activeBank === bankId) {
      const remaining = Array.from(newSelected);
      setActiveBank(remaining.length > 0 ? remaining[0] : null);
    }
  };

  // Handle question selection
  const toggleQuestionSelection = (bankId: string, questionId: string) => {
    const newMap = new Map(selectedQuestions);
    const bankSelections = newMap.get(bankId) || new Set<string>();

    if (bankSelections.has(questionId)) {
      bankSelections.delete(questionId);
    } else {
      bankSelections.add(questionId);
    }

    newMap.set(bankId, bankSelections);
    setSelectedQuestions(newMap);
  };

  // Get total selected count
  const totalSelected = useMemo(() => {
    let total = 0;
    selectedQuestions.forEach((ids) => {
      total += ids.size;
    });
    return total;
  }, [selectedQuestions]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Add Questions from Bank</h1>
          <p className="text-muted-foreground">
            Select banks and pick questions to add to your quiz
          </p>
        </div>
        <Button
          onClick={() => bulkAddMutation.mutate()}
          disabled={totalSelected === 0 || bulkAddMutation.isPending}
          className="w-full sm:w-auto"
        >
          {bulkAddMutation.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add {totalSelected} Question{totalSelected !== 1 ? "s" : ""}
            </>
          )}
        </Button>
      </div>

      {/* Bank Search */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Search Question Banks</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Search and select question banks to pick questions from
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search banks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {banksLoading ? (
          <div className="space-y-2 border rounded-lg p-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <Skeleton className="h-5 w-5 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : debouncedSearchQuery.length < 1 ? (
          <p className="text-center text-muted-foreground py-8">
            Start typing to search banks
          </p>
        ) : banks.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No banks found matching &quot;{debouncedSearchQuery}&quot;
          </p>
        ) : (
          <div className="grid gap-2 max-h-[300px] overflow-y-auto border rounded-lg p-2">
            {banks.map((bank) => {
              const isSelected = selectedBankIds.has(bank.id);
              return (
                <div
                  key={bank.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer group"
                  onClick={() => toggleBankSelection(bank.id, bank)}
                >
                  <div className="shrink-0">
                    {isSelected ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{bank.name}</p>
                    {bank.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {bank.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      by {bank.createdBy}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Banks Display */}
      {selectedBankIds.size > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Selected Banks</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Banks you&apos;ve chosen to pick questions from
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from(selectedBanksMetadata.entries()).map(
              ([bankId, bank]) => {
                const selectedCount = selectedQuestions.get(bankId)?.size || 0;
                return (
                  <div
                    key={bankId}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{bank.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedCount > 0
                          ? `${selectedCount} selected`
                          : "No questions selected"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => removeBankSelection(bankId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}

      {/* Selected Banks - Question Selection */}
      {selectedBankIds.size > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Select Questions</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose specific questions or pick random ones from each bank
            </p>
          </div>

          {selectedBankIds.size === 1 ? (
            // Single bank - no tabs
            Array.from(selectedBanksMetadata.entries()).map(
              ([bankId, bank]) => (
                <BankQuestionSection
                  key={bankId}
                  quizId={quizId}
                  bankId={bankId}
                  bank={bank}
                  selectedQuestions={selectedQuestions.get(bankId) || new Set()}
                  onToggleQuestion={(qId) =>
                    toggleQuestionSelection(bankId, qId)
                  }
                  randomCount={randomCounts.get(bankId) || 0}
                  onRandomCountChange={(count) => {
                    const newCounts = new Map(randomCounts);
                    newCounts.set(bankId, count);
                    setRandomCounts(newCounts);
                  }}
                  onSelectAll={(questions) => {
                    const newMap = new Map(selectedQuestions);
                    newMap.set(bankId, new Set(questions.map((q) => q.id!)));
                    setSelectedQuestions(newMap);
                  }}
                  onDeselectAll={() => {
                    const newMap = new Map(selectedQuestions);
                    newMap.set(bankId, new Set());
                    setSelectedQuestions(newMap);
                  }}
                  onPickRandom={(questions) => {
                    const count = randomCounts.get(bankId) || 0;
                    if (count <= 0 || count > questions.length) {
                      toastError(
                        `Please enter a number between 1 and ${questions.length}`,
                      );
                      return;
                    }
                    const shuffled = [...questions].sort(
                      () => Math.random() - 0.5,
                    );
                    const selected = shuffled.slice(0, count);
                    const newMap = new Map(selectedQuestions);
                    newMap.set(bankId, new Set(selected.map((q) => q.id!)));
                    setSelectedQuestions(newMap);
                  }}
                />
              ),
            )
          ) : (
            // Multiple banks - show tabs
            <Tabs
              value={activeBank || Array.from(selectedBankIds)[0]}
              onValueChange={setActiveBank}
            >
              <TabsList className="inline-flex w-auto">
                {Array.from(selectedBanksMetadata.entries()).map(
                  ([bankId, bank]) => {
                    const selected = selectedQuestions.get(bankId)?.size || 0;
                    return (
                      <TabsTrigger key={bankId} value={bankId}>
                        {bank.name}
                        {selected > 0 && ` (${selected})`}
                      </TabsTrigger>
                    );
                  },
                )}
              </TabsList>

              {Array.from(selectedBanksMetadata.entries()).map(
                ([bankId, bank]) => (
                  <TabsContent
                    key={bankId}
                    value={bankId}
                    className="space-y-4"
                  >
                    <BankQuestionSection
                      quizId={quizId}
                      bankId={bankId}
                      bank={bank}
                      selectedQuestions={
                        selectedQuestions.get(bankId) || new Set()
                      }
                      onToggleQuestion={(qId) =>
                        toggleQuestionSelection(bankId, qId)
                      }
                      randomCount={randomCounts.get(bankId) || 0}
                      onRandomCountChange={(count) => {
                        const newCounts = new Map(randomCounts);
                        newCounts.set(bankId, count);
                        setRandomCounts(newCounts);
                      }}
                      onSelectAll={(questions) => {
                        const newMap = new Map(selectedQuestions);
                        newMap.set(
                          bankId,
                          new Set(questions.map((q) => q.id!)),
                        );
                        setSelectedQuestions(newMap);
                      }}
                      onDeselectAll={() => {
                        const newMap = new Map(selectedQuestions);
                        newMap.set(bankId, new Set());
                        setSelectedQuestions(newMap);
                      }}
                      onPickRandom={(questions) => {
                        const count = randomCounts.get(bankId) || 0;
                        if (count <= 0 || count > questions.length) {
                          toastError(
                            `Please enter a number between 1 and ${questions.length}`,
                          );
                          return;
                        }
                        const shuffled = [...questions].sort(
                          () => Math.random() - 0.5,
                        );
                        const selected = shuffled.slice(0, count);
                        const newMap = new Map(selectedQuestions);
                        newMap.set(bankId, new Set(selected.map((q) => q.id!)));
                        setSelectedQuestions(newMap);
                      }}
                    />
                  </TabsContent>
                ),
              )}
            </Tabs>
          )}
        </div>
      )}
    </div>
  );
}
