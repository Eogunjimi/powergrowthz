"use client";

import { Check } from "lucide-react";
import { STEPS } from "@/types/onboarding";

export default function ProgressIndicator({
  currentStep,
  onStepClick,
  maxVisitedStep,
}: {
  /** 0-indexed current step */
  currentStep: number;
  onStepClick?: (step: number) => void;
  /** Highest step the user has validly reached — only these are clickable. */
  maxVisitedStep: number;
}) {
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="mb-6 sm:mb-8">
      {/* Mobile: compact */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[13px] font-bold text-ink">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-[13px] font-medium text-muted">
            {STEPS[currentStep]}
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label={`Step ${currentStep + 1} of ${STEPS.length}: ${STEPS[currentStep]}`}
        >
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Desktop: full step list */}
      <div className="hidden sm:block">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm font-bold text-ink">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-sm text-muted">{Math.round(progress)}% complete</span>
        </div>
        <div
          className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label={`Step ${currentStep + 1} of ${STEPS.length}: ${STEPS[currentStep]}`}
        >
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ol className="grid grid-cols-4 gap-x-3 gap-y-2.5 lg:grid-cols-7">
          {STEPS.map((label, index) => {
            const done = index < currentStep;
            const active = index === currentStep;
            const clickable = onStepClick && index <= maxVisitedStep && !active;
            const number = String(index + 1).padStart(2, "0");
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && onStepClick?.(index)}
                  aria-current={active ? "step" : undefined}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors duration-200
                    ${clickable ? "cursor-pointer hover:bg-white" : "cursor-default"}
                    ${active ? "bg-white shadow-soft" : ""}`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-300
                      ${
                        done
                          ? "bg-accent text-white"
                          : active
                            ? "bg-ink text-accent"
                            : "border border-line bg-white text-muted"
                      }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : number}
                  </span>
                  <span
                    className={`truncate text-[12.5px] leading-tight ${
                      active
                        ? "font-bold text-ink"
                        : done
                          ? "font-medium text-[#344054]"
                          : "text-muted"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
