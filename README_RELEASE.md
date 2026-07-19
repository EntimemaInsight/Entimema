# ENTIMEMA Brand Cleanup v3.1

## Scope
This patch removes decorative section numbering and the “Следващата секция” helper while preserving numbering that carries real information.

## Changed
- Removed `02 — ЕДИН ПОДХОД` from the Approach section.
- Removed `05 — РЕШЕНИЯ` from the Services page.
- Removed decorative `03 — ПОДХОД` labels from dormant methodology/process components.
- Removed the “Следващата секция” link.
- Kept `01–05` in the Home expertise list and service-card numbering.
- Kept Methodology out of the Home page to match the current production state.

## Verify locally
```powershell
npm install
npm run dev
```

Check `/`, `/services`, and `/about` before publishing.
