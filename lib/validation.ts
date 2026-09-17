import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Normalises a Nigerian phone number written in common local formats:
 *   08012345678, 0812 345 6789, +234 801 234 5678, 2348012345678, 0801-234-5678
 * Returns the number in +234XXXXXXXXXX format, or null when invalid.
 */
export function normalizeNigerianPhone(raw: string): string | null {
  if (!raw) return null;
  // Strip spaces, dashes, dots and parentheses — never force manual formatting.
  const cleaned = raw.replace(/[\s\-().]/g, "");

  let digits: string;
  if (cleaned.startsWith("+234")) {
    digits = cleaned.slice(4);
  } else if (cleaned.startsWith("234") && cleaned.length > 10) {
    digits = cleaned.slice(3);
  } else if (cleaned.startsWith("0")) {
    digits = cleaned.slice(1);
  } else {
    digits = cleaned;
  }

  // Nigerian mobile numbers: 10 digits starting with 70/80/81/90/91 etc.
  if (!/^[789][01]\d{8}$/.test(digits)) return null;
  return `+234${digits}`;
}

const phoneSchema = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `Please enter ${label}.`)
    .refine((v) => normalizeNigerianPhone(v) !== null, {
      message: `Please enter a valid Nigerian phone number (e.g. 08012345678 or +2348012345678).`,
    });

const optionalPhoneSchema = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || normalizeNigerianPhone(v) !== null, {
    message:
      "Please enter a valid Nigerian phone number (e.g. 08012345678 or +2348012345678).",
  });

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (v) => !v || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v),
    "Please enter a valid website link (e.g. https://example.com)."
  );

export const uploadedFileSchema = z.object({
  name: z.string().max(200),
  url: z.string().url(),
  size: z.number().int().nonnegative(),
  type: z.string().max(100),
});

const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string().trim().max(120),
  title: z.string().trim().max(120),
});

const faqItemSchema = z.object({
  id: z.string(),
  question: z.string().trim().max(400),
  answer: z.string().trim().max(4000),
});

/* ------------------------------------------------------------------ */
/* Per-step schemas (used for client-side step validation)             */
/* ------------------------------------------------------------------ */

export const step1Schema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, "Please enter your business name.")
    .max(120, "Business name is too long."),
  firstName: z
    .string()
    .trim()
    .min(1, "Please enter your first name.")
    .max(80, "First name is too long."),
  lastName: z
    .string()
    .trim()
    .min(1, "Please enter your last name.")
    .max(80, "Last name is too long."),
  businessEmail: z
    .string()
    .trim()
    .min(1, "Please enter your business email address.")
    .email("Please enter a valid email address (e.g. name@company.com).")
    .max(160),
  ownerPhone: phoneSchema("your phone number"),
  customerPhone: phoneSchema("the customer phone number"),
  whatsappPhone: optionalPhoneSchema,
});

export const step2Schema = z
  .object({
    businessDescription: z.string().trim().max(6000).optional().default(""),
    services: z
      .array(z.string())
      .min(1, "Please select at least one service you offer."),
    otherService: z.string().trim().max(200).optional().default(""),
    customers: z
      .array(z.string())
      .min(1, "Please select at least one type of customer you serve."),
    otherCustomer: z.string().trim().max(200).optional().default(""),
    serviceAreas: z
      .string()
      .trim()
      .min(1, "Please tell us the areas you serve.")
      .max(2000),
    businessLocation: z
      .string()
      .trim()
      .min(1, "Please tell us where your business is located.")
      .max(2000),
  })
  .superRefine((data, ctx) => {
    if (data.services.includes("Other") && !data.otherService) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherService"],
        message: "Please describe your other service.",
      });
    }
    if (data.customers.includes("Other") && !data.otherCustomer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherCustomer"],
        message: "Please describe your other customer type.",
      });
    }
  });

export const step3Schema = z
  .object({
    chooseReasons: z.array(z.string()).optional().default([]),
    otherReason: z.string().trim().max(200).optional().default(""),
    differentiator: z.string().trim().max(4000).optional().default(""),
    certificates: z.string().trim().max(2000).optional().default(""),
    certificateFiles: z.array(uploadedFileSchema).max(10).optional().default([]),
    hasWarranty: z.enum(["", "yes", "no", "unsure"]).optional().default(""),
    warrantyDetails: z.string().trim().max(3000).optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.hasWarranty === "yes" && !data.warrantyDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["warrantyDetails"],
        message:
          "Please tell us what your warranty or guarantee covers and for how long.",
      });
    }
  });

