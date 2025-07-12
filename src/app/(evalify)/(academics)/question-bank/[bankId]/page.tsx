"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Bank, { BankSchema } from "@/repo/bank/bank";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useState, useMemo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { QuestionRenderer } from "@/components/render-questions";
import { Question } from "@/components/render-questions/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebounce } from "@/hooks/use-debounce";

interface Topic {
  id: string;
  name: string;
}

function TopicSidebar({
  topics,
  selectedTopics,
  onTopicToggle,
  onCreateTopic,
  onDeleteTopic,
  onEditTopic,
  isCreating = false,
  bank,
  selectedTopicNames,
}: {
  topics: Topic[];
  selectedTopics: string[];
  onTopicToggle: (topicId: string) => void;
  onCreateTopic: (name: string) => void;
  onDeleteTopic: (topicId: string) => void;
  onEditTopic: (topicId: string, name: string) => void;
  isCreating?: boolean;
  bank?: BankSchema;
  selectedTopicNames?: string[];
}) {
  const [newTopicName, setNewTopicName] = useState("");
  const [editingTopic, setEditingTopic] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleCreateTopic = () => {
    if (newTopicName.trim()) {
      onCreateTopic(newTopicName.trim());
      setNewTopicName("");
    }
  };

  const handleEditTopic = (topicId: string, newName: string) => {
    if (newName.trim()) {
      onEditTopic(topicId, newName.trim());
      setEditingTopic(null);
    }
  };

  const startEditing = (topic: Topic) => {
    setEditingTopic({ id: topic.id, name: topic.name });
  };

  const cancelEditing = () => {
    setEditingTopic(null);
  };

  const getDisplayName = (name: string) => {
    return name.length > 30 ? `${name.slice(0, 30)}...` : name;
  };

  return (
    <TooltipProvider>
      <Card className="w-80 h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] flex flex-col">
        <CardHeader className="flex-shrink-0">
          {bank && (
            <CardTitle className="text-lg break-words">{bank.name}</CardTitle>
          )}
          <Separator />
        </CardHeader>

        {/* Bank Metadata Section */}
        {bank && (
          <div className="px-4 pb-4 flex-shrink-0">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Course Code:</span>
                <span className="font-medium text-foreground">
                  {bank.courseCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Semester:</span>
                <span className="font-medium text-foreground">
                  {bank.semester}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Questions:</span>
                <span className="font-medium text-foreground">
                  {bank.questions}
                </span>
              </div>
            </div>
            {selectedTopicNames && selectedTopicNames.length > 0 && (
              <div className="mt-3">
                <span className="text-xs text-muted-foreground mb-2 block">
                  Selected Topics:
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedTopicNames.map((name, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs break-all max-w-full"
                    >
                      <span className="truncate">{name}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <Separator className="mt-4" />
          </div>
        )}

        {/* Topics Section */}
        <div className="px-4 pb-2 flex-shrink-0">
          <h4 className="text-sm font-semibold text-foreground">
            Topics ({topics.length})
          </h4>
        </div>

        <CardContent className="p-0 flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors group ${
                    selectedTopics.includes(topic.id)
                      ? "bg-accent border-primary"
                      : ""
                  }`}
                >
                  {editingTopic?.id === topic.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editingTopic.name}
                        onChange={(e) =>
                          setEditingTopic({
                            ...editingTopic,
                            name: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleEditTopic(topic.id, editingTopic.name);
                          if (e.key === "Escape") cancelEditing();
                        }}
                        className="text-sm h-8"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          handleEditTopic(topic.id, editingTopic.name)
                        }
                        className="h-8 px-2"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                        className="h-8 px-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex-1 cursor-pointer min-w-0"
                        onClick={() => onTopicToggle(topic.id)}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm font-medium block">
                              {getDisplayName(topic.name)}
                            </span>
                          </TooltipTrigger>
                          {topic.name.length > 30 && (
                            <TooltipContent>
                              <p>{topic.name}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 flex-shrink-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEditing(topic)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteTopic(topic.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t flex-shrink-0">
            <div className="flex gap-2 justify-center items-center">
              <Input
                placeholder="Enter topic name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateTopic();
                }}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleCreateTopic}
                disabled={!newTopicName.trim() || isCreating}
                className=""
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

const VirtualizedQuestionsList = React.forwardRef<
  unknown,
  {
    questions: unknown[];
    allQuestionsCount: number;
    bankId: string;
    router: unknown;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onCreateQuestion: () => void;
  }
>(function VirtualizedQuestionsList(
  {
    questions,
    allQuestionsCount,
    bankId,
    router,
    searchQuery,
    onSearchChange,
    onCreateQuestion,
  },
  ref,
) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Use TanStack Virtual with proper dynamic height measurement
  const virtualizer = useVirtualizer({
    count: questions.length,
    getScrollElement: () => parentRef.current,
    // Simple fallback estimate - actual heights will be measured
    estimateSize: () => 300,
    // Let TanStack Virtual measure the actual height of each question
    measureElement: (element) => element.getBoundingClientRect().height,
    overscan: 3,
    getItemKey: (index) =>
      `question-${(questions[index] as Record<string, unknown>)?.id || index}`,
  });

  React.useImperativeHandle(ref, () => virtualizer, [virtualizer]);

  const items = virtualizer.getVirtualItems();

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Questions ({questions.length}
            {questions.length !== allQuestionsCount &&
              ` of ${allQuestionsCount}`}
            )
          </h3>
          <Button onClick={onCreateQuestion} className="shrink-0">
            Add Question
          </Button>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Search questions, explanations, or topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1"
          />
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => onSearchChange("")}
              size="sm"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery
            ? "No questions match your search criteria"
            : "No questions found in this bank"}
        </div>
      ) : (
        <div
          ref={parentRef}
          className="flex-1 overflow-auto border rounded-lg bg-background"
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {items.map((virtualItem) => {
              const question = questions[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  data-index={virtualItem.index}
                >
                  <div className="p-4 border-b border-border/20">
                    <QuestionRenderer
                      key={`question-${(question as Record<string, unknown>).id}`}
                      question={question as Question}
                      questionNumber={virtualItem.index + 1}
                      config={{
                        mode: "display",
                        showActions: true,
                        showMarks: true,
                        showDifficulty: true,
                        showBloomsTaxonomy: true,
                        showTopics: true,
                        showExplanation: true,
                        showCorrectAnswers: true,
                        readOnly: true,
                      }}
                      actions={{
                        onEdit: (questionId) => {
                          (router as { push: (path: string) => void }).push(
                            `/question-bank/${bankId}/question/${questionId}`,
                          );
                        },
                        onDelete: () => {
                          // Add delete functionality here
                        },
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

export default function BankPage({
  params,
}: {
  params: Promise<{
    bankId: string;
  }>;
}) {
  const param = use(params);
  const { bankId } = param;
  const router = useRouter();
  const { success, error } = useToast();
  const queryClient = useQueryClient();

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce search by 300ms
  const virtualizerRef = useRef<unknown>(null);

  const { data: bank, isLoading: bankLoading } = useQuery({
    queryKey: ["bank", bankId],
    queryFn: () => Bank.getBankById(bankId),
  });

  const { data: topics, isLoading: isLoadingTopics } = useQuery({
    queryKey: ["bankTopics", bankId],
    queryFn: () => Bank.getBankTopics(bankId),
    enabled: !!bank,
  });

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["bankQuestions", bankId, selectedTopics],
    queryFn: () => Bank.getBankQuestions(bankId, selectedTopics),
    enabled: !!bank,
  });

  const createTopicMutation = useMutation({
    mutationFn: (topicName: string) => Bank.addBankTopic(bankId, topicName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankTopics", bankId] });
      queryClient.invalidateQueries({ queryKey: ["bankQuestions", bankId] });
      success("Topic created successfully");
    },
    onError: () => {
      error("Failed to create topic");
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: (topicId: string) => Bank.deleteBankTopic(bankId, topicId),
    onSuccess: (_, topicId) => {
      queryClient.invalidateQueries({ queryKey: ["bankTopics", bankId] });
      setSelectedTopics((prev) => prev.filter((id) => id !== topicId));
      success("Topic deleted successfully");
    },
    onError: () => {
      error("Failed to delete topic");
    },
  });

  const editTopicMutation = useMutation({
    mutationFn: ({ topicId, name }: { topicId: string; name: string }) =>
      Bank.updateBankTopic(bankId, topicId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankTopics", bankId] });
      success("Topic updated successfully");
    },
    onError: () => {
      error("Failed to update topic");
    },
  });

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId],
    );
  };

  const handleCreateQuestion = () => {
    const topicParam = selectedTopics.join(",");
    router.push(
      `/question-bank/${bankId}/question/create?topics=${topicParam}`,
    );
  };

  const handleCreateTopic = (topicName: string) => {
    createTopicMutation.mutate(topicName);
  };

  const handleDeleteTopic = (topicId: string) => {
    deleteTopicMutation.mutate(topicId);
  };

  const handleEditTopic = (topicId: string, name: string) => {
    editTopicMutation.mutate({ topicId, name });
  };

  const filteredQuestions = useMemo(() => {
    if (!questions) return [];

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      return questions.filter(
        (question: unknown) =>
          (question as { question?: string }).question
            ?.toLowerCase()
            .includes(query) ||
          (question as { explanation?: string }).explanation
            ?.toLowerCase()
            .includes(query) ||
          (question as { topics?: Array<{ name?: string }> }).topics?.some(
            (topic: unknown) =>
              (topic as { name?: string }).name?.toLowerCase().includes(query),
          ),
      );
    }

    return questions;
  }, [questions, debouncedSearchQuery]);

  if (bankLoading || isLoadingTopics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!bank || !topics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Bank not found</div>
      </div>
    );
  }

  const selectedTopicNames = selectedTopics
    .map((id) => topics.find((topic) => topic.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  return (
    <div className="flex bg-background h-[calc(100vh-4rem)]">
      {/* Topic Sidebar - Fixed */}
      <div className="border-r sticky top-0 h-[calc(100vh-4rem)]">
        <TopicSidebar
          topics={topics}
          selectedTopics={selectedTopics}
          onTopicToggle={handleTopicToggle}
          onCreateTopic={handleCreateTopic}
          onDeleteTopic={handleDeleteTopic}
          onEditTopic={handleEditTopic}
          isCreating={createTopicMutation.isPending}
          bank={bank}
          selectedTopicNames={selectedTopicNames}
        />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          {/* Questions Content */}
          {isLoadingQuestions ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Loading questions...
            </div>
          ) : questions ? (
            <div className="flex-1 min-h-0">
              <VirtualizedQuestionsList
                questions={filteredQuestions}
                allQuestionsCount={questions.length}
                bankId={bankId}
                router={router}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCreateQuestion={handleCreateQuestion}
                ref={virtualizerRef}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              No questions found in this bank
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
