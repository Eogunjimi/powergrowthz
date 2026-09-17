"use client";

import { ArrowRight, Package, Tags } from "lucide-react";
import { GET_STARTED_OPTIONS } from "@/types/onboarding";
import {
  CheckboxCards,
  QuestionError,
  QuestionHeading,
  RadioCards,
  TextArea,
} from "./fields";
import type { StepProps } from "./types";

export default function StepProducts({ data, update, errors }: StepProps) {
  return (
    <div className="space-y-9">
      {/* 1. Brands */}
      <div>
        <QuestionHeading optional>
          What solar brands do you install or sell?
        </QuestionHeading>
        <div className="mt-2">
          <TextArea
            value={data.solarBrands}
            onChange={(v) => update({ solarBrands: v })}
            rows={2}
            maxLength={2000}
            placeholder="e.g. Deye, Felicity Solar, Growatt, Luminous..."
            error={!!errors.solarBrands}
          />
        </div>
        <QuestionError error={errors.solarBrands} />
      </div>

      {/* 2. Packages */}
      <div>
        <QuestionHeading>
          Do you have standard solar packages or installation prices?
        </QuestionHeading>
        <div className="mt-3">
          <RadioCards
            name="packagesType"
            value={data.packagesType}
            onChange={(v) => update({ packagesType: v as typeof data.packagesType })}
            options={[
              { value: "fixed", label: "Yes, we have fixed packages" },
              { value: "custom", label: "We provide custom quotes" },
              { value: "both", label: "We offer both" },
              { value: "none", label: "No standard packages yet" },
            ]}
            error={!!errors.packagesType}
          />
        </div>

        {(data.packagesType === "fixed" || data.packagesType === "both") && (
          <div className="mt-4 animate-fade-in-up rounded-xl border border-accent/30 bg-accent-soft/30 p-4 sm:p-5">
            <label htmlFor="packageDetails" className="label-base">
              Tell us about your packages and prices.{" "}
              <span className="font-medium text-accent-hover">*</span>
            </label>
            <TextArea
              value={data.packageDetails}
              onChange={(v) => update({ packageDetails: v })}
              rows={4}
              maxLength={6000}
              placeholder={"e.g. 3kVA package — ₦X,XXX,XXX (includes …)\n5kVA package — ₦X,XXX,XXX (includes …)"}
              error={!!errors.packageDetails}
            />
            <p className="helper-base">
              For example: 3kVA package, 5kVA package, 10kVA package, etc.
            </p>
            <QuestionError error={errors.packageDetails} />
          </div>
        )}
      </div>

      {/* 3. Payment plans */}
      <div>
        <QuestionHeading>Do you offer payment plans?</QuestionHeading>
        <div className="mt-3">
          <RadioCards
            name="paymentPlans"
            value={data.paymentPlans}
            onChange={(v) => update({ paymentPlans: v as typeof data.paymentPlans })}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "depends", label: "Depends on the project/customer" },
            ]}
            error={!!errors.paymentPlans}
          />
        </div>

        {data.paymentPlans === "yes" && (
          <div className="mt-4 animate-fade-in-up rounded-xl border border-accent/30 bg-accent-soft/30 p-4 sm:p-5">
            <label htmlFor="paymentPlanDetails" className="label-base">
              Briefly explain how your payment plan works.{" "}
              <span className="font-medium text-accent-hover">*</span>
            </label>
            <TextArea
              value={data.paymentPlanDetails}
              onChange={(v) => update({ paymentPlanDetails: v })}
              rows={3}
              maxLength={3000}
              placeholder="e.g. 60% deposit, balance spread over 3 months…"
              error={!!errors.paymentPlanDetails}
            />
            <QuestionError error={errors.paymentPlanDetails} />
          </div>
        )}
      </div>

      {/* 4. Installation process */}
      <div>
        <QuestionHeading optional>
          How does your installation process work?
        </QuestionHeading>
        <div className="mt-2">
          <TextArea
            value={data.installationProcess}
            onChange={(v) => update({ installationProcess: v })}
            rows={5}
            maxLength={6000}
            placeholder="e.g. Customer contacts us, we visit the site, send a quotation, and installation takes 1–2 days…"
            error={!!errors.installationProcess}
          />
        </div>
        <p className="helper-base">
          Tell us what happens from the moment a customer contacts you until
          the installation is completed.
        </p>
        <QuestionError error={errors.installationProcess} />

        <div className="mt-3 rounded-xl border border-line bg-white p-4">
          <p className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-muted">
            <Tags className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            Example
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[13px] font-medium text-[#344054]">
            {[
              "Customer contacts us",
              "Consultation",
              "Site assessment",
              "Quotation",
              "Payment",
              "Installation",
              "Testing",
              "Handover",
            ].map((stage, i, arr) => (
              <span key={stage} className="inline-flex items-center gap-2">
                <span className="rounded-lg bg-accent-soft px-2.5 py-1">
                  {stage}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Getting started */}
      <div>
        <QuestionHeading optional>
          What should a new customer do to get started?
        </QuestionHeading>
        <p className="mb-3 mt-1 flex items-center gap-1.5 text-[13.5px] text-muted">
          <Package className="h-4 w-4 text-accent" aria-hidden="true" />
          Select all that apply.
        </p>
        <CheckboxCards
          ariaLabel="What should a new customer do to get started?"
          options={GET_STARTED_OPTIONS}
          selected={data.getStarted}
          columns={2}
          onToggle={(option) =>
            update({
              getStarted: data.getStarted.includes(option)
                ? data.getStarted.filter((v) => v !== option)
                : [...data.getStarted, option],
            })
          }
          error={!!errors.getStarted}
        />
        <QuestionError error={errors.getStarted} />
      </div>
    </div>
  );
}
