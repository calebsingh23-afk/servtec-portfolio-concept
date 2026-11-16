# Verification — preview backup, 16 November 2026

The copied Git checkout was served on loopback port 4176. Chrome/Playwright checks passed at widths 390px and 1440px:
- Three homepage listings and seven fleet listings; View all bikes destination.
- Mobile-only call/enquiry bar, correct telephone link, keyboard navigation, selected illustrative bike/period, retained typed draft, menu/edit hiding, footer clearance with the brochure expanded, and no horizontal overflow or JS errors in these checks.
- Branding page, four service categories, preselected branding service, keyboard CTA and correctly encoded email draft with no rental fields included.
- Zeus photo-angle controls and expandable brochure.
- All seven reference motorcycle photographs decoded successfully.
- Illustrative catalogue labels and proposed-process notice remain present.

The website files match the latest reviewed local source byte-for-byte. The new-file list and scripts were reviewed for unintended private files and common credential patterns; none were found. Private owner-review notes, temporary scripts and new screenshots were not transferred. Historical docs/screenshots already in Git remain excluded from deployment.

Read-only Vercel dashboard checks confirmed the connected GitHub repository, main as Production, and Vercel Authentication / Standard Protection for previews, with no active shareable links or listed preview protection exceptions. No hosting settings were changed.

Limitations: desktop browser mobile emulation, not a physical-device keyboard test. No telephone call or email was sent. Historical scripts/verify.cjs predates the new catalogue and is not the test suite used for this backup.
