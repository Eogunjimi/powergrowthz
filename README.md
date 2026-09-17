# PowerGrowthz Agency — Client Website Onboarding

A production-ready, mobile-first, 7-step onboarding form for Nigerian solar
installation business owners. Submissions are emailed (as a professionally
formatted HTML digest) to the PowerGrowthz team via **Resend**, with file
uploads stored on **Vercel Blob**.

## Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (custom premium design tokens)
- **Zod** — client-side per-step + server-side full validation
- **Resend** — transactional email (server-side only)
- **Vercel Blob** — file storage (local-disk fallback in development)
- **Lucide React** — icons

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

Open http://localhost:3000.

### Environment Variables

| Variable                | Required | Description                                                                 |
| ----------------------- | -------- | --------------------------------------------------------------------------- |
| `RESEND_API_KEY`        | Yes¹     | Server-side Resend API key. **Never exposed to the client.**                |
| `RESEND_FROM_EMAIL`     | No       | Verified sender, e.g. `PowerGrowthz Agency <onboarding@yourdomain.com>`     |
| `ONBOARDING_TO_EMAIL`   | No       | Recipient (defaults to `eogunjimi82@gmail.com`)                             |
| `BLOB_READ_WRITE_TOKEN` | Yes¹     | Vercel Blob token for file uploads                                          |
| `NEXT_PUBLIC_APP_URL`   | No       | Public app URL (used for dev upload links)                                  |

¹ Required in production. In development without `RESEND_API_KEY`, the email
is logged to the server console instead of sent, so the whole flow is testable
locally. Without `BLOB_READ_WRITE_TOKEN`, uploads fall back to local disk
(`.uploads/`, served by `/api/uploads/[...name]`).

### Resend setup

1. Create an account at [resend.com](https://resend.com) and add/verify a
   sending domain (or use the default `onboarding@resend.dev` for testing).
2. Create an API key and set `RESEND_API_KEY` in `.env.local` (local) and in
   your Vercel project settings (production).

### Deploying to Vercel

1. Push this repo to GitHub/GitLab.
2. Import it at [vercel.com/new](https://vercel.com/new) (framework auto-detected).
3. Create a Vercel Blob store and connect it to the project (this sets
   `BLOB_READ_WRITE_TOKEN` automatically), or add the token manually.
4. Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ONBOARDING_TO_EMAIL`.
5. Deploy.

## Project Structure

```
/app
  /page.tsx                     Landing page: header, intro, form
  /api/onboarding/route.ts      POST — validates (Zod), rate-limits, emails via Resend
  /api/upload/route.ts          POST — file upload endpoint (type/size restricted)
  /api/uploads/[...name]/route  GET  — dev fallback serving of local uploads
/components/onboarding
  OnboardingForm.tsx            Orchestrator: state, navigation, validation, submission
  ProgressIndicator.tsx         Step counter + progress bar (compact on mobile)
  StepBusinessDetails.tsx       Step 01
  StepBusiness.tsx              Step 02
  StepDifferentiators.tsx       Step 03
  StepProducts.tsx              Step 04
  StepBrand.tsx                 Step 05
  StepOnlinePresence.tsx        Step 06
  StepFinalDetails.tsx          Step 07
  FormNavigation.tsx            Back / Continue / Submit + error retry
  FileUpload.tsx                Drag & tap upload with progress, list, remove
  SuccessScreen.tsx             Post-submit confirmation
  fields.tsx                    Reusable Field / TextInput / TextArea / CheckboxCards / RadioCards
/lib
  validation.ts                 Zod schemas (per-step + full), Nigerian phone normalization
  email.ts                      HTML email builder (fully escaped) + Resend sender
  upload.ts                     Storage abstraction (Vercel Blob / local fallback)
  rate-limit.ts                 In-memory rate limiter
/types
  onboarding.ts                 Shared types, options, initial state
```

## Features

- **7-step wizard** with per-step Zod validation and friendly error messages
  ("Please enter a valid Nigerian phone number…").
- **Nigerian phone support** — accepts `08012345678`, `0812 345 6789`,
  `+2348012345678`, `2348012345678`, etc.; normalized to `+234…` in the email.
- **Conditional fields & validation** — warranty details required when
  "Yes"; package details required for fixed packages; testimonials required
  when "Yes"; etc.
- **Draft persistence** — answers saved to `localStorage`; nothing is lost on
  refresh or step navigation.
- **File uploads** — JPG/PNG/WEBP (+PDF for certificates), 10 MB max, stored
  on Vercel Blob; secure URLs included in the email (never attached inline).
- **Email** — branded HTML digest sent to `ONBOARDING_TO_EMAIL` with subject
  `New Solar Website Client — {Business Name}`, `Reply-To` set to the client's
  email, plus a plain-text fallback.
- **Security** — API keys server-side only; HTML-escaping of all user input
  in emails; honeypot field; in-memory rate limiting (5 submissions /
  10 min / IP); upload type & size restrictions; path-traversal protection;
  generic client-facing error messages with server-side logging.
- **Mobile-first** — single-column layout, large touch targets, 16px inputs
  (no iOS zoom), compact progress indicator, sticky-visible navigation.
- **Accessibility** — labelled inputs, `role="radiogroup"`/`group`,
  `aria-invalid`, `role="alert"` errors, visible focus rings, keyboard
  navigable.

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```