export const step4Schema = z
  .object({
    solarBrands: z.string().trim().max(2000).optional().default(""),
    packagesType: z
      .enum(["", "fixed", "custom", "both", "none"])
      .optional()
      .default(""),
    packageDetails: z.string().trim().max(6000).optional().default(""),
    paymentPlans: z.enum(["", "yes", "no", "depends"]).optional().default(""),
    paymentPlanDetails: z.string().trim().max(3000).optional().default(""),
    installationProcess: z.string().trim().max(6000).optional().default(""),
    getStarted: z.array(z.string()).optional().default([]),
  })
  .superRefine((data, ctx) => {
    if (
      (data.packagesType === "fixed" || data.packagesType === "both") &&
      !data.packageDetails
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["packageDetails"],
        message: "Please tell us about your packages and prices.",
      });
    }
    if (data.paymentPlans === "yes" && !data.paymentPlanDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paymentPlanDetails"],
        message: "Please briefly explain how your payment plan works.",
      });
    }
  });

export const step5Schema = z
  .object({
    keyMessage: z.string().trim().max(2000).optional().default(""),
    tagline: z.string().trim().max(160).optional().default(""),
    referenceWebsites: z.string().trim().max(4000).optional().default(""),
    teamMembers: z
      .array(teamMemberSchema)
      .max(20)
      .optional()
      .default([])
      .refine(
        (members) => members.every((m) => m.name.trim().length > 0),
        "Please enter a name for every team member you added (or remove the empty row)."
      ),
    teamPhotos: z.array(uploadedFileSchema).max(15).optional().default([]),
  })
  .superRefine((data, ctx) => {
    data.teamMembers.forEach((member, index) => {
      if (!member.name.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["teamMembers", index, "name"],
          message: "Please enter this person's name, or remove the row.",
        });
      }
    });
  });

export const step6Schema = z
  .object({
    hasLogo: z.enum(["", "yes", "no", "update"]).optional().default(""),
    logoFile: uploadedFileSchema.nullable().optional().default(null),
    installationPhotos: z.array(uploadedFileSchema).max(30).optional().default([]),
    hasTestimonials: z.enum(["", "yes", "no"]).optional().default(""),
    testimonials: z.string().trim().max(10000).optional().default(""),
    googleProfileUrl: optionalUrlSchema,
    socials: z.object({
      facebook: optionalUrlSchema,
      instagram: optionalUrlSchema,
      tiktok: optionalUrlSchema,
      linkedin: optionalUrlSchema,
      youtube: optionalUrlSchema,
      other: optionalUrlSchema,
    }),
    hasWebsite: z.enum(["", "yes", "no"]).optional().default(""),
    websiteUrl: z.string().trim().max(300).optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.hasTestimonials === "yes" && !data.testimonials) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["testimonials"],
        message: "Please paste your customer reviews here.",
      });
    }
    if (data.hasWebsite === "yes" && !data.websiteUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["websiteUrl"],
        message: "Please enter your current website address.",
      });
    }
    if (
      data.hasWebsite === "yes" &&
      data.websiteUrl &&
      !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(data.websiteUrl)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["websiteUrl"],
        message: "Please enter a valid website address (e.g. https://example.com).",
      });
    }
  });

export const step7Schema = z
  .object({
    faqs: z
      .array(faqItemSchema)
      .max(25)
      .optional()
      .default([]),
    additionalInfo: z.string().trim().max(10000).optional().default(""),
    preferredDelivery: z
      .enum(["", "whatsapp", "email", "drive", "later"])
      .optional()
      .default(""),
  })
  .superRefine((data, ctx) => {
    data.faqs.forEach((faq, index) => {
      const hasQ = faq.question.trim().length > 0;
      const hasA = faq.answer.trim().length > 0;
      if (hasQ !== hasA) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["faqs", index],
          message: hasQ
            ? "Please add an answer for this question, or remove the row."
            : "Please add the question that goes with this answer, or remove the row.",
        });
      }
    });
  });

export const STEP_SCHEMAS = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
];

/* ------------------------------------------------------------------ */
/* Full submission schema (server-side)                                */
/* ------------------------------------------------------------------ */

