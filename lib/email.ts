import { Resend } from "resend";
import type { OnboardingSubmission } from "./validation";
import { normalizeNigerianPhone } from "./validation";

/* ------------------------------------------------------------------ */
/* Sanitisation — every user value is HTML-escaped before rendering.   */
/* ------------------------------------------------------------------ */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(value: string): string {
  return escapeHtml(value.trim()).replace(/\n/g, "<br />");
}

function phone(raw: string): string {
  const normalized = normalizeNigerianPhone(raw);
  return escapeHtml(normalized ?? raw);
}

function notProvided(): string {
  return `<span style="color:#98a2b3;font-style:italic;">Not provided</span>`;
}

function textOr(value: string | undefined | null): string {
  return value && value.trim() ? nl2br(value) : notProvided();
}

function linkOr(value: string | undefined | null): string {
  if (!value || !value.trim()) return notProvided();
  const href = value.trim().startsWith("http")
    ? value.trim()
    : `https://${value.trim()}`;
  return `<a href="${escapeHtml(href)}" style="color:#B68A2F;text-decoration:underline;word-break:break-all;">${escapeHtml(value.trim())}</a>`;
}

function listOr(items: string[]): string {
  const filled = items.filter(Boolean);
  if (filled.length === 0) return notProvided();
  return `<ul style="margin:0;padding-left:20px;">${filled
    .map(
      (item) =>
        `<li style="margin:3px 0;color:#344054;">${escapeHtml(item)}</li>`
    )
    .join("")}</ul>`;
}

function fileLinksOr(
  files: { name: string; url: string }[] | null | undefined
): string {
  if (!files || files.length === 0) return notProvided();
  return `<ul style="margin:0;padding-left:20px;">${files
    .map(
      (f) =>
        `<li style="margin:4px 0;"><a href="${escapeHtml(
          f.url
        )}" style="color:#B68A2F;text-decoration:underline;word-break:break-all;">${escapeHtml(
          f.name
        )}</a></li>`
    )
    .join("")}</ul>`;
}

/* ------------------------------------------------------------------ */
/* Email HTML                                                          */
/* ------------------------------------------------------------------ */

function row(label: string, valueHtml: string): string {
  return `
  <tr>
    <td style="padding:10px 16px 10px 0;width:230px;vertical-align:top;color:#667085;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">
      ${escapeHtml(label)}
    </td>
    <td style="padding:10px 0;vertical-align:top;color:#111111;font-size:15px;line-height:1.55;">
      ${valueHtml}
    </td>
  </tr>`;
}

