"use client";

import { Plus, Quote, Trash2, UserRound } from "lucide-react";
import FileUpload from "./FileUpload";
import {
  QuestionError,
  QuestionHeading,
  TextArea,
  TextInput,
} from "./fields";
import type { StepProps } from "./types";
import type { TeamMember } from "@/types/onboarding";

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function StepBrand({ data, update, errors }: StepProps) {
  function updateMember(id: string, patch: Partial<TeamMember>) {
    update({
      teamMembers: data.teamMembers.map((m) =>
        m.id === id ? { ...m, ...patch } : m
      ),
    });
  }

  function addMember() {
    if (data.teamMembers.length >= 20) return;
    update({
      teamMembers: [...data.teamMembers, { id: makeId(), name: "", title: "" }],
    });
  }

  function removeMember(id: string) {
    update({ teamMembers: data.teamMembers.filter((m) => m.id !== id) });
  }

  return (
    <div className="space-y-9">
      {/* 1. Key message */}
      <div>
        <QuestionHeading optional>
          What message do you want customers to remember about your business?
        </QuestionHeading>
        <div className="mt-2">
          <TextArea
            value={data.keyMessage}
            onChange={(v) => update({ keyMessage: v })}
            rows={3}
            maxLength={2000}
            placeholder="e.g. Never run out of power again — clean, reliable solar energy for your home and business."
            error={!!errors.keyMessage}
          />
        </div>
        <QuestionError error={errors.keyMessage} />
      </div>

      {/* 2. Tagline */}
      <div>
        <QuestionHeading optional>
          Do you have a business slogan or tagline?
        </QuestionHeading>
        <div className="relative mt-2">
          <Quote
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="text"
            value={data.tagline}
            maxLength={160}
            onChange={(e) => update({ tagline: e.target.value })}
            placeholder="e.g. Reliable Solar Power for Every Home"
            aria-invalid={!!errors.tagline || undefined}
            className={`input-base pl-11 ${errors.tagline ? "input-error" : "input-ok"}`}
          />
        </div>
        <QuestionError error={errors.tagline} />
      </div>

      {/* 3. Reference websites */}
      <div>
        <QuestionHeading optional>What websites do you like?</QuestionHeading>
        <p className="mb-2 mt-1 text-[13.5px] leading-relaxed text-muted">
          These can be solar companies or businesses in other industries. Tell
          us what you like about their websites.
        </p>
        <TextArea
          value={data.referenceWebsites}
          onChange={(v) => update({ referenceWebsites: v })}
          rows={4}
          maxLength={4000}
          placeholder={"e.g.\nhttps://sunking.com — I like the clean layout\nhttps://example-solar.ng — I like how they show their packages"}
          error={!!errors.referenceWebsites}
        />
        <p className="helper-base">One website per line, if possible.</p>
        <QuestionError error={errors.referenceWebsites} />
      </div>

      {/* 4. Team members */}
      <div>
        <QuestionHeading optional>
          Who are the key people in your business?
        </QuestionHeading>
        <p className="mb-3 mt-1 text-[13.5px] text-muted">
          We can feature your team on the website to build trust.
        </p>

        {data.teamMembers.length === 0 && (
          <div className="mb-3 rounded-xl border border-dashed border-line bg-white p-5 text-center">
            <UserRound className="mx-auto h-6 w-6 text-muted" aria-hidden="true" />
            <p className="mt-2 text-[13.5px] text-muted">
              No team members added yet — this is optional.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {data.teamMembers.map((member, index) => {
            const memberError = errors[`teamMembers.${index}.name`];
            return (
              <div
                key={member.id}
                className="animate-fade-in-up rounded-xl border border-line bg-white p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-muted">
                    Person {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    aria-label={`Remove person ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`member-name-${member.id}`}
                      className="mb-1.5 block text-[13px] font-semibold text-ink"
                    >
                      Name
                    </label>
                    <input
                      id={`member-name-${member.id}`}
                      type="text"
                      maxLength={120}
                      value={member.name}
                      onChange={(e) => updateMember(member.id, { name: e.target.value })}
                      placeholder="e.g. Chinedu Okafor"
                      aria-invalid={!!memberError || undefined}
                      className={`input-base py-3 ${memberError ? "input-error" : "input-ok"}`}
                    />
                    {memberError && <QuestionError error={memberError} />}
                  </div>
                  <div>
                    <label
                      htmlFor={`member-title-${member.id}`}
                      className="mb-1.5 block text-[13px] font-semibold text-ink"
                    >
                      Job Title
                    </label>
                    <input
                      id={`member-title-${member.id}`}
                      type="text"
                      maxLength={120}
                      value={member.title}
                      onChange={(e) => updateMember(member.id, { title: e.target.value })}
                      placeholder="e.g. Lead Installer"
                      className="input-base py-3 input-ok"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {data.teamMembers.length < 20 && (
          <button
            type="button"
            onClick={addMember}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-dashed border-accent/60 bg-accent-soft/30 px-4 py-2.5 text-[14px] font-semibold text-accent-hover transition-colors hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add another person
          </button>
        )}
        <QuestionError error={errors.teamMembers} />
      </div>

      {/* 5. Team photos */}
      <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
        <FileUpload
          label="Upload photos of your team or key people"
          description="Optional. Clear, well-lit photos work best on websites."
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          kind="image"
          multiple
          maxFiles={15}
          value={data.teamPhotos}
          onChange={(files) => update({ teamPhotos: files })}
        />
      </div>
    </div>
  );
}
