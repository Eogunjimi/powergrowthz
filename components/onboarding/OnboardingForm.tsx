"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Info, ShieldAlert } from "lucide-react";
import {
  INITIAL_DATA,
  STEPS,
  type OnboardingData,
  type StepErrors,
  type SubmitResponse,
} from "@/types/onboarding";
import { validateStep } from "@/lib/validation";
import ProgressIndicator from "./ProgressIndicator";
import StepBusinessDetails from "./StepBusinessDetails";
import StepBusiness from "./StepBusiness";
import StepDifferentiators from "./StepDifferentiators";
import StepProducts from "./StepProducts";
import StepBrand from "./StepBrand";
import StepOnlinePresence from "./StepOnlinePresence";
import StepFinalDetails from "./StepFinalDetails";
import FormNavigation from "./FormNavigation";
import SuccessScreen from "./SuccessScreen";

const DRAFT_KEY = "pgz-onboarding-draft-v1";

const STEP_DESCRIPTIONS = [
  "Let's start with some basic information about you and your business.",
  "Help us understand what your business does and where you want to go.",
  "These answers will help us show potential customers why they should trust your business.",
  "Help us understand what customers can expect when they work with you.",
  "Let's capture the message and personality you want your website to communicate.",
  "Real photos, reviews and social media links help make your website more trustworthy.",
  "One final opportunity to tell us anything important about your business or the website you want us to build.",
];

const STEP_TITLES = [
  "Your Business Details",
  "Tell Us About Your Solar Business",
  "What Makes Your Business Special?",
  "Products, Pricing & Installation",
  "Your Brand & Website Content",
  "Your Photos & Online Presence",
  "Almost Done!",
];

/** Field name → step index, used to route server-side errors to the right step. */
const FIELD_STEP: Record<string, number> = {
  businessName: 0, firstName: 0, lastName: 0, businessEmail: 0,
  ownerPhone: 0, customerPhone: 0, whatsappPhone: 0,
  businessDescription: 1, services: 1, otherService: 1, customers: 1,
  otherCustomer: 1, serviceAreas: 1, businessLocation: 1,
  chooseReasons: 2, otherReason: 2, differentiator: 2, certificates: 2,
  certificateFiles: 2, hasWarranty: 2, warrantyDetails: 2,
  solarBrands: 3, packagesType: 3, packageDetails: 3, paymentPlans: 3,
  paymentPlanDetails: 3, installationProcess: 3, getStarted: 3,
  keyMessage: 4, tagline: 4, referenceWebsites: 4, teamMembers: 4, teamPhotos: 4,
  hasLogo: 5, logoFile: 5, installationPhotos: 5, hasTestimonials: 5,
  testimonials: 5, googleProfileUrl: 5, socials: 5, hasWebsite: 5, websiteUrl: 5,
  faqs: 6, additionalInfo: 6, preferredDelivery: 6,
};

function loadDraft(): { data: OnboardingData; step: number; maxVisited: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      data: OnboardingData;
      step: number;
      maxVisited: number;
    };
    if (!parsed?.data || typeof parsed.data.businessName !== "string") return null;
    return {
      data: { ...INITIAL_DATA, ...parsed.data },
      step: Math.min(Math.max(parsed.step ?? 0, 0), STEPS.length - 1),
      maxVisited: Math.min(
        Math.max(parsed.maxVisited ?? parsed.step ?? 0, 0),
        STEPS.length - 1
      ),
    };
  } catch {
    return null;
  }
}

