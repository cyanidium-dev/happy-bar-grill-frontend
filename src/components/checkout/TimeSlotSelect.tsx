"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import LocaleSwitcherArrowIcon from "@/components/shared/icons/LocaleSwitcherArrowIcon";
import { cn } from "@/utils/cn";

type TimeSlotSelectProps = {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Custom time-slot dropdown styled like project form fields
 * (rounded-sm border, navy focus) with a soft list panel.
 */
export default function TimeSlotSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
  required = false,
  error,
  emptyMessage,
  disabled = false,
  className,
}: TimeSlotSelectProps) {
  const generatedId = useId();
  const listId = `${generatedId}-list`;
  const errorId = `${generatedId}-error`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const isDisabled = disabled || options.length === 0;
  // Derived: close visually when disabled without syncing via an effect.
  const isOpen = open && !isDisabled;

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        close();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <div
      ref={rootRef}
      className={cn("relative flex w-full flex-col gap-1.5", className)}
    >
      <label htmlFor={generatedId} className="text-14med text-graphite">
        {label}
        {required && (
          <span className="ml-0.5 text-red" aria-hidden>
            *
          </span>
        )}
      </label>

      <button
        id={generatedId}
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-describedby={error ? errorId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-sm border bg-white py-3 pl-6 pr-4 text-left text-14reg outline-none transition duration-300 ease-out md:text-16reg",
          error
            ? "border-red focus-visible:border-red"
            : isOpen
              ? "border-navy"
              : "border-grey-dark hover:border-navy/60 focus-visible:border-navy",
          isDisabled && "cursor-not-allowed opacity-60",
          !isDisabled && "cursor-pointer",
        )}
      >
        <span className={cn(value ? "text-graphite" : "text-grey")}>
          {value || placeholder}
        </span>
        <LocaleSwitcherArrowIcon
          className={cn(
            "size-4 shrink-0 text-navy transition duration-300 ease-out",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        id={listId}
        role="listbox"
        aria-hidden={!isOpen}
        className={cn(
          "absolute top-full left-0 z-20 mt-1 max-h-56 w-full overflow-y-auto border border-navy/10 bg-white shadow-md scrollbar-brand transition duration-300 ease-out",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        {options.map((slot) => {
          const selected = slot === value;
          return (
            <button
              key={slot}
              type="button"
              role="option"
              aria-selected={selected}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => {
                onChange(slot);
                close();
              }}
              className={cn(
                "flex w-full cursor-pointer items-center px-6 py-3 text-left text-14reg transition-colors duration-200 md:text-16reg",
                selected
                  ? "bg-navy/5 text-navy"
                  : "text-graphite hover:bg-beige/70 hover:text-navy",
              )}
            >
              {slot}
            </button>
          );
        })}
      </div>

      {options.length === 0 && emptyMessage ? (
        <p className="text-12med text-grey-dark">{emptyMessage}</p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          className="absolute top-full left-0 right-0 mt-1 text-12med text-red"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
