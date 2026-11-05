# ServTec website

## Latest visual revision

The hero now uses `dist/assets/motorcycle-clean.png`, a 1536×1024 transparent concept render from the built-in ImageGen tool. Prompt: one pristine blue 125cc delivery motorcycle, crisp mechanical details, SERVTEC tank and box marks, transparent background, no cast shadow or scenery. The old eight-pose sprite is retained only as a previous asset and is no longer displayed in the hero. The current motion is a continuously interpolated perspective/position/scale movement of the single image, not a multi-angle 3D turn. Separate layout columns keep the image and background detail away from copy. Reduced motion removes transforms and extra scroll height.

Local Chrome/Edge protocol checks passed at 1440px, 900px and 390px: no horizontal overflow, no copy/image-column overlap, full-resolution image loaded, intermediate motion values and scroll reversal observed. Reduced-motion mode had no transform and no extra scroll runway. Desktop and mobile screenshots were inspected. These local checks used the taste skill's browser driver, not Playwright; prior remote Playwright restrictions remain.

Buildless HTML, CSS and JavaScript: no package install or framework maintenance required. This lightweight static starter suits a brochure website and can be hosted on any HTTPS static host.

## Preview and edit

Serve `dist` with any static server (for example `npx serve dist`). Open the printed local address. Edit homepage copy in `dist/index.html`, styling in `dist/style.css`, and service content in the `services` object in `dist/app.js`. Each service has its own shareable `services.html?service=...` URL. JavaScript is required for service detail content and the enquiry helper; homepage and contact links remain available without it.

## Enquiries

The form validates name, message, email format and at least one contact method. It prepares a mailto message to info@serv-tec.co.za. It does not submit, store or send enquiries itself. Visitors must complete sending in their configured email app. For direct submission, obtain the approved destination and configure an HTTPS server endpoint or form provider, with spam controls, privacy disclosure, server validation and truthful success/error feedback. Do not add API secrets to frontend files.

## Assets and animation

The supplied brief was available; referenced recordings, official logo and actual workshop/fleet photographs were not attached. The original website could not be reached. The text wordmark is temporary and must be replaced by the original brand asset. No fabricated testimonials, statistics or client logos are included. The blue about-section graphic deliberately avoids presenting generated people or facilities as genuine workshop photographs.

The motorcycle is an AI-generated concept sprite, labelled on the page. Built-in ImageGen was used with a prompt for an eight-frame 4×2 studio turntable of a blue 125cc delivery motorcycle, consistent SERVTEC tank/box marks, three-quarter to side profile, grey background, no people. The sprite is cropped and compressed locally. Its eight scroll-controlled poses reverse with scrolling; it is a prototype, not the final smooth production sequence. Replace with a sufficiently dense, consistently rendered sequence of an approved motorcycle (or a vetted optimised 3D model). Generated geometry/lettering can vary slightly. Reduced motion shows the final pose and removes the extra scroll runway. There is no persistent rendering loop.

## Owner confirmation before public launch

- Official logo, brand colours, actual motorcycle models, fleet and genuine workshop/team photographs; supply original recordings.
- Phone +27 (0)87 058 0620, email info@serv-tec.co.za, and Unit 2, Campora, Meadowbrook Business Estate, Jakaranda Avenue, Olivedale, 2188.
- Availability and scope of all services, on-site coverage, rental terms, branding, fabrication, rider training, procurement, reporting and roadside assistance hours/coverage.
- Approved enquiry destination and privacy/data retention policy. No WhatsApp number is assumed.
- Approved customer evidence if desired.

## Launch setup

Hosted preview is private by default. For the final domain, configure valid HTTPS, redirect HTTP to HTTPS at the hosting/CDN layer, and redirect the alternate hostname to the chosen canonical hostname. These cannot be configured for serv-tec.co.za without domain/hosting access. All external asset URLs use HTTPS. Security headers are provided in `dist/_headers` for hosts supporting that format; configure equivalent headers elsewhere. Google Fonts is external; host approved fonts locally if required. Replace the social image with a single approved 1200×630 image (the current concept sprite is temporary), update absolute OG URLs and add a canonical URL once the public domain is agreed. Service metadata is updated client-side; create separate static documents if independently indexed service pages are required.

## Verification

JavaScript syntax checked with `node --check`. Local Playwright navigation was attempted but the remote browser could not reach the Windows local server. Further browser results are recorded in `VERIFICATION.md` if available. No live email delivery, real-device performance, final domain certificate or redirect is claimed as tested.
