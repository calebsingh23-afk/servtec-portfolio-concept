# Browser quality checks

Use Node.js with an existing Playwright installation and Chrome. There is no website build step.

1. Start the local site with `node preview.cjs` (default port 4175).
2. Set `TEST_URL` to the local URL including its trailing slash, e.g. `http://127.0.0.1:4175/`. To verify a preview, use its HTTPS branch URL instead.
3. If Playwright is not available as a normal Node dependency, set `PLAYWRIGHT_PATH` to its installed module directory.
4. Run:
   - `node scripts/check-mailto-triggers.cjs`
   - `node scripts/check-rental-visibility.cjs`
   - `node scripts/check-polish.cjs`

These tests use `safe-playwright.cjs`. It substitutes only the external email handoff in the browser's fetched app script, captures recipient/subject/body, and blocks email/telephone link navigation. The actual form validation and draft construction run unchanged. It aborts script loading if the expected handoff cannot be identified. Never run email submission checks without this interception. The customer website has no test hook or changed email behaviour.

Optional screenshots require `SCREENSHOT_DIR` pointing to a local directory outside the repository. Tests and this documentation are excluded from Vercel deployments by `.vercelignore`.

`verify.cjs` is a historical suite with outdated layout/content assertions; it also uses the safe email interceptor. Use the three current checks above for this version.

Coverage: Chrome viewport simulation at 320, 390, 481, 768 and 1440px; form flows at 390/1440px; gallery, brochure, navigation, contact-bar clearance, reduced motion and no-JavaScript content. Physical phones, Safari and a real mobile keyboard/safe-area device remain manual checks.

Mobile emulation: run node scripts/check-devices.cjs. Uses Pixel 7 with installed Chrome and iPhone 13 with WebKit if installed; unavailable engines are reported explicitly. These are emulated devices. Native picker text wrapping, on-screen keyboards, real safe areas and physical touch behaviour still need device testing.

Performance lab: node scripts/measure-mobile.cjs; see PERFORMANCE.md for conditions and results. No website runtime dependencies are required.

Verified 17 November 2026: Pixel 7/Chrome and iPhone 13/WebKit 27.2 (Playwright revision 2391) both passed portrait and landscape. Matching WebKit installed via the existing Playwright CLI install webkit, including FFmpeg and Winldd in the user browser cache. This is Windows-hosted WebKit emulation, not Safari on a physical iPhone.
