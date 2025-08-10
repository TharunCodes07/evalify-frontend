"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ScoreSliderProps {
  score: number;
  maxScore: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function ScoreSlider({
  score,
  maxScore,
  onChange,
  disabled = false,
  className,
}: ScoreSliderProps) {
  const handleValueChange = (values: number[]) => {
    if (onChange && !disabled) {
      onChange(values[0]);
    }
  };

  // Generate tick marks for each point
  const ticks = Array.from({ length: maxScore + 1 }, (_, i) => i);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        {/* Slider */}
        <Slider
          value={[score]}
          onValueChange={handleValueChange}
          max={maxScore}
          min={0}
          step={1}
          disabled={disabled}
          className="w-full"
        />

        {/* Tick marks and labels */}
        <div className="flex justify-between mt-2 px-1">
          {ticks.map((tick) => (
            <div key={tick} className="flex flex-col items-center">
              {/* Tick mark */}
              <div
                className={cn(
                  "w-0.5 h-2 transition-colors",
                  tick <= score ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
              {/* Label */}
              <span
                className={cn(
                  "text-xs mt-1 transition-colors",
                  tick <= score
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {tick}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Score display */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Score:</span>
        <span className="font-medium">
          {score} / {maxScore}
        </span>
      </div>
    </div>
  );
}
