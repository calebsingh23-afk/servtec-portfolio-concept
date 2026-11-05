# ServTec — independent portfolio concept

An AI-assisted redesign of a South African motorcycle fleet website. **Not commissioned, affiliated with, or endorsed by ServTec.** This is a portfolio demonstration, not a business contact or booking channel.

## What it demonstrates

- A compact, responsive product scene with an existing transparent motorcycle illustration.
- A short native-scroll sequence: introduction, restrained perspective shift, and resolution. This uses a still image and CSS transforms, **not a 3D model or a true camera orbit**.
- Four static service guides, progressive enhancement, keyboard navigation and reduced-motion support.
- A demo enquiry selector, conditional fleet-size field, inline validation and honest feedback. **No form submission, email launch, backend, tracking or form-data storage.** Use fictional details.

## Run locally

Install Node.js if needed, open a terminal in this folder, and run:

```sh
node preview.cjs
```

Open http://127.0.0.1:4174. The existing buildless HTML/CSS/JavaScript project was retained: there is no framework install or build step. The files in `dist/` are the editable website source and are intentionally committed.

## Edit the site

| File | Change here |
| --- | --- |
| `dist/index.html` | Homepage copy, sections, FAQ and enquiry fields |
| `dist/fleet-rentals.html` | Rental and sales service guide |
| `dist/servicing-repairs.html` | Maintenance and repairs guide |
| `dist/parts-fabrication.html` | Parts and fabrication guide |
| `dist/rider-fleet-support.html` | Rider training and fleet support guide |
| `dist/services.html` | Complete no-JavaScript guide index; legacy query links redirect when JavaScript is available |
| `dist/style.css` | Colours, typography, layouts, control states and responsive rules |
| `dist/app.js` → `STORY` | All motion breakpoints, scroll travel, phase holds, perspective and label timings |
| `content/services.json` | Preserved structured source content; reference only, not a runtime dependency |
| `vercel.json` | Static deployment output and response security headers |

When updating navigation or the footer, update all six HTML pages. There is no hidden template generator.

## Motion and fallbacks

Desktop enhancement requires at least 900×700 CSS pixels. It adds 280 pixels of native scroll travel. Intro hold ends at 12%; movement settles at 86%. The illustration shifts by at most 2.5% horizontally and 1.5% vertically, with a 3-degree perspective adjustment and 3.5% scale change. A separate CSS contact shadow follows it.

Phones, short windows and reduced-motion users get a static composition with no pinning. Reduced-motion preference changes are observed live. Animation work is scheduled only on demand, suspended when offscreen or the document is hidden, and has no continuous render loop. Skip animation reaches and focuses the services section. Content remains available if scripts or the artwork fail.

## Assets and provenance

The previous project’s `motorcycle-clean.png` was retained. It is concept artwork, not a verified rental model or genuine ServTec photograph. Its original creation/licensing provenance was not independently verified; reuse within this concept was explicitly authorised by the brief. The older unused sprite is preserved but not requested by the website.

The 2,464,814-byte PNG now has alpha-preserving WebP alternatives: 145,480 bytes at 768px and 452,680 bytes at 1536px. The PNG is retained as fallback. No new paid media or generation credits were used. The workshop graphic is typography and CSS, clearly labelled as a concept.

Barlow Condensed and DM Sans are self-hosted. Font files came from Google Fonts, with SIL Open Font License texts included in `dist/assets/fonts/`. The social image is a browser-rendered composition of the site’s existing artwork and typography.

## Facts still awaiting business confirmation

The original recording and an approved original logo/workshop photograph were not available for fresh inspection. Existing supplied content was preserved without inventing additional claims. Actual fleet models, rental availability, terms, branding, workshop scope, fabrication stock, training format, reporting capabilities and roadside-assistance hours/coverage remain unverified. No statistics, testimonials, prices or guarantees were added.

The brief listed +27 (0)87 058 0620, info@serv-tec.co.za and Unit 2, Campora, Meadowbrook Business Estate, Jakaranda Avenue, Olivedale, 2188. These are unverified reference details, **not published as active demo contact channels**. No WhatsApp contact is claimed.

## Verification

See [VERIFICATION.md](VERIFICATION.md) and [machine-readable local results](docs/verification-results.json). Representative [before](docs/screenshots/before-desktop.png) and [after](docs/screenshots/after-desktop.png) screenshots are included, with mobile and motion-state captures.

To rerun browser checks, make Playwright available (or set `PLAYWRIGHT_PATH` to an existing installation), install/configure Chrome, start the preview and run:

```sh
node scripts/verify.cjs
```

Set `TEST_URL` to a deployed URL to exercise that deployment. Test data is fictional. The script generates screenshots and a JSON report.

## Vercel

Dedicated project: `servtec-portfolio-concept`, existing `caleb-5fb0` Hobby team. No paid services, custom domains or upgrades. `vercel.json` serves `dist/` without a build command. Local account/project files and environment tokens are ignored by Git and deployment uploads.

Publishing status and the verified URL are recorded in the final verification notes after deployment; do not infer a URL from the project name.
