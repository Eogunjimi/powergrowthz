"use client";

import { Building2, Mail, MessageCircle, Phone, Smartphone } from "lucide-react";
import { Field, TextInput } from "./fields";
import type { StepProps } from "./types";

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-hover">
      {children}
    </span>
  );
}

export default function StepBusinessDetails({ data, update, errors }: StepProps) {
  return (
    <div className="space-y-7">
      <Field
        label="Business Name"
        htmlFor="businessName"
        required
        error={errors.businessName}
      >
        <TextInput
          value={data.businessName}
          onChange={(v) => update({ businessName: v })}
          placeholder="e.g. BrightPower Solar"
          error={!!errors.businessName}
          autoComplete="organization"
          maxLength={120}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="First Name"
          htmlFor="firstName"
          required
          error={errors.firstName}
        >
          <TextInput
            value={data.firstName}
            onChange={(v) => update({ firstName: v })}
            placeholder="e.g. Ade"
            error={!!errors.firstName}
            autoComplete="given-name"
            maxLength={80}
          />
        </Field>
        <Field
          label="Last Name"
          htmlFor="lastName"
          required
          error={errors.lastName}
        >
          <TextInput
            value={data.lastName}
            onChange={(v) => update({ lastName: v })}
            placeholder="e.g. Ogunjimi"
            error={!!errors.lastName}
            autoComplete="family-name"
            maxLength={80}
          />
        </Field>
      </div>

      <Field
        label="Business Email"
        htmlFor="businessEmail"
        required
        helper="We may use this information to communicate with you about your website."
        error={errors.businessEmail}
      >
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="businessEmail"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={160}
            value={data.businessEmail}
            onChange={(e) => update({ businessEmail: e.target.value })}
            placeholder="e.g. info@brightpowersolar.com"
            aria-invalid={!!errors.businessEmail || undefined}
            className={`input-base pl-11 ${errors.businessEmail ? "input-error" : "input-ok"}`}
          />
        </div>
      </Field>

      <Field
        label="Your Phone Number"
        htmlFor="ownerPhone"
        required
        helper="This number is for communication between you and our team."
        error={errors.ownerPhone}
      >
        <div className="relative">
          <Phone
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="ownerPhone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={data.ownerPhone}
            onChange={(e) => update({ ownerPhone: e.target.value })}
            placeholder="e.g. 08012345678"
            aria-invalid={!!errors.ownerPhone || undefined}
            className={`input-base pl-11 ${errors.ownerPhone ? "input-error" : "input-ok"}`}
          />
        </div>
      </Field>

      <Field
        label="Customer Phone Number"
        htmlFor="customerPhone"
        required
        helper="This number will be displayed on your website so customers can contact you."
        error={errors.customerPhone}
      >
        <div className="relative">
          <Smartphone
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="customerPhone"
            type="tel"
            inputMode="tel"
            value={data.customerPhone}
            onChange={(e) => update({ customerPhone: e.target.value })}
            placeholder="e.g. 08123456789"
            aria-invalid={!!errors.customerPhone || undefined}
            className={`input-base pl-11 ${errors.customerPhone ? "input-error" : "input-ok"}`}
          />
        </div>
      </Field>

      <Field
        label="WhatsApp Business Number"
        htmlFor="whatsappPhone"
        optional
        helper="If this is the same as your customer phone number, you can enter it again."
        error={errors.whatsappPhone}
      >
        <div className="relative">
          <MessageCircle
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="whatsappPhone"
            type="tel"
            inputMode="tel"
            value={data.whatsappPhone}
            onChange={(e) => update({ whatsappPhone: e.target.value })}
            placeholder="e.g. 08012345678"
            aria-invalid={!!errors.whatsappPhone || undefined}
            className={`input-base pl-11 ${errors.whatsappPhone ? "input-error" : "input-ok"}`}
          />
        </div>
      </Field>

      <div className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
        <SectionIcon>
          <Building2 className="h-[18px] w-[18px]" aria-hidden="true" />
        </SectionIcon>
        <p className="text-[13px] leading-relaxed text-muted">
          We&apos;ll only use these details to build your website and
          communicate with you. Nothing is shared publicly without your
          approval.
        </p>
      </div>
    </div>
  );
}
