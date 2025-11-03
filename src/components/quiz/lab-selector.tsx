"use client";

import { useQuery } from "@tanstack/react-query";
import { MultiSelect, OptionType } from "@/components/ui/multi-select";
import { Skeleton } from "@/components/ui/skeleton";
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
  const { data, isLoading } = useQuery<LabResponse[]>({
    queryKey: ["activeLabs"],
    queryFn: labQueries.getActiveLabs,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  const labOptions: OptionType[] =
    data?.map((lab) => ({
      label: `${lab.name} - ${lab.block}`,
      value: lab.id,
    })) || [];

  const handleLabsChange = (values: string[]) => {
    const participants: Participant[] = values.map((id) => {
      const lab = data?.find((l) => l.id === id);
      return {
        id,
        name: lab ? `${lab.name} - ${lab.block}` : id,
      };
    });
    onLabsChange(participants);
  };

  if (isLoading) {
    return <Skeleton className="h-[88px] w-full rounded-md" />;
  }

  return (
    <MultiSelect
      options={labOptions}
      selected={selectedLabs.map((lab) => lab.id)}
      onChange={handleLabsChange}
      placeholder="Search labs..."
    />
  );
}
