/**
 * Shared types for the PowerGrowthz client onboarding form.
 */

export interface TeamMember {
  id: string;
  name: string;
  title: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface UploadedFile {
  /** File name as provided by the user's device. */
  name: string;
  /** Publicly accessible URL (Vercel Blob or local dev storage). */
  url: string;
  size: number;
  type: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  youtube: string;
  other: string;
}

export interface OnboardingData {
  // Step 01 — Business details
  businessName: string;
  firstName: string;
  lastName: string;
  businessEmail: string;
  ownerPhone: string;
  customerPhone: string;
  whatsappPhone: string;

  // Step 02 — About the business
  businessDescription: string;
  services: string[];
  otherService: string;
  customers: string[];
  otherCustomer: string;
  serviceAreas: string;
  businessLocation: string;

  // Step 03 — Differentiators
  chooseReasons: string[];
  otherReason: string;
  differentiator: string;
  certificates: string;
  certificateFiles: UploadedFile[];
  hasWarranty: "" | "yes" | "no" | "unsure";
  warrantyDetails: string;

  // Step 04 — Products, pricing & installation
  solarBrands: string;
  packagesType: "" | "fixed" | "custom" | "both" | "none";
  packageDetails: string;
  paymentPlans: "" | "yes" | "no" | "depends";
  paymentPlanDetails: string;
  installationProcess: string;
  getStarted: string[];

  // Step 05 — Brand & website content
  keyMessage: string;
  tagline: string;
  referenceWebsites: string;
  teamMembers: TeamMember[];
  teamPhotos: UploadedFile[];

  // Step 06 — Photos & online presence
  hasLogo: "" | "yes" | "no" | "update";
  logoFile: UploadedFile | null;
  installationPhotos: UploadedFile[];
  hasTestimonials: "" | "yes" | "no";
  testimonials: string;
  googleProfileUrl: string;
  socials: SocialLinks;
  hasWebsite: "" | "yes" | "no";
  websiteUrl: string;

  // Step 07 — Final details
  faqs: FaqItem[];
  additionalInfo: string;
  preferredDelivery: "" | "whatsapp" | "email" | "drive" | "later";

  // Anti-spam honeypot — must remain empty
  company_website_field: string;
}

export type StepErrors = Record<string, string>;

export interface SubmitResponse {
  ok: boolean;
  error?: string;
  fieldErrors?: StepErrors;
}

export const STEPS = [
  "Business Details",
  "Your Business",
  "What Makes You Different",
  "Products & Installation",
  "Brand & Website",
  "Photos & Online Presence",
  "Final Details",
] as const;

export const SERVICE_OPTIONS = [
  "Solar Panel Installation",
  "Inverter Installation",
  "Battery Installation / Replacement",
  "Complete Solar Power Systems",
  "Solar Maintenance & Repairs",
  "Solar System Upgrade",
  "Solar Consultation",
  "Energy Audit",
  "Solar Products / Equipment Sales",
  "Other",
] as const;

export const CUSTOMER_OPTIONS = [
  "Homeowners",
  "Businesses",
  "Offices",
  "Shops",
  "Schools",
  "Churches / Religious Organisations",
  "Hotels",
  "Estates",
  "Factories",
  "Farms",
  "Property Developers",
  "Other",
] as const;

export const REASON_OPTIONS = [
  "Affordable Pricing",
  "Quality Products",
  "Professional Installation",
  "Experienced Team",
  "Fast Response",
  "Excellent Customer Service",
  "After-Sales Support",
  "Warranty / Guarantee",
  "Honest Pricing",
  "Local Expertise",
  "5-Star Reviews",
  "Custom Solar Solutions",
  "Other",
] as const;

export const GET_STARTED_OPTIONS = [
  "Call us",
  "Send us a WhatsApp message",
  "Fill out an enquiry form",
  "Visit our office",
  "Book a consultation",
  "Any of the above",
] as const;

export const INITIAL_DATA: OnboardingData = {
  businessName: "",
  firstName: "",
  lastName: "",
  businessEmail: "",
  ownerPhone: "",
  customerPhone: "",
  whatsappPhone: "",

  businessDescription: "",
  services: [],
  otherService: "",
  customers: [],
  otherCustomer: "",
  serviceAreas: "",
  businessLocation: "",

  chooseReasons: [],
  otherReason: "",
  differentiator: "",
  certificates: "",
  certificateFiles: [],
  hasWarranty: "",
  warrantyDetails: "",

  solarBrands: "",
  packagesType: "",
  packageDetails: "",
  paymentPlans: "",
  paymentPlanDetails: "",
  installationProcess: "",
  getStarted: [],

  keyMessage: "",
  tagline: "",
  referenceWebsites: "",
  teamMembers: [],
  teamPhotos: [],

  hasLogo: "",
  logoFile: null,
  installationPhotos: [],
  hasTestimonials: "",
  testimonials: "",
  googleProfileUrl: "",
  socials: {
    facebook: "",
    instagram: "",
    tiktok: "",
    linkedin: "",
    youtube: "",
    other: "",
  },
  hasWebsite: "",
  websiteUrl: "",

  faqs: [],
  additionalInfo: "",
  preferredDelivery: "",

  company_website_field: "",
};