export const onboardingSchema = z
  .object({
    ...step1Schema.shape,
    ...z.object({
      businessDescription: z.string().trim().max(6000).default(""),
      services: z
        .array(z.string())
        .min(1, "Please select at least one service you offer."),
      otherService: z.string().trim().max(200).default(""),
      customers: z
        .array(z.string())
        .min(1, "Please select at least one type of customer you serve."),
      otherCustomer: z.string().trim().max(200).default(""),
      serviceAreas: z
        .string()
        .trim()
        .min(1, "Please tell us the areas you serve.")
        .max(2000),
      businessLocation: z
        .string()
        .trim()
        .min(1, "Please tell us where your business is located.")
        .max(2000),
    }).shape,
    ...z.object({
      chooseReasons: z.array(z.string()).default([]),
      otherReason: z.string().trim().max(200).default(""),
      differentiator: z.string().trim().max(4000).default(""),
      certificates: z.string().trim().max(2000).default(""),
      certificateFiles: z.array(uploadedFileSchema).max(10).default([]),
      hasWarranty: z.enum(["", "yes", "no", "unsure"]).default(""),
      warrantyDetails: z.string().trim().max(3000).default(""),
    }).shape,
    ...z.object({
      solarBrands: z.string().trim().max(2000).default(""),
      packagesType: z.enum(["", "fixed", "custom", "both", "none"]).default(""),
      packageDetails: z.string().trim().max(6000).default(""),
      paymentPlans: z.enum(["", "yes", "no", "depends"]).default(""),
      paymentPlanDetails: z.string().trim().max(3000).default(""),
      installationProcess: z.string().trim().max(6000).default(""),
      getStarted: z.array(z.string()).default([]),
    }).shape,
    ...z.object({
      keyMessage: z.string().trim().max(2000).default(""),
      tagline: z.string().trim().max(160).default(""),
      referenceWebsites: z.string().trim().max(4000).default(""),
      teamMembers: z.array(teamMemberSchema).max(20).default([]),
      teamPhotos: z.array(uploadedFileSchema).max(15).default([]),
    }).shape,
    ...z.object({
      hasLogo: z.enum(["", "yes", "no", "update"]).default(""),
      logoFile: uploadedFileSchema.nullable().default(null),
      installationPhotos: z.array(uploadedFileSchema).max(30).default([]),
      hasTestimonials: z.enum(["", "yes", "no"]).default(""),
      testimonials: z.string().trim().max(10000).default(""),
      googleProfileUrl: optionalUrlSchema,
      socials: z
        .object({
          facebook: optionalUrlSchema,
          instagram: optionalUrlSchema,
          tiktok: optionalUrlSchema,
          linkedin: optionalUrlSchema,
          youtube: optionalUrlSchema,
          other: optionalUrlSchema,
        })
        .default({
          facebook: "",
          instagram: "",
          tiktok: "",
          linkedin: "",
          youtube: "",
          other: "",
        }),
      hasWebsite: z.enum(["", "yes", "no"]).default(""),
      websiteUrl: z.string().trim().max(300).default(""),
    }).shape,
    ...z.object({
      faqs: z.array(faqItemSchema).max(25).default([]),
      additionalInfo: z.string().trim().max(10000).default(""),
      preferredDelivery: z
        .enum(["", "whatsapp", "email", "drive", "later"])
        .default(""),
    }).shape,
    // Honeypot — bots fill this, humans never see it.
    company_website_field: z.string().max(200).optional().default(""),
  })
  .superRefine((data, ctx) => {
    // Conditional requirements (mirrors the per-step schemas)
    if (data.services.includes("Other") && !data.otherService) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherService"],
        message: "Please describe your other service.",
      });
    }
    if (data.customers.includes("Other") && !data.otherCustomer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherCustomer"],
        message: "Please describe your other customer type.",
      });
    }
    if (data.hasWarranty === "yes" && !data.warrantyDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["warrantyDetails"],
        message: "Please provide your warranty details.",
      });
    }
    if (
      (data.packagesType === "fixed" || data.packagesType === "both") &&
      !data.packageDetails
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["packageDetails"],
        message: "Please provide your package details.",
      });
    }
    if (data.paymentPlans === "yes" && !data.paymentPlanDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paymentPlanDetails"],
        message: "Please explain how your payment plan works.",
      });
    }
    if (data.hasTestimonials === "yes" && !data.testimonials) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["testimonials"],
        message: "Please paste your customer reviews.",
      });
    }
    if (data.hasWebsite === "yes" && !data.websiteUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["websiteUrl"],
        message: "Please enter your current website address.",
      });
    }
  });

export type OnboardingSubmission = z.infer<typeof onboardingSchema>;

/* ------------------------------------------------------------------ */
/* Error extraction                                                    */
/* ------------------------------------------------------------------ */

/** Flatten zod issues into a simple { fieldPath: message } map for inline errors. */
export function extractFieldErrors(
  error: z.ZodError
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (path && !out[path]) out[path] = issue.message;
  }
  return out;
}

/** Validate a single step (0-indexed) and return field errors, or null if valid. */
export function validateStep(
  step: number,
  data: unknown
): Record<string, string> | null {
  const schema = STEP_SCHEMAS[step];
  if (!schema) return null;
  const result = schema.safeParse(data);
  if (result.success) return null;
  return extractFieldErrors(result.error);
}
