"use client";

import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";
import { STEPS } from "@/types/onboarding";

export default function FormNavigation({
  currentStep,
  onBack,
  onNext,
  isSubmitting,
  submitError,
  onRetry,
}: {
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  onRetry: () => void;
}) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  return (
    <div className="mt-8 border-t border-line pt-6">
      {submitError && (
        <div
          role="alert"
          className="mb-5 animate-fade-in rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <p className="text-[14px] font-medium leading-relaxed text-red-700">
            {submitError}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            TRY AGAIN
          </button>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirst || isSubmitting}
          className={`btn-secondary w-full sm:w-auto ${isFirst ? "invisible" : ""}`}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>

        {isLast ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending your information…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                SUBMIT MY INFORMATION
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="btn-primary w-full sm:w-auto"
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {!isLast && (
        <p className="mt-4 text-center text-[12.5px] text-muted sm:text-right">
          Your answers are kept as you move between steps.
        </p>
      )}
    </div>
  );
}