function section(title: string, rows: string[]): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:28px;">
    <tr>
      <td style="padding:0 0 10px 0;">
        <div style="font-size:14px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#B68A2F;">${escapeHtml(
          title
        )}</div>
        <div style="height:2px;background:#F0E6CE;border-radius:2px;margin-top:6px;"></div>
      </td>
    </tr>
    <tr>
      <td style="padding:6px 0 0 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${rows.join("")}
        </table>
      </td>
    </tr>
  </table>`;
}

const PACKAGE_LABELS: Record<string, string> = {
  fixed: "Yes, we have fixed packages",
  custom: "We provide custom quotes",
  both: "We offer both",
  none: "No standard packages yet",
};

const PAYMENT_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  depends: "Depends on the project/customer",
};

const WARRANTY_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  unsure: "Not sure",
};

const LOGO_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  update: "I have one but want to update it",
};

const DELIVERY_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
  drive: "Google Drive",
  later: "I'll provide them later",
};

export function buildOnboardingEmailHtml(data: OnboardingSubmission): string {
  const submittedAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Lagos",
    dateStyle: "full",
    timeStyle: "short",
  });

  const services = [...data.services];
  if (data.otherService.trim()) {
    services[services.indexOf("Other")] = `Other — ${data.otherService.trim()}`;
  }
  const customers = [...data.customers];
  if (data.otherCustomer.trim()) {
    const i = customers.indexOf("Other");
    if (i >= 0) customers[i] = `Other — ${data.otherCustomer.trim()}`;
  }
  const reasons = [...(data.chooseReasons ?? [])];
  if (data.otherReason.trim()) {
    const i = reasons.indexOf("Other");
    if (i >= 0) reasons[i] = `Other — ${data.otherReason.trim()}`;
  }

  const socialRows = Object.entries(data.socials ?? {})
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => row(k.charAt(0).toUpperCase() + k.slice(1), linkOr(v)));

  const teamHtml =
    data.teamMembers.length === 0
      ? notProvided()
      : `<ul style="margin:0;padding-left:20px;">${data.teamMembers
          .map(
            (m) =>
              `<li style="margin:3px 0;color:#344054;"><strong>${escapeHtml(
                m.name
              )}</strong>${
                m.title ? ` — ${escapeHtml(m.title)}` : ""
              }</li>`
          )
          .join("")}</ul>`;

  const faqHtml =
    data.faqs.length === 0
      ? notProvided()
      : data.faqs
          .map(
            (f) => `
        <div style="margin-bottom:12px;">
          <div style="font-weight:700;color:#111111;font-size:15px;">Q: ${escapeHtml(
            f.question
          )}</div>
          <div style="color:#344054;font-size:14px;margin-top:2px;">A: ${nl2br(
            f.answer
          )}</div>
        </div>`
          )
          .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#F8F7F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7F4;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#111111;padding:28px 32px;">
              <div style="font-size:20px;font-weight:800;letter-spacing:2px;color:#FFFFFF;">POWERGROWTHZ <span style="color:#C8A24A;">AGENCY</span></div>
              <div style="font-size:12px;letter-spacing:1.6px;text-transform:uppercase;color:#C8A24A;margin-top:8px;font-weight:600;">New Client Website Onboarding</div>
              <div style="font-size:13px;color:#98A2B3;margin-top:10px;">Submitted ${escapeHtml(submittedAt)} (WAT)</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">

              ${section("Client Information", [
                row("Business Name", `<strong style="font-size:17px;">${escapeHtml(data.businessName)}</strong>`),
                row("Owner Name", escapeHtml(`${data.firstName} ${data.lastName}`)),
                row("Business Email", `<a href="mailto:${escapeHtml(data.businessEmail)}" style="color:#B68A2F;">${escapeHtml(data.businessEmail)}</a>`),
                row("Personal Contact", phone(data.ownerPhone)),
                row("Customer Contact", phone(data.customerPhone)),
                row("WhatsApp", data.whatsappPhone ? phone(data.whatsappPhone) : notProvided()),
              ])}

              ${section("Business Information", [
                row("Business Description", textOr(data.businessDescription)),
                row("Services", listOr(services)),
                row("Target Customers", listOr(customers)),
                row("Service Areas", textOr(data.serviceAreas)),
                row("Business Location", textOr(data.businessLocation)),
              ])}

              ${section("What Makes Them Different", [
                row("Reasons Customers Should Choose Them", listOr(reasons)),
                row("Unique Selling Points", textOr(data.differentiator)),
                row("Certificates, Awards & Partnerships", textOr(data.certificates)),
                row("Supporting Documents", fileLinksOr(data.certificateFiles)),
                row("Offers Warranty / Guarantee", escapeHtml(WARRANTY_LABELS[data.hasWarranty] ?? "Not answered")),
                ...(data.hasWarranty === "yes"
                  ? [row("Warranty Details", textOr(data.warrantyDetails))]
                  : []),
              ])}

              ${section("Products & Installation", [
                row("Solar Brands", textOr(data.solarBrands)),
                row("Packages / Pricing", escapeHtml(PACKAGE_LABELS[data.packagesType] ?? "Not answered")),
                ...(data.packagesType === "fixed" || data.packagesType === "both"
                  ? [row("Package Details", textOr(data.packageDetails))]
                  : []),
                row("Payment Plans", escapeHtml(PAYMENT_LABELS[data.paymentPlans] ?? "Not answered")),
                ...(data.paymentPlans === "yes"
                  ? [row("Payment Plan Details", textOr(data.paymentPlanDetails))]
                  : []),
                row("Installation Process", textOr(data.installationProcess)),
                row("How New Customers Get Started", listOr(data.getStarted)),
              ])}

              ${section("Brand & Website", [
                row("Key Message", textOr(data.keyMessage)),
                row("Tagline", textOr(data.tagline)),
                row("Reference Websites", textOr(data.referenceWebsites)),
                row("Team Members", teamHtml),
                row("Team Photos", fileLinksOr(data.teamPhotos)),
              ])}

              ${section("Photos & Online Presence", [
                row("Business Logo", escapeHtml(LOGO_LABELS[data.hasLogo] ?? "Not answered")),
                ...(data.logoFile ? [row("Logo File", fileLinksOr([data.logoFile]))] : []),
                row("Installation Photos", fileLinksOr(data.installationPhotos)),
                row("Has Testimonials", data.hasTestimonials === "yes" ? "Yes" : data.hasTestimonials === "no" ? "No" : notProvided()),
                ...(data.hasTestimonials === "yes"
                  ? [row("Testimonials", textOr(data.testimonials))]
                  : []),
                row("Google Business Profile", linkOr(data.googleProfileUrl)),
                ...(socialRows.length > 0 ? [row("Social Media", `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${socialRows.join("")}</table>`)] : [row("Social Media", notProvided())]),
                row("Existing Website", data.hasWebsite === "yes" ? linkOr(data.websiteUrl) : data.hasWebsite === "no" ? "No" : notProvided()),
              ])}

              ${section("FAQ", [faqHtml ? `<tr><td style="padding:10px 0;">${faqHtml}</td></tr>` : row("FAQs", notProvided())])}

              ${section("Final Notes", [
                row("Additional Information", textOr(data.additionalInfo)),
                row("Preferred Material Delivery", escapeHtml(DELIVERY_LABELS[data.preferredDelivery] ?? "Not answered")),
              ])}

              <div style="border-top:1px solid #E5E7EB;margin-top:8px;padding-top:20px;font-size:12px;color:#98A2B3;">
                This submission was received through the PowerGrowthz Agency client onboarding form.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* Sending                                                             */
/* ------------------------------------------------------------------ */

export async function sendOnboardingEmail(
  data: OnboardingSubmission
): Promise<void> {
  const to = process.env.ONBOARDING_TO_EMAIL ?? "eogunjimi82@gmail.com";
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Allow local development/testing without credentials. In production the
    // deploy must provide RESEND_API_KEY (see .env.example).
    if (process.env.NODE_ENV === "production") {
      console.error("[onboarding] RESEND_API_KEY is not configured.");
      throw new Error("Email service is not configured.");
    }
    console.warn(
      "[onboarding] RESEND_API_KEY not set — skipping send in development. Email HTML logged below."
    );
    console.log(buildOnboardingEmailHtml(data).slice(0, 4000));
    return;
  }

  const resend = new Resend(apiKey);
  const subject = `New Solar Website Client — ${data.businessName}`.slice(0, 200);

  const { error } = await resend.emails.send({
    from:
      process.env.RESEND_FROM_EMAIL ?? "PowerGrowthz Onboarding <onboarding@resend.dev>",
    to: [to],
    replyTo: data.businessEmail,
    subject,
    html: buildOnboardingEmailHtml(data),
    text: buildPlainTextEmail(data),
  });

  if (error) {
    console.error("[onboarding] Resend error:", error);
    throw new Error("Failed to send email.");
  }
}

function buildPlainTextEmail(data: OnboardingSubmission): string {
  const lines: string[] = [
    "POWERGROWTHZ AGENCY — NEW CLIENT WEBSITE ONBOARDING",
    "",
    "CLIENT INFORMATION",
    `Business Name: ${data.businessName}`,
    `Owner Name: ${data.firstName} ${data.lastName}`,
    `Business Email: ${data.businessEmail}`,
    `Personal Contact: ${data.ownerPhone}`,
    `Customer Contact: ${data.customerPhone}`,
    `WhatsApp: ${data.whatsappPhone || "Not provided"}`,
    "",
    "BUSINESS INFORMATION",
    `Services: ${data.services.join(", ")}`,
    `Target Customers: ${data.customers.join(", ")}`,
    `Service Areas: ${data.serviceAreas}`,
    `Business Location: ${data.businessLocation}`,
    `Business Description: ${data.businessDescription || "Not provided"}`,
    "",
    "WHAT MAKES THEM DIFFERENT",
    `Reasons: ${data.chooseReasons.join(", ") || "Not provided"}`,
    `USP: ${data.differentiator || "Not provided"}`,
    `Certificates/Awards/Partnerships: ${data.certificates || "Not provided"}`,
    `Warranty: ${data.hasWarranty || "Not answered"}${data.warrantyDetails ? ` — ${data.warrantyDetails}` : ""}`,
    "",
    "PRODUCTS & INSTALLATION",
    `Solar Brands: ${data.solarBrands || "Not provided"}`,
    `Packages: ${data.packagesType || "Not answered"}${data.packageDetails ? ` — ${data.packageDetails}` : ""}`,
    `Payment Plans: ${data.paymentPlans || "Not answered"}${data.paymentPlanDetails ? ` — ${data.paymentPlanDetails}` : ""}`,
    `Installation Process: ${data.installationProcess || "Not provided"}`,
    `Get Started: ${data.getStarted.join(", ") || "Not provided"}`,
    "",
    "BRAND & WEBSITE",
    `Key Message: ${data.keyMessage || "Not provided"}`,
    `Tagline: ${data.tagline || "Not provided"}`,
    `Reference Websites: ${data.referenceWebsites || "Not provided"}`,
    `Team: ${data.teamMembers.map((m) => `${m.name}${m.title ? ` (${m.title})` : ""}`).join(", ") || "Not provided"}`,
    "",
    "PHOTOS & ONLINE PRESENCE",
    `Logo: ${data.hasLogo || "Not answered"}${data.logoFile ? ` — ${data.logoFile.url}` : ""}`,
    `Installation Photos: ${data.installationPhotos.map((f) => f.url).join(", ") || "None"}`,
    `Testimonials: ${data.testimonials || "Not provided"}`,
    `Google Profile: ${data.googleProfileUrl || "Not provided"}`,
    `Socials: ${Object.entries(data.socials).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(", ") || "Not provided"}`,
    `Existing Website: ${data.hasWebsite === "yes" ? data.websiteUrl : data.hasWebsite || "Not answered"}`,
    "",
    "FAQ",
    ...data.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`),
    "",
    "FINAL NOTES",
    `Additional Info: ${data.additionalInfo || "Not provided"}`,
    `Preferred Delivery: ${data.preferredDelivery || "Not answered"}`,
  ];
  return lines.join("\n");
}
