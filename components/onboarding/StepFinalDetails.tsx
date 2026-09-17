"use client";

import { HelpCircle, Lightbulb, Plus, Trash2 } from "lucide-react";
import { QuestionError, QuestionHeading, RadioCards, TextArea } from "./fields";
import type { StepProps } from "./types";
import type { FaqItem } from "@/types/onboarding";

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const FAQ_EXAMPLES = [
  "How much does solar installation cost?",
  "How long does installation take?",
  "How long will the battery last?",
  "Do you offer maintenance?",
];

export default function StepFinalDetails({ data, update, errors }: StepProps) {
  function updateFaq(id: string, patch: Partial<FaqItem>) {
    update({ faqs: data.faqs.map((f) => (f.id === id ? { ...f, ...patch } : f)) });
  }

  function addFaq() {
    if (data.faqs.length >= 25) return;
    update({ faqs: [...data.faqs, { id: makeId(), question: "", answer: "" }] });
  }

  function removeFaq(id: string) {
    update({ faqs: data.faqs.filter((f) => f.id !== id) });
  }

  function addExample(example: string) {
    if (data.faqs.length >= 25) return;
    update({
      faqs: [...data.faqs, { id: makeId(), question: example, answer: "" }],
    });
  }

  return (
    <div className="space-y-9">
      {/* 1. FAQs */}
      <div>
        <QuestionHeading optional>Frequently Asked Questions</QuestionHeading>
        <p className="mb-3 mt-1 text-[13.5px] leading-relaxed text-muted">
          Add questions customers often ask you and your answers. We&apos;ll
          turn them into an FAQ section on your website.
        </p>

        {data.faqs.length === 0 && (
          <div className="mb-3 rounded-xl border border-dashed border-line bg-white p-5">
            <HelpCircle className="mx-auto h-6 w-6 text-muted" aria-hidden="true" />
            <p className="mt-2 text-center text-[13.5px] text-muted">
              No FAQs added yet — tap an example below to get started, or skip
              this section.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {FAQ_EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => addExample(example)}
                  className="rounded-full border border-line bg-canvas px-3 py-1.5 text-[12.5px] font-medium text-[#344054] transition-colors hover:border-accent/60 hover:bg-accent-soft/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  + {example}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {data.faqs.map((faq, index) => {
            const faqError = errors[`faqs.${index}`];
            return (
              <div
                key={faq.id}
                className={`animate-fade-in-up rounded-xl border bg-white p-4 ${
                  faqError ? "border-red-300" : "border-line"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-muted">
                    FAQ {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFaq(faq.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    aria-label={`Remove FAQ ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor={`faq-q-${faq.id}`}
                      className="mb-1.5 block text-[13px] font-semibold text-ink"
                    >
                      Question
                    </label>
                    <input
                      id={`faq-q-${faq.id}`}
                      type="text"
                      maxLength={400}
                      value={faq.question}
                      onChange={(e) => updateFaq(faq.id, { question: e.target.value })}
                      placeholder="e.g. How much does solar installation cost?"
                      className="input-base input-ok py-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`faq-a-${faq.id}`}
                      className="mb-1.5 block text-[13px] font-semibold text-ink"
                    >
                      Answer
                    </label>
                    <textarea
                      id={`faq-a-${faq.id}`}
                      rows={3}
                      maxLength={4000}
                      value={faq.answer}
                      onChange={(e) => updateFaq(faq.id, { answer: e.target.value })}
                      placeholder="e.g. Cost depends on the size of the system. A typical 5kVA home system starts from ₦X,XXX,XXX…"
                      className="input-base input-ok resize-y"
                    />
                  </div>
                </div>
                {faqError && <QuestionError error={faqError} />}
              </div>
            );
          })}
        </div>

        {data.faqs.length < 25 && (
          <button
            type="button"
            onClick={addFaq}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-dashed border-accent/60 bg-accent-soft/30 px-4 py-2.5 text-[14px] font-semibold text-accent-hover transition-colors hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add another FAQ
          </button>
        )}
        <QuestionError error={errors.faqs} />
      </div>

      {/* 2. Anything else */}
      <div>
        <QuestionHeading optional>
          Is there anything else you want us to know?
        </QuestionHeading>
        <div className="mt-2">
          <TextArea
            value={data.additionalInfo}
            onChange={(v) => update({ additionalInfo: v })}
            rows={6}
            maxLength={10000}
            placeholder="Anything important about your business, your customers, or the website you want us to build…"
            error={!!errors.additionalInfo}
          />
        </div>
        <QuestionError error={errors.additionalInfo} />
      </div>

      {/* 3. Preferred delivery */}
      <div>
        <QuestionHeading>
          How would you prefer to send additional materials?
        </QuestionHeading>
        <p className="mb-3 mt-1 text-[13.5px] text-muted">
          Photos, documents or anything else you couldn&apos;t upload here.
        </p>
        <RadioCards
          name="preferredDelivery"
          columns={2}
          value={data.preferredDelivery}
          onChange={(v) =>
            update({ preferredDelivery: v as typeof data.preferredDelivery })
          }
          options={[
            { value: "whatsapp", label: "WhatsApp" },
            { value: "email", label: "Email" },
            { value: "drive", label: "Google Drive" },
            { value: "later", label: "I'll provide them later" },
          ]}
          error={!!errors.preferredDelivery}
        />
        <QuestionError error={errors.preferredDelivery} />
      </div>

      {/* Submission confirmation note */}
      <div className="flex items-start gap-3 rounded-xl border border-accent/30 bg-accent-soft/40 p-4">
        <Lightbulb className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent-hover" aria-hidden="true" />
        <p className="text-[13.5px] leading-relaxed text-[#344054]">
          By submitting this form, you confirm that the information provided is
          accurate to the best of your knowledge.
        </p>
      </div>
    </div>
  );
}
