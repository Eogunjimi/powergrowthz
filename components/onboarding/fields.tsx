"use client";

import { AlertCircle, Check } from "lucide-react";
import { useId } from "react";

/* ------------------------------------------------------------------ */
/* Field wrapper                                                       */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  htmlFor,
  required,
  optional,
  helper,
  error,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="label-base">
        {label}{" "}
        {required && <span className="font-medium text-accent-hover">*</span>}
        {optional && (
          <span className="ml-1 text-[12px] font-medium text-muted">
            (optional)
          </span>
        )}
      </label>
      {children}
      {helper && !error && <p className="helper-base">{helper}</p>}
      {error && (
        <p
          role="alert"
          className="mt-2 flex animate-fade-in items-start gap-1.5 text-[13px] font-medium text-red-600"
        >
          <AlertCircle className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Text input                                                          */
/* ------------------------------------------------------------------ */

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  autoComplete,
  inputMode,
  maxLength,
  onBlur,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "url" | "numeric";
  maxLength?: number;
  onBlur?: () => void;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      maxLength={maxLength}
      onBlur={onBlur}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={error || undefined}
      className={`input-base ${error ? "input-error" : "input-ok"}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Textarea                                                            */
/* ------------------------------------------------------------------ */

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  maxLength,
  onBlur,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  error?: boolean;
  maxLength?: number;
  onBlur?: () => void;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      maxLength={maxLength}
      onBlur={onBlur}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={error || undefined}
      className={`input-base resize-y ${error ? "input-error" : "input-ok"}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Checkbox cards                                                      */
/* ------------------------------------------------------------------ */

export function CheckboxCards({
  options,
  selected,
  onToggle,
  columns = 2,
  error,
  ariaLabel,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (option: string) => void;
  columns?: 1 | 2;
  error?: boolean;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`grid gap-2.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}
    >
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <label
            key={option}
            className={`group flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3.5 transition-all duration-200 sm:p-4
              ${
                checked
                  ? "border-accent bg-accent-soft/50 shadow-soft"
                  : error
                    ? "border-red-300 hover:border-red-400"
                    : "border-line hover:border-[#D0D5DD] hover:shadow-soft"
              }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={() => onToggle(option)}
            />
            <span
              aria-hidden="true"
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200
                ${
                  checked
                    ? "border-accent bg-accent text-white"
                    : "border-[#D0D5DD] bg-white group-hover:border-accent/60"
                }`}
            >
              {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
            <span
              className={`text-[14px] font-medium leading-snug sm:text-[15px] ${
                checked ? "text-ink" : "text-[#344054]"
              }`}
            >
              {option}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Radio cards                                                         */
/* ------------------------------------------------------------------ */

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export function RadioCards({
  options,
  value,
  onChange,
  name,
  error,
  columns = 1,
}: {
  options: RadioOption[];
  value: string;
  onChange: (v: string) => void;
  name: string;
  error?: boolean;
  columns?: 1 | 2;
}) {
  const generatedId = useId();
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={`grid gap-2.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}
    >
      {options.map((option) => {
        const checked = value === option.value;
        const id = `${generatedId}-${option.value}`;
        return (
          <label
            key={option.value}
            htmlFor={id}
            className={`group flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-3.5 transition-all duration-200 sm:p-4
              ${
                checked
                  ? "border-accent bg-accent-soft/50 shadow-soft"
                  : error
                    ? "border-red-300 hover:border-red-400"
                    : "border-line hover:border-[#D0D5DD] hover:shadow-soft"
              }`}
            >
            <input
              id={id}
              type="radio"
              name={name}
              className="sr-only"
              checked={checked}
              onChange={() => onChange(option.value)}
            />
            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200
                ${
                  checked
                    ? "border-accent"
                    : "border-[#D0D5DD] group-hover:border-accent/60"
                }`}
            >
              {checked && (
                <span className="h-2.5 w-2.5 animate-check-pop rounded-full bg-accent" />
              )}
            </span>
            <span>
              <span
                className={`block text-[14px] font-medium leading-snug sm:text-[15px] ${
                  checked ? "text-ink" : "text-[#344054]"
                }`}
              >
                {option.label}
              </span>
              {option.description && (
                <span className="mt-0.5 block text-[13px] text-muted">
                  {option.description}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading inside a step                                       */
/* ------------------------------------------------------------------ */

export function QuestionHeading({
  children,
  required,
  optional,
}: {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <h3 className="text-[17px] font-bold leading-snug text-ink sm:text-lg">
      {children}{" "}
      {required && <span className="font-semibold text-accent-hover">*</span>}
      {optional && (
        <span className="ml-1 text-[13px] font-medium text-muted">
          (optional)
        </span>
      )}
    </h3>
  );
}

export function QuestionError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p
      role="alert"
      className="mt-2 flex animate-fade-in items-start gap-1.5 text-[13px] font-medium text-red-600"
    >
      <AlertCircle className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
      {error}
    </p>
  );
}
