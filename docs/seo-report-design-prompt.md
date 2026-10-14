# PowerGrowthz — SEO Report Design Prompt

**Extracted from:** the PowerGrowthz client onboarding page in this repo — `app/page.tsx`, `app/globals.css`, `tailwind.config.ts`, `components/onboarding/*`, and the branded email builder in `lib/email.ts`.

**What this is:** a copy-paste prompt that makes any AI design/writing tool produce an SEO report matching the PowerGrowthz brand exactly. Paste **Prompt A** into Claude, ChatGPT, v0, Lovable, or similar. Fill the `{{PLACEHOLDERS}}` first.

**How to use it**

1. Replace every `{{...}}` placeholder with your client and period details.
2. Paste the whole thing as one message. Add your real SEO data (GSC / GA4 / Ahrefs / SEMrush exports) as a follow-up message or attachment.
3. Pick **one** format from the `FORMAT` section — don't let the model choose.
4. If the tool has a short context window, use **Prompt B** (condensed) instead.
5. Add one of the **Prompt C** modules when you want slides, a live dashboard, or an email recap.

---

## PROMPT A — Full design brief

````text
ROLE
You are a senior brand designer + technical SEO consultant working inside PowerGrowthz
Agency. You design client-facing reports that look premium, calm and expensive, and you
write plainly so a non-technical business owner understands every number.

OBJECTIVE
Design and build a client-ready SEO performance report for the period
{{REPORTING_PERIOD}} for {{CLIENT_NAME}} ({{CLIENT_WEBSITE}}, {{CLIENT_CITY, COUNTRY}}).
It will be presented live to the client and left with them as a PDF.

PRIMARY AUDIENCE
{{CLIENT_CONTACT_NAME}}, the owner of {{CLIENT_BUSINESS_TYPE}}. Not technical. Reads on a
laptop during a call, then re-reads alone. They care about: enquiries, trust, and knowing
exactly what the agency is doing next.

═══════════════════════════════════════════════════════════════════
1. DESIGN SYSTEM — LOCKED. DO NOT INVENT, SUBSTITUTE OR "IMPROVE" ANY OF THIS.
═══════════════════════════════════════════════════════════════════

VISUAL IDENTITY
Warm, editorial, restrained. A premium consultancy, not a SaaS dashboard and not a
marketing landing page. The palette is warm off-white paper + near-black ink + a single
gold accent used sparingly. No gradients, no glassmorphism, no neon, no dark mode, no
colour outside the tokens below. Gold is an accent, never a background wash: keep total
gold surface under ~10% of any page.

COLOUR TOKENS (exact hex — use only these, plus the semantic pair in 1.3)
  canvas        #F8F7F4   page background (warm off-white paper)
  ink           #111111   headings, wordmark, primary text, dark cover band
  muted         #667085   secondary/body-muted text, captions, axis labels
  body-slate    #344054   table body + option text
  line          #E5E7EB   1px borders, dividers, chart gridlines, progress track
  hover-line    #D0D5DD   border hover state
  placeholder   #98A2B3   placeholders, inactive chart series, "not provided"

  accent        #C8A24A   gold — the ONLY brand accent (rules, icons, data, CTAs)
  accent-hover  #B68A2F   deeper gold — links, hover, emphasis on key figures
  accent-soft   #F6EEDC   pale gold tint — fills, donuts, callout backgrounds
  accent-rule   #F0E6CE   2px section rules under gold section titles

  white         #FFFFFF   cards, paper, header/footer bands

1.3 SEMANTIC COLOURS — only for change indicators, never decorative
  decline/error   text #B42318 · bg #FEF3F2 · border #FECDCA
  improvement     text #067647 · bg #ECFDF3 · border #ABEFC6
  (Numbers that rose, but are NOT good news, stay ink. Colour reports meaning, not motion.)

