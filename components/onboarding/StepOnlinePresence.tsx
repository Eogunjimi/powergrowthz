"use client";

import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Link2,
  Star,
  Music2,
  Youtube,
} from "lucide-react";
import FileUpload from "./FileUpload";
import {
  QuestionError,
  QuestionHeading,
  RadioCards,
  TextArea,
} from "./fields";
import type { StepProps } from "./types";
import type { SocialLinks } from "@/types/onboarding";

const SOCIAL_FIELDS: {
  key: keyof SocialLinks;
  label: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourbusiness", icon: Facebook },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourbusiness", icon: Instagram },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourbusiness", icon: Music2 },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/yourbusiness", icon: Linkedin },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourbusiness", icon: Youtube },
  { key: "other", label: "Other", placeholder: "https://x.com/yourbusiness", icon: Link2 },
];

export default function StepOnlinePresence({ data, update, errors }: StepProps) {
  function updateSocial(key: keyof SocialLinks, value: string) {
    update({ socials: { ...data.socials, [key]: value } });
  }

  return (
    <div className="space-y-9">
      {/* 1. Logo */}
      <div>
        <QuestionHeading>Do you have a business logo?</QuestionHeading>
        <div className="mt-3">
          <RadioCards
            name="hasLogo"
            value={data.hasLogo}
            onChange={(v) => update({ hasLogo: v as typeof data.hasLogo })}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "update", label: "I have one but want to update it" },
            ]}
            error={!!errors.hasLogo}
          />
        </div>

        {(data.hasLogo === "yes" || data.hasLogo === "update") && (
          <div className="mt-4 animate-fade-in-up rounded-xl border border-line bg-white p-4 sm:p-5">
            <FileUpload
              label="Upload your logo"
              description={
                data.hasLogo === "update"
                  ? "Upload your current logo. Our team can help refresh the design."
                  : "PNG or JPG works best. A transparent-background PNG is ideal."
              }
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              kind="image"
              maxFiles={1}
              value={data.logoFile ? [data.logoFile] : []}
              onChange={(files) => update({ logoFile: files[0] ?? null })}
            />
          </div>
        )}
      </div>

      {/* 2. Installation photos */}
      <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
        <FileUpload
          label="Upload photos of your completed solar installations"
          description="Optional but highly recommended — real installation photos make your website far more trustworthy. You can also send more later."
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          kind="image"
          multiple
          maxFiles={30}
          value={data.installationPhotos}
          onChange={(files) => update({ installationPhotos: files })}
        />
      </div>

      {/* 3. Testimonials */}
      <div>
        <QuestionHeading>
          Do you have customer reviews or testimonials?
        </QuestionHeading>
        <div className="mt-3">
          <RadioCards
            name="hasTestimonials"
            columns={2}
            value={data.hasTestimonials}
            onChange={(v) =>
              update({ hasTestimonials: v as typeof data.hasTestimonials })
            }
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            error={!!errors.hasTestimonials}
          />
        </div>

        {data.hasTestimonials === "yes" && (
          <div className="mt-4 animate-fade-in-up space-y-4 rounded-xl border border-accent/30 bg-accent-soft/30 p-4 sm:p-5">
            <div>
              <label htmlFor="testimonials" className="label-base">
                Paste your customer reviews here.{" "}
                <span className="font-medium text-accent-hover">*</span>
              </label>
              <TextArea
                value={data.testimonials}
                onChange={(v) => update({ testimonials: v })}
                rows={5}
                maxLength={10000}
                placeholder={'e.g.\n"Excellent service! Installation was done in one day." — Mrs. Adebayo, Lekki\n"Very professional team, highly recommended." — Emeka, Ikeja'}
                error={!!errors.testimonials}
              />
              <QuestionError error={errors.testimonials} />
            </div>
            <div>
              <label htmlFor="googleProfileUrl" className="label-base">
                Google Business Profile link{" "}
                <span className="text-[12px] font-medium text-muted">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <Star
                  className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  id="googleProfileUrl"
                  type="url"
                  inputMode="url"
                  maxLength={300}
                  value={data.googleProfileUrl ?? ""}
                  onChange={(e) => update({ googleProfileUrl: e.target.value })}
                  placeholder="https://g.page/yourbusiness"
                  aria-invalid={!!errors.googleProfileUrl || undefined}
                  className={`input-base pl-11 ${errors.googleProfileUrl ? "input-error" : "input-ok"}`}
                />
              </div>
              <QuestionError error={errors.googleProfileUrl} />
            </div>
          </div>
        )}
      </div>

      {/* 4. Social media */}
      <div>
        <QuestionHeading optional>Social media accounts</QuestionHeading>
        <p className="mb-3 mt-1 text-[13.5px] text-muted">
          Paste the links to your business pages. Leave blank any you
          don&apos;t have.
        </p>
        <div className="space-y-3">
          {SOCIAL_FIELDS.map(({ key, label, placeholder, icon: Icon }) => {
            const err = errors[`socials.${key}`];
            return (
              <div key={key}>
                <label
                  htmlFor={`social-${key}`}
                  className="mb-1.5 block text-[13.5px] font-semibold text-ink"
                >
                  {label}
                </label>
                <div className="relative">
                  <Icon
                    className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
                    aria-hidden="true"
                  />
                  <input
                    id={`social-${key}`}
                    type="url"
                    inputMode="url"
                    maxLength={300}
                    value={data.socials[key] ?? ""}
                    onChange={(e) => updateSocial(key, e.target.value)}
                    placeholder={placeholder}
                    aria-invalid={!!err || undefined}
                    className={`input-base py-3 pl-11 ${err ? "input-error" : "input-ok"}`}
                  />
                </div>
                {err && <QuestionError error={err} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Existing website */}
      <div>
        <QuestionHeading>Do you already have a website?</QuestionHeading>
        <div className="mt-3">
          <RadioCards
            name="hasWebsite"
            columns={2}
            value={data.hasWebsite}
            onChange={(v) => update({ hasWebsite: v as typeof data.hasWebsite })}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            error={!!errors.hasWebsite}
          />
        </div>

        {data.hasWebsite === "yes" && (
          <div className="mt-4 animate-fade-in-up rounded-xl border border-accent/30 bg-accent-soft/30 p-4 sm:p-5">
            <label htmlFor="websiteUrl" className="label-base">
              Website URL <span className="font-medium text-accent-hover">*</span>
            </label>
            <div className="relative">
              <Globe
                className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="websiteUrl"
                type="url"
                inputMode="url"
                maxLength={300}
                value={data.websiteUrl}
                onChange={(e) => update({ websiteUrl: e.target.value })}
                placeholder="https://yourbusiness.com"
                aria-invalid={!!errors.websiteUrl || undefined}
                className={`input-base pl-11 ${errors.websiteUrl ? "input-error" : "input-ok"}`}
              />
            </div>
            <QuestionError error={errors.websiteUrl} />
          </div>
        )}
      </div>
    </div>
  );
}
