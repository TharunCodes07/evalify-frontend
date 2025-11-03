"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useVirtualizer } from "@tanstack/react-virtual";

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
}

function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Select...",
}: MultiSelectProps) {
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  const selectedOptions = selected
    .map((value) => options.find((option) => option.value === value))
    .filter((option): option is OptionType => option !== undefined);

  const filteredOptions = React.useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
  }, [options, inputValue]);

  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    measureElement: (el) => (el as HTMLElement).getBoundingClientRect().height,
    overscan: 8,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      className={cn("group w-full rounded-md border border-input", className)}
      onKeyDown={(e) => {
        // Prevent Enter from bubbling up to form
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {selectedOptions.length > 0 && (
        <div className="flex gap-1 flex-wrap p-2">
          {selectedOptions.map((option) => (
            <Badge
              variant="secondary"
              key={option.value}
              className="mr-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemove(option.value);
              }}
            >
              {option.label}
              <button
                type="button"
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove(option.value);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(option.value);
                }}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Command>
        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
        />
        <CommandList>
          {filteredOptions.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup>
              <div
                ref={parentRef}
                className="h-40 overflow-auto"
                role="presentation"
              >
                <div
                  style={{
                    height: virtualizer.getTotalSize(),
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {virtualItems.map((vi) => {
                    const option = filteredOptions[vi.index];
                    const isSelected = selected.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        ref={virtualizer.measureElement}
                        data-index={vi.index}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          transform: `translateY(${vi.start}px)`,
                        }}
                      >
                        <CommandItem
                          onSelect={() => handleSelect(option.value)}
                          className="cursor-pointer"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelect(option.value);
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}

export { MultiSelect };