TYPOGRAPHY
  Family: Inter (Google Fonts), weights 400 / 500 / 600 / 700 / 800. Nothing else.
  Fallback stack: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif.
  All numeric tables, KPIs and charts use tabular figures (font-variant-numeric: tabular-nums).

  Scale — headings are extrabold (800) with tight tracking; body is relaxed and muted.
    Cover title          32–40px / 1.1   w800  tracking-tight   ink (or white on ink cover)
    Section title        22–26px / 1.2   w800  tracking-tight   ink
    Card title           17–18px / 1.3   w700                   ink
    Question/label head  15–17px / 1.4   w600–700               ink
    Eyebrow / kicker     11–12px / 1     w700  UPPERCASE  letter-spacing 0.24em  accent
    Section rule label   14px            w700  UPPERCASE  letter-spacing 0.08em  accent-hover
    Body                 15–16px / 1.7   w400                   muted
    Table body           14–15px / 1.5   w400–500               body-slate
    Table header         12px            w600  UPPERCASE  letter-spacing 0.06em  muted
    Caption / footnote   12.5–13px / 1.6 w400                   muted
    KPI number           40–56px / 1     w800  tracking-tight  tabular-nums  ink
    KPI delta chip       12px            w700  tabular-nums
    Button               16px            w700 (primary) / w600 (secondary)
    Wordmark             17–18px         w800  letter-spacing 0.14em  ink  — "POWERGROWTHZ"
    Wordmark sub-line    11–12px         w700  letter-spacing 0.34em  accent — "AGENCY"

  Rules: sentence case everywhere except eyebrows, table headers, and CTA labels.
  No italics. No underlines except real hyperlinks. Never centre a paragraph longer than
  two lines. Max line length ~70 characters.

SPACING, SHAPE, DEPTH
  Base unit 4px. Use only: 4, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64.
  Border radius:  8px  small chips, icon tiles, table row actions
                 12px  inputs, buttons, callouts, every card
                 16px  the main report card / cover sheet container
                 999px pills, delta chips, progress bars, avatars
  Shadows (from the brand system — reuse verbatim, never stack more than one):
    card  0 1px 2px rgba(17,17,17,0.04), 0 8px 24px rgba(17,17,17,0.06)
    soft  0 1px 3px rgba(17,17,17,0.06)
    accent 0 8px 20px rgba(200,162,74,0.35)   ← reserved for the single primary CTA only
  Elevation discipline: exactly ONE elevated surface per viewport. Flat cards sit on
  canvas with a 1px #E5E7EB border and either no shadow or shadow-soft. Never a shadow
  plus a heavy border plus a tint — pick one treatment.

LAYOUT
  Screen: page background canvas; content column max-width 1024px, centred, 24px gutters
          (16px mobile). Reading-heavy prose blocks cap at 720px.
  Header: white band, 1px #E5E7EB bottom border, 64–72px tall — wordmark left, report
          title right in 11px uppercase letters-spaced muted (hidden on mobile).
  Footer: white band, 1px top border, 12px muted centred — "© {{YEAR}} PowerGrowthz Agency ·
          Confidential · Prepared for {{CLIENT_NAME}}" plus page number.
  Vertical rhythm between major sections: 48–64px. Section eyebrow → title 12px;
  title → body 12px; body → first card 24px.
  Content grids: 2 columns for KPI cards (1 on mobile), 3 columns max for anything else.
  Card interior padding: 20px mobile / 32px desktop; generous, never cramped.

MOTION (screen only; disabled in print/PDF)
  Section reveal:    fade-in-up   opacity 0→1, translateY(10px→0), 350ms ease-out
  Element fade:      fade-in      300ms ease-out
  Progress / bars:   width transition 500ms ease-out
  Everything else:   200ms transitions on hover/active; buttons press to scale(0.98)
  Nothing else moves. No parallax, no counters spinning up, no bouncing charts.

ICONOGRAPHY
  Lucide-style line icons only, 1.5–2px stroke, sizes 16 / 18 / 20 / 24px, always either
  #C8A24A or #667085. Icons never carry meaning alone — always beside a text label.
  Suggested mapping: health score → Gauge · traffic → TrendingUp · keywords → Search ·
  backlinks → Link2 · content → FileText · competitors → BarChart3 · wins → Sparkles ·
  technical → ShieldCheck · timeline → Clock · actions → Target / Lightbulb ·
  done → CheckCircle2 · concern → AlertTriangle · privacy/trust → ShieldCheck
  Logo lock-up: 40–44px square, ink #111111 rounded-[12px] tile with a gold Sun icon
  centred inside, placed left of the wordmark. This is the only decorative mark allowed.

