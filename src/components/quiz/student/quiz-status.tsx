"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  AlertCircle,
  Timer,
} from "lucide-react";

interface QuizStatusProps {
  status:
    | "live"
    | "in-progress"
    | "completed"
    | "missed"
    | "late"
    | "auto-submitted";
  remainingMinutes?: number;
  className?: string;
}

export function QuizStatus({
  status,
  remainingMinutes,
  className,
}: QuizStatusProps) {
  const configs = {
    live: {
      icon: Play,
      label: "Available",
      variant: "default" as const,
      className: "bg-green-500 hover:bg-green-600 text-white",
    },
    "in-progress": {
      icon: Timer,
      label: remainingMinutes ? `${remainingMinutes} min left` : "In Progress",
      variant: "default" as const,
      className: "bg-blue-500 hover:bg-blue-600 text-white animate-pulse",
    },
    completed: {
      icon: CheckCircle2,
      label: "Completed",
      variant: "default" as const,
      className: "bg-emerald-500 hover:bg-emerald-600 text-white",
    },
    missed: {
      icon: XCircle,
      label: "Missed",
      variant: "destructive" as const,
      className: "bg-red-500 hover:bg-red-600 text-white",
    },
    late: {
      icon: AlertCircle,
      label: "Late Submission",
      variant: "default" as const,
      className: "bg-orange-500 hover:bg-orange-600 text-white",
    },
    "auto-submitted": {
      icon: Clock,
      label: "Auto-Submitted",
      variant: "secondary" as const,
      className: "bg-gray-500 hover:bg-gray-600 text-white",
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1 font-medium",
        config.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </Badge>
  );
}
