"use client";

import { Award, Star } from "lucide-react";
import { REASON_OPTIONS } from "@/types/onboarding";
import FileUpload from "./FileUpload";
import {
  CheckboxCards,
  QuestionError,
  QuestionHeading,
  RadioCards,
  TextArea,
  TextInput,
} from "./fields";
import type { StepProps } from "./types";

export default function StepDifferentiators({ data, update, errors }: StepProps) {
  return (
    <div className="space-y-9">
      {/* 1. Why choose you */}
      <div>
        <QuestionHeading optional>
          Why should customers choose your business?
        </QuestionHeading>
        <p className="mb-3 mt-1 flex items-center gap-1.5 text-[13.5px] text-muted">
          <Star className="h-4 w-4 text-accent" aria-hidden="true" />
          Select all that apply.
        </p>
        <CheckboxCards
          ariaLabel="Why should customers choose your business?"
          options={REASON_OPTIONS}
          selected={data.chooseReasons}
          onToggle={(option) =>
            update({
              chooseReasons: data.chooseReasons.includes(option)
                ? data.chooseReasons.filter((v) => v !== option)
                : [...data.chooseReasons, option],
            })
          }
          error={!!errors.chooseReasons}
        />
        <QuestionError error={errors.chooseReasons} />

        {data.chooseReasons.includes("Other") && (
          <div className="mt-3 animate-fade-in-up">
            <TextInput
              value={data.otherReason}
              onChange={(v) => update({ otherReason: v })}
              placeholder="Other reason — please describe"
              error={!!errors.otherReason}
              maxLength={200}
            />
            <QuestionError error={errors.otherReason} />
          </div>
        )}
      </div>

      {/* 2. What makes you different */}
      <div>
        <QuestionHeading optional>
          What makes your business different from other solar companies?
        </QuestionHeading>
        <div className="mt-2">
          <TextArea
            value={data.differentiator}
            onChange={(v) => update({ differentiator: v })}
            rows={4}
            maxLength={4000}
            placeholder="e.g. We only use Tier-1 panels, and every installation comes with free maintenance for the first year…"
            error={!!errors.differentiator}
          />
        </div>
        <p className="helper-base">
          Tell us what you do differently or what customers appreciate most
          about working with you.
        </p>
        <QuestionError error={errors.differentiator} />
      </div>

      {/* 3. Certificates & documents */}
      <div>
        <QuestionHeading optional>
          Do you have certificates, awards, memberships or official
          partnerships?
        </QuestionHeading>
        <div className="mt-2">
          <TextArea
            value={data.certificates}
            onChange={(v) => update({ certificates: v })}
            rows={3}
            maxLength={2000}
            placeholder="e.g. certifications, manufacturer partnerships, professional memberships, awards"
            error={!!errors.certificates}
          />
        </div>
        <QuestionError error={errors.certificates} />

        <div className="mt-5 rounded-xl border border-line bg-white p-4 sm:p-5">
          <FileUpload
            label="Upload certificates or supporting documents"
            description="Optional. Add any certificates, partnership letters or award documents you'd like featured."
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            kind="document"
            multiple
            maxFiles={10}
            value={data.certificateFiles}
            onChange={(files) => update({ certificateFiles: files })}
          />
        </div>
      </div>

      {/* 4. Warranty */}
      <div>
        <QuestionHeading>
          Do you offer warranties or guarantees?
        </QuestionHeading>
        <div className="mt-3">
          <RadioCards
            name="hasWarranty"
            columns={1}
            value={data.hasWarranty}
            onChange={(v) => update({ hasWarranty: v as typeof data.hasWarranty })}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "unsure", label: "Not sure" },
            ]}
            error={!!errors.hasWarranty}
          />
        </div>

        {data.hasWarranty === "yes" && (
          <div className="mt-4 animate-fade-in-up rounded-xl border border-accent/30 bg-accent-soft/30 p-4 sm:p-5">
            <label htmlFor="warrantyDetails" className="label-base">
              What does your warranty or guarantee cover and for how long?{" "}
              <span className="font-medium text-accent-hover">*</span>
            </label>
            <TextArea
              value={data.warrantyDetails}
              onChange={(v) => update({ warrantyDetails: v })}
              rows={3}
              maxLength={3000}
              placeholder="e.g. 10-year panel warranty, 5-year inverter warranty, 1 year free maintenance…"
              error={!!errors.warrantyDetails}
            />
            <QuestionError error={errors.warrantyDetails} />
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
          <Award className="h-[18px] w-[18px] text-accent-hover" aria-hidden="true" />
        </span>
        <p className="text-[13px] leading-relaxed text-muted">
          These answers will appear in the trust sections of your website —
          badges, warranty promises and credentials that convince customers to
          choose you.
        </p>
      </div>
    </div>
  );
}
