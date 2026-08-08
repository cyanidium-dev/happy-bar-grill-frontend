"use client";

import { useId } from "react";
import { cn } from "@/utils/cn";

/**
 * Phone field with a locked `+380` prefix — the user only types the 9
 * subscriber digits. `value`/`onChange` deal in those digits only; the full
 * number is `+380${value}`.
 */
export default function PhoneField({
  label,
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (digits: string) => void;
  error?: string;
  required?: boolean;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="relative flex w-full flex-col gap-1.5">
      <label htmlFor={id} className="text-14med text-graphite">
        {label}
        {required && (
          <span className="ml-0.5 text-red" aria-hidden>
            *
          </span>
        )}
      </label>

      <div
        className={cn(
          "flex items-center rounded-sm border bg-white transition duration-300 ease-out",
          error
            ? "border-red focus-within:border-red"
            : "border-grey-dark focus-within:border-navy",
        )}
      >
        <span className="select-none pl-6 pr-1 text-14reg text-graphite md:text-16reg">
          +380
        </span>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={value}
          onChange={(e) => {
            let digits = e.target.value.replace(/\D/g, "");
            // Drop a pasted country code and the trunk "0" — both are already
            // covered by the fixed +380 prefix.
            if (digits.startsWith("380")) digits = digits.slice(3);
            digits = digits.replace(/^0+/, "");
            onChange(digits.slice(0, 9));
          }}
          placeholder="XX XXX XX XX"
          className="w-full rounded-sm bg-transparent py-3 pl-1 pr-5 text-14reg text-graphite placeholder-grey outline-none md:text-16reg"
        />
      </div>

      {error && (
        <p
          id={errorId}
          className="absolute top-full left-0 mt-1 text-12med text-red"
        >
          {error}
        </p>
      )}
    </div>
  );
}
