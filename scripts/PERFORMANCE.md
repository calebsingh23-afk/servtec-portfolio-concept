# Mobile performance lab — 17 November 2026

This is a Chrome DevTools Protocol lab audit, not Lighthouse scores or real-user data. Pixel 7 emulation, installed Chrome, local static server at 127.0.0.1:4177, cold browser contexts/cache disabled, 4x CPU slowdown, 150ms latency, 200,000 bytes/s download and 93,750 bytes/s upload. Each page was observed for eight seconds after load, without scrolling. Two comparable runs; timings include host contention and vary. No website files changed between runs.

| Page | First contentful paint run 1 / 2 | Largest contentful paint run 1 / 2 | Layout shift run 1 / 2 |
| --- | --- | --- | --- |
| Homepage | 2.04 / 1.65 seconds | 4.07 / 3.47 seconds | 0 / 0 |
| Fleet | 1.63 / 1.98 seconds | 1.63 / 1.98 seconds | 0 / 0 |
| Zeus | 2.14 / 1.29 seconds | 2.14 / 1.32 seconds | 0 / 0 |

No before/after speedup is claimed. These repeat measurements show variability, not improvement. The homepage hero is the main image cost: high-density Pixel 7 selects the 1536px WebP (~453KB); the 768px variant is ~145KB. This choice is consistent with the rendered width and device pixel ratio. Photographs remain unchanged to preserve quality. The first fleet images are ~179KB and ~267KB. Zeus images are already small (13–30KB angles, ~130KB workshop).

The 131KB brochure was not fetched while collapsed in either run. Existing dimensions, below-fold lazy loading, responsive hero and immediate first-screen content were preserved. No new runtime dependency or score-driven change was warranted by this limited audit. It does not establish that further optimisation is impossible; a production-network Lighthouse/real-device trace could provide deeper evidence. Full raw temporary reports stay outside the repository.

Run `node scripts/measure-mobile.cjs` with PLAYWRIGHT_PATH configured. TEST_URL may target local or preview URLs; comparisons should use identical URLs, cache, throttling and host conditions. The script only loads pages and does not submit forms or activate external links.

Browser harness: Playwright 1.66.0-alpha-2026-11-09 using installed Chrome. WebKit uses the revision pinned by this exact Playwright installation; no project dependency or package version was changed.
