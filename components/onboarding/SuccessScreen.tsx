"use client";

import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function SuccessScreen({
  ownerName,
  onReset,
}: {
  ownerName: string;
  onReset: () => void;
}) {
  return (
    <div className="animate-fade-in-up rounded-2xl border border-line bg-white p-8 text-center shadow-card sm:p-14">
      <div className="mx-auto flex h-20 w-20 animate-check-pop items-center justify-center rounded-full bg-accent-soft">
        <CheckCircle2 className="h-11 w-11 text-accent-hover" aria-hidden="true" />
      </div>

      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
        Submission received
      </p>

      <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        YOUR INFORMATION HAS BEEN RECEIVED
      </h2>

      <p className="mx-auto mt-4 max-w-md text-[16px] font-semibold text-ink">
        Thank you, {ownerName}.
      </p>

      <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-muted">
        We&apos;ve received your business information and our team will review
        it.
      </p>
      <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-muted">
        You can now continue with your day. If we need anything else, we&apos;ll
        contact you.
      </p>

      <div className="mt-6 flex items-center justify-center gap-2 text-[13px] font-medium text-muted">
        <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
        We&apos;ll be in touch soon
      </div>

      <button
        type="button"
        onClick={onReset}
        className="btn-primary mt-9 w-full sm:w-auto"
      >
        BACK TO POWERGROWTHZ
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