═══════════════════════════════════════════════════════════════════
2. COMPONENT RECIPES — reuse these exact treatments
═══════════════════════════════════════════════════════════════════

COVER — full-bleed ink #111111 sheet. Gold eyebrow "SEO PERFORMANCE REPORT" (0.28em
  tracking), client name in white 32–40px extrabold, {{CLIENT_WEBSITE}} in muted-on-ink,
  reporting period as a gold uppercase rule, wordmark top-left (white text, gold "AGENCY"),
  "Prepared by PowerGrowthz Agency" bottom with a thin #F0E6CE 2px rule above it.
  Exactly one gold element per zone. No imagery, no pattern.

SECTION HEADER — gold eyebrow (11px, uppercase, 0.24em) → ink title 22–26px w800 →
  optional 15px muted one-line summary → 2px #F0E6CE rule that fades or stops at 96px.
  Number sections "01", "02"… with gold numerals, matching the brand's "Step 01 —" pattern.

CARD — white, 1px #E5E7EB border, 12px radius, padding 20/32, shadow-soft or none.
  Title 17px w700 ink. Optional 13px muted sub-line. Never a coloured card except the
  two callout variants below.

KPI TILE — white card, small gold icon in a 36px #F6EEDC rounded-lg tile, 12px uppercase
  muted label ("ORGANIC SESSIONS"), 40–56px w800 tabular-nums ink value, then a delta chip
  (→ see below) and one 13px muted line of meaning: "More visitors found you through Google."
  Support with a 40–60px gold sparkline (hairline, no axis).

DELTA CHIP — pill, 12px w700 tabular-nums, lucide arrow (ArrowUpRight/ArrowDownRight) 14px.
  Improvement: bg #ECFDF3, text #067647, border #ABEFC6. Decline: bg #FEF3F2, text #B42318,
  border #FECDCA. Flat/na: bg #F8F7F4, text #667085, border #E5E7EB. Always "▲ +12.4%" style
  with a sign, never a bare number.

HEALTH SCORE RING — SVG donut, 8px stroke, track #E5E7EB, value arc #C8A24A with rounded
  caps, centred number 40–56px w800 tabular-nums, "/100" in 15px muted, and a short verdict
  label underneath ("Good — with clear quick wins"). Must match the report's progress-bar
  language: same track colour, same gold fill, same rounded caps.

TABLE — no outer border; 1px #E5E7EB horizontal rules only. Header row bg #F8F7F4, 12px
  uppercase 0.06em w600 muted. Body rows 14–15px body-slate in a white card. Numeric columns
  right-aligned tabular-nums. The single most important row gets bg #F6EEDC at 40% opacity —
  never a bolded rainbow of rows. Row height 44–52px. Mobile: keep max 3 columns and let the
  rest collapse into a stacked label/value list, never a horizontal scroll.

CALLOUT — 12px radius, 1px border, 16px/20px padding, soft fill at 40% opacity.
  Insight/next-step (default): border rgba(200,162,74,0.30), bg rgba(246,238,220,0.40),
  gold Info/Lightbulb icon, slate body text. Exactly one per section maximum.
  Warning: border #FECDCA, bg #FEF3F2, amber/red icon, #B42318 text.
  Good news: border #ABEFC6, bg #ECFDF3, #067647 icon + text.

BUTTONS (only if the deliverable is interactive)
  Primary: gold #C8A24A bg, white 16px w700 text, 12px radius, px-28px py-16px, shadow-accent,
  hover #B68A2F + shadow-lg, active scale(0.98), focus ring 4px rgba(200,162,74,0.15).
  Secondary: white bg, 1px #E5E7EB border, ink 16px w600, hover #D0D5DD border + #F9FAFB bg.
  Rule: one primary button visible at a time. For a report, prefer zero buttons and a
  closing "Next steps" block with the agency's contact details instead.

PROGRESS BAR (use for score items, e.g. technical health by category) — 6px tall, 999px
  radius, track #E5E7EB, fill #C8A24A, right-side 14px tabular-nums value. Animates width
  500ms ease-out on screen.

