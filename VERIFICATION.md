# Verification — 5 November 2026

## Local checks actually run

83/83 automated checks passed using local Playwright and installed Chrome 156.0.8078.80. This is desktop browser emulation, not physical-device testing.

Viewports: 1440×900 desktop, 768×1024 tablet, 320×720 narrow mobile, 390×844 mobile and 844×390 short landscape. All five had no horizontal overflow or motorcycle/copy collision, loaded artwork, appropriate static/pinned mode and an on-screen primary quote action.

Checked native scroll progress at 0, 10, 25, 50, 75, 90 and 100%, then reverse and abrupt jumps. Verified three sequential service labels, refresh partway through the story, resizing from desktop to mobile, live reduced-motion preference changes, services anchor positioning and focus, first keyboard skip link, mobile menu keyboard entry, Escape and return focus.

All four detail pages loaded with useful content and prefilled their matching enquiry. Legacy `services.html?service=parts` navigation resolved correctly. All five need selectors and conditional fleet-size visibility worked. Checked empty submission, invalid email and fleet size, valid fictional input, explicit “no enquiry was sent” feedback, zero submission requests and no cookies/localStorage/sessionStorage. No live mailto or telephone links remained.

Verified homepage and every guide with JavaScript disabled; the form controls remain disabled. Blocked motorcycle requests to exercise the failure message. Delayed artwork by 700 ms to measure layout stability: CLS 0.0000 in that specific run. This is not a general performance score. No JavaScript exceptions or HTTP errors were observed during the normal run.

The browser lifecycle was frozen and resumed to check continued interaction. Offscreen/hidden-tab suspension was reviewed in code (IntersectionObserver, document.hidden, cancellation of the pending frame). No real-device frame-rate or battery benchmark was performed.

## Design and motion review

| Before | After | Why |
| --- | --- | --- |
| Long fixed mobile hero and empty scroll travel | Content-sized static mobile hero; desktop travel limited to 280px | Reach service information sooner |
| 2.46MB hero PNG on every screen | Responsive 145KB / 453KB WebP with PNG fallback | Reduce transfer while preserving alpha edges |
| Motorcycle without a separate ground layer | Small perspective shift and independent contact shadow | Give the existing still artwork controlled depth |
| Unconfirmed live-company contact actions | Explicit portfolio context and validation-only form | Avoid mistaken enquiries or false sending confirmations |
| Service content populated only by JavaScript | Four complete static HTML guides plus an index | Keep information usable when JavaScript fails |
| Tiny captions and repetitive split sections | Larger notes, filled service rows, open process columns and grouped FAQs | Improve hierarchy and reading rhythm |

Motion review: approve the scoped implementation from code and browser checks. Only the product and its shadow move with scroll; controls have brief press feedback. No decorative section entrances, smooth-scroll hijacking or perpetual animation loop. Keyboard focus/menu actions are immediate. Reduced motion removes movement.

Applied Emil design-engineering and animation-performance guidance. Considered MotionSites and Hallmark references without importing paid media or whole templates. The design-taste draw selected “The well-kept board”, seed 1143156083. It informed the grouped service/FAQ surfaces; the brief’s required two-column hero, restrained motion and existing palette took precedence over conflicting generic recipes.

The automated taste inspector ran at 1440, 768 and 390px. Its first pass flagged a three-line workshop slogan and small captions, which were revised. Its requirements for four photographs, eight moving elements and no portfolio banner conflict with this brief’s limited verified media, restrained motion and explicit demo notice, so those are deliberately not followed. Its lint also labels the required contact-shadow variable as a shadow violation. These tools are design heuristics, not accessibility certification. No claim of a zero-warning taste inspection is made.

## Limits

- Chromium/Chrome only; no Safari, Firefox or physical phone testing.
- No claim of WCAG certification, Lighthouse score or measured 60fps performance.
- Concept artwork and business details remain unverified; no real company enquiry was sent.
- Deployed preview returned HTTP 200 through authenticated Vercel CLI. Core interaction checks were performed locally; a full authenticated remote-browser interaction run was not performed.

## Final delivery status

The source, preserved baseline, before/after screenshots and verification script were pushed to https://github.com/calebsingh23-afk/servtec-portfolio-concept. The GitHub connector successfully read the published README. The local preview was opened in a visible Chrome window with automatic reload on file changes.

Protected preview: https://servtec-portfolio-concept-g0bh0gycf-caleb-5fb0.vercel.app

Vercel reports READY, Preview target, productionUrl null and vercel_authentication protection. The temporary production-labelled setup deployment was deleted after creating the preview. The earlier unintended first deployment was also deleted. No production site remains deployed by this work. Authenticated HTTP verification returned 200 with the expected homepage. Local Playwright remains 83/83 checks. No Git auto-deployment connection was configured.
