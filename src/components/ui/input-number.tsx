"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputNumberProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type"
  > {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      className,
      value,
      defaultValue,
      onChange,
      placeholder,
      min,
      max,
      step: _step,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState<string>("");
    const [isFocused, setIsFocused] = React.useState(false);
    const hasUserInput = React.useRef(false);

    // Initialize internal value
    React.useEffect(() => {
      if (value !== undefined && value !== null) {
        setInternalValue(value.toString());
        hasUserInput.current = true;
      } else if (!hasUserInput.current && defaultValue !== undefined) {
        setInternalValue("");
      }
    }, [value, defaultValue]);

    const handleFocus = () => {
      setIsFocused(true);
      // Clear the input when focused if it shows the default value OR if current value equals default
      if (
        !hasUserInput.current ||
        (value === defaultValue && defaultValue !== undefined)
      ) {
        setInternalValue("");
      }
    };

    const handleBlur = () => {
      setIsFocused(false);

      // If user didn't enter anything, use default value
      if (internalValue.trim() === "") {
        hasUserInput.current = false;
        if (defaultValue !== undefined) {
          onChange?.(defaultValue);
        } else {
          onChange?.(undefined);
        }
        setInternalValue("");
      } else {
        // Parse and validate the number
        const numValue = parseFloat(internalValue);
        if (!isNaN(numValue)) {
          let finalValue = numValue;

          // Apply min/max constraints
          if (min !== undefined && finalValue < min) {
            finalValue = min;
          }
          if (max !== undefined && finalValue > max) {
            finalValue = max;
          }

          hasUserInput.current = true;
          setInternalValue(finalValue.toString());
          onChange?.(finalValue);
        } else {
          // Invalid number, revert to default or previous valid value
          if (defaultValue !== undefined) {
            onChange?.(defaultValue);
            hasUserInput.current = false;
            setInternalValue("");
          } else if (value !== undefined) {
            setInternalValue(value.toString());
          }
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Allow empty string, numbers, decimal point, and minus sign
      if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
        setInternalValue(newValue);
        hasUserInput.current = newValue !== "";

        // If it's a valid number, trigger onChange immediately for controlled components
        const numValue = parseFloat(newValue);
        if (!isNaN(numValue)) {
          onChange?.(numValue);
        }
      }
    };

    const displayValue = React.useMemo(() => {
      if (isFocused) {
        return internalValue;
      }

      if (hasUserInput.current && internalValue !== "") {
        return internalValue;
      }

      if (value !== undefined && value !== null) {
        return value.toString();
      }

      if (!hasUserInput.current && defaultValue !== undefined && !isFocused) {
        return defaultValue.toString();
      }

      return internalValue;
    }, [isFocused, internalValue, value, defaultValue]);

    return (
      <input
        type="text"
        inputMode="decimal"
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        {...props}
      />
    );
  },
);

InputNumber.displayName = "InputNumber";

export { InputNumber };
