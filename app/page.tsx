import { Clock, ShieldCheck, Sun } from "lucide-react";
import OnboardingForm from "@/components/onboarding/OnboardingForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink sm:h-11 sm:w-11">
              <Sun className="h-5 w-5 text-accent sm:h-6 sm:w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="text-[17px] font-extrabold leading-tight tracking-[0.14em] text-ink sm:text-lg">
                POWERGROWTHZ
              </div>
              <div className="text-[11px] font-bold leading-tight tracking-[0.34em] text-accent sm:text-xs">
                AGENCY
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted md:flex">
            <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
            Client Website Onboarding
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        {/* Introduction */}
        <div className="mb-8 text-center sm:mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent sm:text-xs">
            Client Website Onboarding
          </p>
          <h1 className="mt-3 text-[28px] font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Let&apos;s build a website that brings your solar business more
            customers.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
            Tell us a little about your business, services and customers. Your
            answers will help us create a website that represents your business
            and makes it easier for potential customers to contact you.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-medium text-muted shadow-soft">
              <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
              Usually takes 5–10 minutes
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-medium text-muted shadow-soft">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              Skip anything that doesn&apos;t apply
            </span>
          </div>
          <p className="mx-auto mt-4 max-w-lg text-[13px] leading-relaxed text-muted">
            Don&apos;t worry if you don&apos;t have an answer to every question.
            You can skip anything that doesn&apos;t apply.
          </p>
        </div>

        <OnboardingForm />
      </main>

      <footer className="border-t border-line bg-white py-6">
        <p className="text-center text-xs text-muted">
          © {new Date().getFullYear()} PowerGrowthz Agency · Client Website
          Onboarding
        </p>
      </footer>
    </div>
  );
}