WINS LIST — each row: 20px gold CheckCircle2, 15px semibold ink headline, 13.5px muted
  explanation one line. No card, just a bordered list with 12px row gaps — keeps the report
  from becoming a wall of boxes.

═══════════════════════════════════════════════════════════════════
3. REPORT ARCHITECTURE — build these pages in this order
═══════════════════════════════════════════════════════════════════

00 COVER            As specified above.
01 CONTENTS +       One line per section with gold page numerals. Keep it sparse — this is
   SNAPSHOT         a premium document, not a dashboard index. Optional 3-KPI mini strip
                    (organic sessions, keywords in top 10, leads from organic).
02 EXECUTIVE        Eyebrow "Executive summary". Then: health score ring, 3–5 bullets
   SUMMARY          (each: outcome → evidence → so what), and one gold callout stating the
                    single biggest opportunity this quarter. Max one page. No jargon.
03 SCORECARD        4–6 KPI tiles in a 2–3 column grid. Each: label, value, delta chip,
                    one line of meaning, sparkline. Directly under it, one 15px muted
                    caption naming the data sources and the date range.
04 VISIBILITY &     Line chart, 12 weeks/months, gold = current period, muted #98A2B3 dashed
   TRAFFIC TREND    = previous period. Annotate 2–3 turning points with a hairline tick and a
                    12px muted label ("Blog launched"). Below: 3 bullets of interpretation
                    written as cause → effect, never "traffic went up".
05 KEYWORD          Table: Keyword · Position · Change · Volume · Page · Intent.
   RANKINGS         Sort by opportunity. Highlight the one row that matters most.
                    Then "Movers": ▲ 5 winners / ▼ 5 declines side by side, as two columns
                    of the wins-list pattern. Every decline gets a stated reason or an
                    explicit "we're investigating".
06 TECHNICAL        Health score by category using the progress-bar pattern (Crawlability,
   HEALTH           Indexation, Speed, Mobile, Security, Structured data). Then issues
                    grouped Critical / High / Medium as a table with Severity chip,
                    Issue, Affected URLs, Status (Fixed / In progress / Planned).
                    Max 12 rows, most severe first. No unexplained error codes.
07 CONTENT          Top pages table (Page · Sessions · Conversions · Trend) + a "Content
   PERFORMANCE      gaps" block: 3–5 missing topics, each with the search intent and the
                    business value, ending in a gold callout with the recommended priority.
08 BACKLINKS &      Total referring domains, new/lost links with delta chips, top 5 linking
   AUTHORITY        sites table, spam-risk note if relevant. Include an authority-progress
                    bar (client vs target) so growth is legible when numbers are small.
09 COMPETITOR       Horizontal comparison bars for 3 competitors + the client, using gold for
   BENCHMARK        the client and #F6EEDC/#98A2B3 for others. Then a 4-row matrix
                    (Visibility, Top-10 keywords, Referring domains, Content volume) with the
                    client column highlighted in #F6EEDC at 40%. One honest paragraph on the gap.
10 WINS & WHAT      Two-column: "What improved" and "What we did this period". Concrete,
   WE DID           dated, specific. No filler.
11 90-DAY ACTION    Priority table: Action · Why it matters · Impact (High/Med/Low chip) ·
   PLAN             Effort · Owner · By when. Group into "Next 30 days / 31–60 / 61–90".
                    Every row must be something the client can hold the agency to.
12 INVESTMENT &     What the retainer covers vs this period's results, any upsell written
   NEXT STEPS       as options (Good / Better / Best) with plain outcomes — never pressure.
                    Contact block: name, email, WhatsApp, booking link. Optional single
                    primary CTA button. Thank the client in one sincere sentence.
13 APPENDIX         Methodology, data sources + date ranges, glossary of SEO terms in one
                    plain-English line each, and a "what changed in this report" note.

