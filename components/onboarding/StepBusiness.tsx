"use client";

import { MapPin, Users, Wrench } from "lucide-react";
import {
  CUSTOMER_OPTIONS,
  SERVICE_OPTIONS,
} from "@/types/onboarding";
import { CheckboxCards, Field, QuestionError, QuestionHeading, TextArea, TextInput } from "./fields";
import type { StepProps } from "./types";

export default function StepBusiness({ data, update, errors }: StepProps) {
  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <div className="space-y-9">
      {/* 1. Business description */}
      <div>
        <QuestionHeading optional>Tell us about your business</QuestionHeading>
        <p className="mb-2 mt-1 text-[13.5px] leading-relaxed text-muted">
          What does your business do? When did you start? What are you hoping
          to achieve?
        </p>
        <TextArea
          value={data.businessDescription}
          onChange={(v) => update({ businessDescription: v })}
          rows={6}
          maxLength={6000}
          placeholder="e.g. We started in 2019 installing solar systems for homes in Lagos. We want a website that helps more customers find and trust us…"
          error={!!errors.businessDescription}
        />
        <p className="helper-base">
          Write as much as you like. Don&apos;t worry about grammar — just tell
          us about your business in your own words.
        </p>
      </div>

      {/* 2. Services */}
      <div>
        <QuestionHeading required>
          What solar services do you offer?
        </QuestionHeading>
        <p className="mb-3 mt-1 flex items-center gap-1.5 text-[13.5px] text-muted">
          <Wrench className="h-4 w-4 text-accent" aria-hidden="true" />
          Select all that apply.
        </p>
        <CheckboxCards
          ariaLabel="What solar services do you offer?"
          options={SERVICE_OPTIONS}
          selected={data.services}
          onToggle={(option) => update({ services: toggle(data.services, option) })}
          error={!!errors.services}
        />
        <QuestionError error={errors.services} />

        {data.services.includes("Other") && (
          <div className="mt-3 animate-fade-in-up">
            <TextInput
              value={data.otherService}
              onChange={(v) => update({ otherService: v })}
              placeholder="Other service — please describe"
              error={!!errors.otherService}
              maxLength={200}
            />
            <QuestionError error={errors.otherService} />
          </div>
        )}
      </div>

      {/* 3. Customers */}
      <div>
        <QuestionHeading required>Who are your main customers?</QuestionHeading>
        <p className="mb-3 mt-1 flex items-center gap-1.5 text-[13.5px] text-muted">
          <Users className="h-4 w-4 text-accent" aria-hidden="true" />
          Select all that apply.
        </p>
        <CheckboxCards
          ariaLabel="Who are your main customers?"
          options={CUSTOMER_OPTIONS}
          selected={data.customers}
          onToggle={(option) => update({ customers: toggle(data.customers, option) })}
          error={!!errors.customers}
        />
        <QuestionError error={errors.customers} />

        {data.customers.includes("Other") && (
          <div className="mt-3 animate-fade-in-up">
            <TextInput
              value={data.otherCustomer}
              onChange={(v) => update({ otherCustomer: v })}
              placeholder="Other customer type — please describe"
              error={!!errors.otherCustomer}
              maxLength={200}
            />
            <QuestionError error={errors.otherCustomer} />
          </div>
        )}
      </div>

      {/* 4. Service areas */}
      <Field
        label="What areas do you serve?"
        htmlFor="serviceAreas"
        required
        error={errors.serviceAreas}
      >
        <TextArea
          value={data.serviceAreas}
          onChange={(v) => update({ serviceAreas: v })}
          rows={3}
          maxLength={2000}
          placeholder="e.g. Lekki, Ikeja, Lagos State, Ogun State, Abuja, nationwide"
          error={!!errors.serviceAreas}
        />
      </Field>

      {/* 5. Location */}
      <Field
        label="Where is your office or business located?"
        htmlFor="businessLocation"
        required
        helper="If you don't have a physical office, just tell us the city or state you operate from."
        error={errors.businessLocation}
      >
        <div className="relative">
          <MapPin
            className="pointer-events-none absolute left-4 top-4 h-[18px] w-[18px] text-muted"
            aria-hidden="true"
          />
          <textarea
            id="businessLocation"
            rows={2}
            maxLength={2000}
            value={data.businessLocation}
            onChange={(e) => update({ businessLocation: e.target.value })}
            placeholder="e.g. 12 Admiralty Way, Lekki Phase 1, Lagos"
            aria-invalid={!!errors.businessLocation || undefined}
            className={`input-base resize-y pl-11 ${errors.businessLocation ? "input-error" : "input-ok"}`}
          />
        </div>
      </Field>
    </div>
  );
}
