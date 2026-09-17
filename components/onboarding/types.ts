import type { OnboardingData, StepErrors } from "@/types/onboarding";

export interface StepProps {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  errors: StepErrors;
}
