"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import labQueries from "@/repo/lab-queries/lab-queries";
import { Participant } from "./create-quiz-schema";

interface LabSelectorProps {
  selectedLabs: Participant[];
  onLabsChange: (labs: Participant[]) => void;
}

interface LabResponse {
  id: string;
  name: string;
  block: string;
  ipSubnet: string;
}

export function LabSelector({ selectedLabs, onLabsChange }: LabSelectorProps) {
  const selectedIds = new Set(selectedLabs.map((lab) => lab.id));

  const { data, isLoading } = useQuery<LabResponse[]>({
    queryKey: ["activeLabs"],
    queryFn: labQueries.getActiveLabs,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  const handleSelect = (lab: Participant) => {
    const isSelected = selectedIds.has(lab.id);
    const newLabs = isSelected
      ? selectedLabs.filter((l) => l.id !== lab.id)
      : [...selectedLabs, lab];
    onLabsChange(newLabs);
  };

  const handleRemove = (id: string) => {
    onLabsChange(selectedLabs.filter((lab) => lab.id !== id));
  };

  const labOptions = data
    ? data.map((lab) => ({ id: lab.id, name: `${lab.name} - ${lab.block}` }))
    : [];

  return (
    <div className="space-y-4">
      {/* Lab Selector */}
      <div className="border rounded-lg overflow-hidden">
        <Command>
          <CommandInput placeholder="Search labs..." />
          <CommandList>
            <ScrollArea className="h-64">
              <CommandEmpty>No labs found.</CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  <div className="space-y-2 p-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : (
                  labOptions.map((lab) => {
                    const isSelected = selectedIds.has(lab.id);
                    return (
                      <CommandItem
                        key={lab.id}
                        onSelect={() => handleSelect(lab)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span>{lab.name}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </CommandItem>
                    );
                  })
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </div>

      {/* Selected Labs Display */}
      {selectedLabs.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Selected Labs ({selectedLabs.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedLabs.map((lab) => (
              <Badge
                key={lab.id}
                variant="secondary"
                className="px-3 py-1.5 text-sm"
              >
                {lab.name}
                <button
                  type="button"
                  onClick={() => handleRemove(lab.id)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
