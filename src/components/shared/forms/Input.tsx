"use client";

import { useId, type ComponentPropsWithRef } from "react";
import { cn } from "@/utils/cn";

type InputProps = ComponentPropsWithRef<"input"> & {
  label?: string;
  /** Validation message; also flips the field into its error style. */
  error?: string;
  /** Helper text shown under the field when there is no error. */
  hint?: string;
  /** Marks the field required and renders a red asterisk next to the label. */
  required?: boolean;
  wrapperClassName?: string;
};

/**
 * Accessible text field. Works with native forms or any form library
 * (react-hook-form / formik) via the forwarded `ref` and native props.
 * React 19: `ref` is a normal prop, so no `forwardRef` needed.
 */
export default function Input({
  label,
  error,
  hint,
  required = false,
  id,
  className,
  wrapperClassName,
  ref,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div
      className={cn("relative flex w-full flex-col gap-1.5", wrapperClassName)}
    >
      {label && (
        <label htmlFor={inputId} className="text-14med text-graphite">
          {label}
          {required && (
            <span className="ml-0.5 text-red" aria-hidden>
              *
            </span>
          )}
        </label>
      )}

      <input
        id={inputId}
        ref={ref}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full rounded-sm border bg-white py-3 pl-6 pr-5 text-14reg text-graphite placeholder-grey outline-none transition duration-300 ease-out md:text-16reg",
          error
            ? "border-red focus:border-red"
            : "border-grey-dark focus:border-navy",
          className,
        )}
        {...rest}
      />

      {error ? (
        <p
          id={errorId}
          className="absolute top-full left-0 mt-1 text-12med text-red"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-12med text-grey-dark">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
