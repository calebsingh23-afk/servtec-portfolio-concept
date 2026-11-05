# Verification record

## Latest local checks — visual revision

Passed using a local headless browser via Chrome DevTools Protocol (taste skill driver): 1440px, 900px and 390px viewports; no horizontal overflow or copy/image-column overlap; new 1536px-wide transparent image loaded; intermediate scroll transforms and backwards reversal observed. Reduced-motion mode confirmed `transform: none` and matching scene/hero heights, eliminating the extra scroll runway. Desktop and mobile screenshots were visually inspected. Syntax check passed after the animation update. These checks do not constitute Playwright verification. The hero now uses continuous movement of one clean image; the former eight-frame sprite no longer drives it.

## Earlier checks and limitations

- `node --check dist/app.js`: passed.
- Local file references in both HTML documents: checked for existence and passed.
- Generated motorcycle sprite: visually inspected; cropped to individual frame bounds and compressed. Eight poses are a limited prototype and do not meet the final dense, smooth sequence requirement.
- Playwright: navigation to the Windows local preview attempted; failed with `ERR_CONNECTION_TIMED_OUT`. The browser is remote and could not access localhost on this computer.
- A subsequent proposal to load the site into the remote browser was rejected by automatic approval review because transferring full source and imagery was considered unapproved sensitive egress. No claim of successful visual or interaction verification is made.
- Desktop/mobile layouts, keyboard access, enquiry validation interactions, contact clicks, reduced motion, intermediate scroll states and loading stability remain to be checked in a browser with approved access.
- Sites registration succeeded and its project ID is retained in `.openai/hosting.json`. The source workflow did not complete or produce a verified pushed commit/archive; publication was not completed. Do not treat the expected URL as live.
- Live enquiry delivery, final-domain HTTPS and HTTP redirects have not been verified.

Before launch, run the browser checks from the brief using an approved local browser or grant access to the remote verification environment. Replace temporary branding and imagery, confirm service/contact facts and choose a direct form destination if required.