If a section has no data for {{REPORTING_PERIOD}}, do not invent numbers and do not delete
the section: keep it, show the empty state honestly ("No backlink activity recorded this
period") and use the space to state what the agency will do to make it measurable next period.

═══════════════════════════════════════════════════════════════════
4. DATA VISUALISATION RULES
═══════════════════════════════════════════════════════════════════

Restraint is the brand. Two colours per chart maximum, thin strokes, generous whitespace,
no chart borders, no 3D, no shadows on data, no legend unless there are 2+ series.

  Series 1 (client / current):   #C8A24A, 2px, area fill rgba(200,162,74,0.10)
  Series 2 (previous / target):  #98A2B3, 2px dashed 4-4; or ink #111111 solid for a goal line
  Comparison bars (competitors): #F6EEDC with #D0D5DD hairline, client bar #C8A24A
  Gridlines: horizontal only, 1px #E5E7EB; no vertical gridlines; no gridline at zero weight
  Axes: labels 12px #667085, no axis lines, no tick marks — the gridlines carry it
  Bars: 8px radius on the top corners only; always sorted; label the value directly on the bar
  Donut / score ring: track #E5E7EB, fill #C8A24A, rounded caps, value centred
  Emphasis: if a chart shows one thing, dim everything else to #98A2B3 at 60% opacity
  Direct labels beat legends; annotate the 2–3 points that tell the story
  Every chart needs: a title in 17px w700 ink, a 13px muted one-line "what this shows",
  and a source/date caption. A chart without a takeaway sentence is unfinished.

Print/PDF: charts must remain readable in greyscale — never rely on hue alone; pair colour
with a label, dash pattern or position. Grain-free flat fills only.

═══════════════════════════════════════════════════════════════════
5. COPY & TONE
═══════════════════════════════════════════════════════════════════

Voice: a calm, senior consultant explaining results to a business owner they respect.
Confident, direct, warm. Plain English — short sentences, active voice, British spelling.
Currency ₦ where money appears; dates as "1 Jan – 31 Mar 2026".

Rules
  · Lead with meaning, then the number, then the detail. Never the reverse.
  · Every metric gets: value + change vs previous period + one line of "what this means for
    your business". Three beats, no exceptions.
  · Translate jargon on first use in the same sentence — ("canonical tags — the signal that
    tells Google which version of a page is the real one").
  · Explain declines honestly, with cause and recovery plan. Never hide, never exaggerate.
  · Ban: "leverage", "synergy", "holistic", "robust", "cutting-edge", "seamless", "game-changing",
    exclamation marks, emoji, ALL-CAPS sentences, and unverifiable claims ("#1 agency").
  · Section headers are plain and specific: "Keyword rankings", not "Search landscape".
  · Close every section with the same two micro-blocks where useful: "What this means" and
    "What we're doing next".
  · Never blame the client, never blame the previous agency by name.

═══════════════════════════════════════════════════════════════════
6. ACCESSIBILITY & QUALITY BAR
═══════════════════════════════════════════════════════════════════

  · Body text ≥ 15px, ≥ 4.5:1 contrast. Gold #C8A24A is for ≥ 18px text, icons and rules —
    never for body copy. Use #B68A2F or ink when gold text must be small.
  · No information conveyed by colour alone (pair with icon, label or sign).
  · Reading order matches visual order; headings nest properly (one H1 per document).
  · Charts have a text summary or accompanying data table.
  · 44px minimum touch targets on any interactive element.
  · All numbers tabular-aligned; thousands separated; one decimal place on percentages.
  · Print: no colour-only states, no clipped tables, no orphaned headings.

═══════════════════════════════════════════════════════════════════
7. FORMAT — build ONE of these (I will tell you which)
═══════════════════════════════════════════════════════════════════

(a) PRINT-READY HTML → PDF  [default]
    Semantic HTML + CSS (Tailwind-style utility classes are welcome, map them to the tokens
    above). A4 portrait, 18mm margins, one section per page where practical, page-break-inside:
    avoid on cards and tables, a repeating header rule and footer with page numbers, and
    @media print that drops shadows and motion. Optimised to be read on screen AND exported to
    PDF without reflowing.

(b) SLIDE DECK
    16:9, one idea per slide, max 6 lines of text, same palette and type scale. Cover slide on
    ink. Slide titles 28–34px w800 ink with a gold eyebrow, body 18–20px muted, generous margins
    (≥ 64px). KPI slides use the KPI tile at 2× scale. Charts as specified, one chart per slide.

(c) INTERACTIVE WEB REPORT
    Single page, max-width 1024px, sticky white header with the wordmark and a section nav,
    sections as in section 3, subtle fade-in-up reveals as sections enter the viewport, charts
    rendered from the data I provide. Must also print cleanly to PDF.

(d) SLIDE-READY OUTLINE + DESIGN SPEC
    If I only want direction: return the page-by-page outline plus, for each, the exact
    components, tokens and copy blocks to use — no code.

═══════════════════════════════════════════════════════════════════
8. PROCESS & OUTPUT
═══════════════════════════════════════════════════════════════════

1. If critical inputs are missing (client name, period, any metrics), ask me up to 5 questions
   first — one short list, no interrogation. Otherwise state your assumptions in a single
   "Assumptions" line at the top of your reply.
2. Restate the design system briefly, then deliver the work. No preamble, no self-congratulation.
3. Use my real data exactly as given. Where data is absent, insert a clearly-marked placeholder
   in the format [NEEDS DATA: organic sessions, {{REPORTING_PERIOD}}] and list every placeholder
   again at the end so I can fill them in one pass.
4. Format numbers for reading: 1,284 sessions · 12.4% · 3.2s · ₦450,000 · position 4 (▲ +3).
5. Do not introduce any colour, font, icon style, radius or shadow outside this brief. If you
   believe something here is a mistake, flag it in one line at the end instead of deviating.

INPUTS I WILL GIVE YOU
  Client: {{CLIENT_NAME}} — {{CLIENT_WEBSITE}} — {{CLIENT_CITY, COUNTRY}}
  Business type: {{CLIENT_BUSINESS_TYPE}}   Contact: {{CLIENT_CONTACT_NAME}}
  Reporting period: {{REPORTING_PERIOD}}   Compared to: {{COMPARISON_PERIOD}}
  Agency lead: {{ACCOUNT_MANAGER_NAME}} — {{ACCOUNT_MANAGER_EMAIL}} — {{WHATSAPP}}
  Data: {{PASTE GSC / GA4 / AHREFS / SEMRUSH EXPORTS, NOTES, WINS, BLOCKERS HERE}}
````

---

## PROMPT B — Condensed version (short-context tools)

````text
Design a client-facing SEO performance report for {{CLIENT_NAME}} ({{CLIENT_WEBSITE}}) for
{{REPORTING_PERIOD}}, prepared by PowerGrowthz Agency. Output: {{print-ready A4 HTML→PDF | 16:9 slide deck | single-page web report}}.

BRAND SYSTEM — locked, invent nothing:
· Colours: canvas #F8F7F4, ink #111111, muted #667085, body #344054, line #E5E7EB, gold accent
  #C8A24A, gold hover #B68A2F, gold soft #F6EEDC, white #FFFFFF. Up #067647 on #ECFDF3,
  down #B42318 on #FEF3F2. Gold covers under 10% of any page; no gradients, no extra colours.
· Type: Inter. Extrabold 800 tight-tracking headings (cover 32–40px, section 22–26px,
  card 17–18px), gold 11–12px UPPERCASE 0.24em eyebrows, 15–16px muted body at 1.7 line-height,
  12px uppercase muted table headers, KPI values 40–56px 800 tabular-nums. One H1 per document.
· Shape: 12px radius on cards/buttons/callouts, 16px on the cover sheet, 999px pills.
  Cards = white, 1px #E5E7EB border, shadow 0 1px 2px rgba(17,17,17,.04), 0 8px 24px
  rgba(17,17,17,.06). One elevated surface per viewport. 4px spacing scale, 48–64px between sections.
· Components: ink cover page with white wordmark + gold eyebrow; gold-eyebrow numbered section
  headers with a 2px #F0E6CE rule; KPI tiles (gold icon in a 36px #F6EEDC tile, muted uppercase
  label, big tabular value, delta pill, one line of meaning, gold sparkline); tables with a
  #F8F7F4 header row and horizontal rules only, top row highlighted #F6EEDC/40%; donut health
  score with #E5E7EB track and gold arc; 6px progress bars for category scores; gold-accent
  callouts (border rgba(200,162,74,.3), bg rgba(246,238,220,.4)) with a lucide icon; one
  primary gold CTA at most. Charts: 2 colours max, 2px strokes, horizontal #E5E7EB gridlines
  only, no legends when direct labels fit, greyscale-safe.

ARCHITECTURE: 1 Cover · 2 Contents/snapshot · 3 Executive summary (health score ring + 3–5
outcome→evidence→so-what bullets + one gold callout) · 4 Scorecard (4–6 KPI tiles) · 5 Traffic/
visibility trend chart with 2–3 annotations · 6 Keyword rankings table + top-5 winners/decliners ·
7 Technical health by category + Critical/High/Medium issue table (max 12 rows) · 8 Content
performance + content gaps · 9 Backlinks & authority · 10 Competitor benchmark (gold = client) ·
11 Wins & what we did · 12 90-day action plan (Action, Why, Impact, Effort, Owner, By when,
grouped 30/60/90) · 13 Investment & next steps with contact block · 14 Appendix (methodology,
glossary).

COPY: senior-consultant voice, plain English, British spelling, ₦ for money. Every metric =
value + change vs previous period + one line of business meaning. No jargon without a one-line
translation, no emoji, no exclamation marks, no banned words (leverage, seamless, robust,
holistic, cutting-edge, game-changing). Beside every chart, one sentence stating the takeaway.
Report declines honestly with a recovery plan. Never invent data — mark gaps as
[NEEDS DATA: …] and list them at the end.

DATA: {{PASTE EXPORTS HERE}}
````

---

## PROMPT C — Add-on modules

Append one of these to Prompt A or B when you need a different surface. They reuse the same tokens — never restyle.

**C1 — Email recap to the client (mirrors the agency's branded email)**

```text
ALSO produce a short HTML email recap of this report, using the same brand system: canvas
#F8F7F4 body, white content card with 1px #E5E7EB border and 16px radius, max-width 720px,
ink #111111 header band with "POWERGROWTHZ" in white + "AGENCY" in gold #C8A24A, gold 14px
uppercase section titles with a 2px #F0E6CE rule beneath, and label/value rows (13px
uppercase #667085 label, 15px #111111 value). Content: one-line headline result, three KPI
rows, the single biggest win, the biggest risk, and the 3 actions for next month. Keep it
under 200 words. Plain-text fallback version included.
```

**C2 — Live dashboard version**

```text
ALSO design the web-dashboard variant: same tokens on canvas #F8F7F4, sticky white header
with 1px #E5E7EB bottom border and the wordmark, a 2–3 column grid that collapses to one
column under 640px, cards with shadow-soft only, hover states at 200ms, section reveals as
fade-in-up on scroll, and a "Print / Export PDF" action styled as the single gold primary
button. No sidebar, no dark mode, no chart library default colours — every chart uses the
series colours defined above.
```

**C3 — Presentation notes for the live call**

```text
ALSO write presenter notes for {{ACCOUNT_MANAGER_NAME}} on the live client call: for each
report section, give the one-sentence opener, the number that matters, the honest caveat,
and the ask (what the agency needs from the client next). Plain spoken English, 60 seconds
per section, no reading the slides aloud.
```

---

## What was extracted (third-party sanity check)

| Element | Value taken from the page |
| --- | --- |
| Palette | `tailwind.config.ts` → canvas/ink/muted/line/accent(+hover/soft); `lib/email.ts` adds `#344054`, `#98A2B3`, `#D0D5DD`, `#F0E6CE` |
| Type | Inter via `next/font`, extrabold tight-tracking headings, gold uppercase tracked eyebrows, uppercase CTA labels |
| Radii | `rounded-xl` (12px) controls, `rounded-2xl` (16px) main card + email container, `rounded-lg` icon tiles, pills for badges |
| Shadows | `shadow-card`, `shadow-soft`, `shadow-accent` verbatim from the Tailwind theme |
| Components | Step progress bar + numbered step chips, radio/checkbox cards, dashed upload zone, file chips, gold-accent callouts, ink wordmark tile, white header/footer bands |
| Motion | `fade-in-up`, `fade-in`, `shake-x`, `check-pop`, 200ms transitions, 500ms progress |
| Voice | "client website onboarding" copy: plain, reassuring, non-technical, sentence case with uppercase kickers |