export default function OnboardingForm() {
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [errors, setErrors] = useState<StepErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const [stepKey, setStepKey] = useState(0); // re-trigger step enter animation
  const submittingRef = useRef(false);
  const formTopRef = useRef<HTMLDivElement>(null);

  /* ---------------- Draft persistence ---------------- */

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setData(draft.data);
      setCurrentStep(draft.step);
      setMaxVisitedStep(draft.maxVisited);
      setDraftRestored(true);
    }
  }, []);

  useEffect(() => {
    if (submittedName) return; // don't persist after success
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ data, step: currentStep, maxVisited: maxVisitedStep })
      );
    } catch {
      // Storage full / unavailable — non-fatal.
    }
  }, [data, currentStep, maxVisitedStep, submittedName]);

  /* ---------------- State helpers ---------------- */

  const update = useCallback((patch: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...patch }));
    // Clear errors for the fields being edited.
    setErrors((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const key of Object.keys(patch)) {
        for (const errKey of Object.keys(next)) {
          if (errKey === key || errKey.startsWith(`${key}.`)) {
            delete next[errKey];
            changed = true;
          }
        }
      }
      return changed ? next : prev;
    });
  }, []);

  const scrollToFormTop = useCallback(() => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /* ---------------- Navigation ---------------- */

  const goToStep = useCallback(
    (step: number) => {
      setCurrentStep(step);
      setMaxVisitedStep((prev) => Math.max(prev, step));
      setErrors({});
      setSubmitError(null);
      setStepKey((k) => k + 1);
      scrollToFormTop();
    },
    [scrollToFormTop]
  );

  const handleNext = useCallback(() => {
    const stepErrors = validateStep(currentStep, data);
    if (stepErrors) {
      setErrors(stepErrors);
      scrollToFormTop();
      return;
    }
    setErrors({});
    goToStep(Math.min(currentStep + 1, STEPS.length - 1));
  }, [currentStep, data, goToStep, scrollToFormTop]);

  const handleBack = useCallback(() => {
    goToStep(Math.max(currentStep - 1, 0));
  }, [currentStep, goToStep]);

  /* ---------------- Submission ---------------- */

  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();
      if (submittingRef.current) return; // prevent duplicate submissions
      setSubmitError(null);

      // 1. Validate every step; jump to the first invalid one.
      for (let step = 0; step < STEPS.length; step++) {
        const stepErrors = validateStep(step, data);
        if (stepErrors) {
          setErrors(stepErrors);
          if (step !== currentStep) goToStep(step);
          else scrollToFormTop();
          return;
        }
      }

      submittingRef.current = true;
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = (await res.json().catch(() => null)) as SubmitResponse | null;

        if (res.ok && json?.ok) {
          setSubmittedName(data.firstName.trim() || "friend");
          try {
            window.localStorage.removeItem(DRAFT_KEY);
          } catch {
            /* ignore */
          }
          scrollToFormTop();
        } else {
          // Route server field errors back to the right step if possible.
          if (json?.fieldErrors && Object.keys(json.fieldErrors).length > 0) {
            setErrors(json.fieldErrors);
            const firstKey = Object.keys(json.fieldErrors)[0];
            const step = FIELD_STEP[firstKey.split(".")[0]];
            if (typeof step === "number" && step !== currentStep) {
              goToStep(step);
            } else {
              scrollToFormTop();
            }
            setSubmitError(
              json.error ??
                "Some answers need attention. Please review the highlighted fields and try again."
            );
          } else {
            setSubmitError(
              json?.error ??
                "Something went wrong while sending your information. Your answers have not been lost. Please try again."
            );
          }
        }
      } catch {
        setSubmitError(
          "Something went wrong while sending your information. Your answers have not been lost. Please try again."
        );
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [data, currentStep, goToStep, scrollToFormTop]
  );

  const handleReset = useCallback(() => {
    setData(INITIAL_DATA);
    setCurrentStep(0);
    setMaxVisitedStep(0);
    setErrors({});
    setSubmitError(null);
    setSubmittedName(null);
    setDraftRestored(false);
    setStepKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ---------------- Render ---------------- */

  if (submittedName) {
    return <SuccessScreen ownerName={submittedName} onReset={handleReset} />;
  }

  const stepProps = { data, update, errors };

  return (
    <div ref={formTopRef} className="scroll-mt-6">
      <ProgressIndicator
        currentStep={currentStep}
        maxVisitedStep={maxVisitedStep}
        onStepClick={goToStep}
      />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-8 lg:p-10"
      >
        {/* Step header */}
        <div key={`header-${stepKey}`} className="animate-fade-in-up mb-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
            Step {String(currentStep + 1).padStart(2, "0")} — {STEPS[currentStep]}
          </p>
          <h2 className="mt-2 text-[22px] font-extrabold leading-tight tracking-tight text-ink sm:text-[26px]">
            {STEP_TITLES[currentStep]}
          </h2>
          <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-muted sm:text-[15px]">
            {STEP_DESCRIPTIONS[currentStep]}
          </p>
        </div>

        {/* Draft restored notice */}
        {draftRestored && currentStep === 0 && (
          <div className="mb-6 flex animate-fade-in items-start gap-2.5 rounded-xl border border-accent/30 bg-accent-soft/40 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-hover" aria-hidden="true" />
            <p className="text-[13px] leading-relaxed text-[#344054]">
              Welcome back — we restored your previous answers on this device.
            </p>
          </div>
        )}

        {/* Steps */}
        <div key={`step-${stepKey}`} className="animate-fade-in-up">
          {currentStep === 0 && <StepBusinessDetails {...stepProps} />}
          {currentStep === 1 && <StepBusiness {...stepProps} />}
          {currentStep === 2 && <StepDifferentiators {...stepProps} />}
          {currentStep === 3 && <StepProducts {...stepProps} />}
          {currentStep === 4 && <StepBrand {...stepProps} />}
          {currentStep === 5 && <StepOnlinePresence {...stepProps} />}
          {currentStep === 6 && <StepFinalDetails {...stepProps} />}
        </div>

        {/* Honeypot — hidden from humans, irresistible to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company_website_field">Company website (do not fill)</label>
          <input
            id="company_website_field"
            name="company_website_field"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={data.company_website_field}
            onChange={(e) => update({ company_website_field: e.target.value })}
          />
        </div>

        <FormNavigation
          currentStep={currentStep}
          onBack={handleBack}
          onNext={handleNext}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onRetry={() => void handleSubmit()}
        />
      </form>

      {/* Trust / privacy note */}
      <div className="mt-6 flex items-start justify-center gap-2.5 px-2 text-center sm:justify-start sm:text-left">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <p className="max-w-xl text-[12.5px] leading-relaxed text-muted">
          Your information is sent securely to the PowerGrowthz team and used
          only to build your website. Your answers are also saved on this
          device so you won&apos;t lose progress if you get interrupted.
        </p>
      </div>
    </div>
  );
}
