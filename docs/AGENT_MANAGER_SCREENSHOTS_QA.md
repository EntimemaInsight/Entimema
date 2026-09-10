# Agent Manager screenshot experience — QA

Date: 2026-09-10. Base: a8584b6 (origin/main at task start); rebased without conflicts onto 85bffed (protected workspace links open in new tabs). Rebased production build passed; affected navigation tests retain the same two existing copy failures.

## Implementation

- Preserved centered page architecture, CTA destinations and three product sections.
- Three 1440 × 820 browser-captured WebP images: analysis (114,316 bytes), controls (104,360), review (100,720). Original fictional Entimema application preview, no copied third-party assets, drawings or sprites.
- Replaced background-position rendering with responsive next/image (quality 90, lazy loading, intrinsic dimensions, descriptive alt text). Full-size links support detailed inspection on mobile.
- Three Agent Library cards link to their matching financial workspaces and onward to /agents.
- Text enters before screenshots; restrained 3px hover elevation; reduced-motion and no-JavaScript fallback.
- Removed unused legacy sprite and five SVG product drawings.
- Read Revenue OS Capabilities (last verified 2026-09-07): controlled pilot for tested English XLSX and text-based PDF income statements. New UI is explicitly labeled Product preview / Interface preview with fictional data. No new extraction or autonomous-decision capability claim.

## Validation

- npm run typecheck: PASS.
- npm run lint: PASS, one pre-existing unused _ignored warning in backend/agents/document-classifier/validator.ts.
- Full tests through PowerShell-compatible recursive expansion of all tests/**/*.test.ts: 233 tests, 220 PASS, 13 FAIL. Repeated against an untouched git archive of a8584b6: exactly the same 13 failures and 220 passes. No new regression. Failures concern existing founder/company snapshots, two report projection assertions, launch-page claims/editorial assertions and stale navigation copy expectations. Existing failures were not hidden, weakened or changed in this visual pass.
- npm run build: PASS, production page prerendered.
- Browser capture script: PASS; all states fit 1440 × 820 without clipping. Control filter returns two review items; review resolution updates the demonstration session.
- Browser QA against production server: PASS at 1440, 768 and 390px. Three primary images load; zero horizontal overflow; card navigation works; zero browser console/page errors. Screenshot width at desktop is 1188 rendered pixels (1320 CSS pixels under existing global 90% site zoom).
- Reduced motion: opacity 1, transform none; existing global stylesheet uses 0.01ms transitions. Content remains visible with JavaScript disabled.
- Visually inspected desktop application captures, desktop page sections, Agent Library and mobile composition.
- Tools: Playwright 1.63.0, Chromium 153.0.8010.12, agent-browser 0.37.1. Reproduction instructions and source are under scripts/agent-manager-preview/.

Release SHA and remote/deployment results are reported after publication, not asserted in this pre-commit record.
