# Agent Manager interface preview

These original Entimema application screens use fictional, deterministic financial data. They are browser captures of a locally rendered interface preview, not captures of a deployed customer workspace. They do not expand the verified Financial Intelligence V1 scope.

Revenue OS Capabilities was checked on 2026-09-10 (record last verified 2026-09-07): Controlled Pilot for tested English XLSX and text-based PDF income statements, source verification and supported deterministic KPIs. No OCR, whole-report discovery, multilingual or arbitrary-statement support is claimed. Review/configuration UI remains a product preview.

Render `workspace.html` locally and capture its `analysis`, `controls` and `review` URL hash states at 1440 × 820. The capture script converts browser PNG captures to individual WebP files using Sharp; it does not draw or compose images. Fictional source values and derived financial relationships are shared across screens.

## Reproduce

From the repository root:

```text
npm ci
npm install --prefix build/capture-tools --no-audit --no-fund agent-browser@0.37.1 playwright@1.63.0
node build/capture-tools/node_modules/playwright/cli.js install chromium
node scripts/agent-manager-preview/capture.mjs
npm run build
npm run start -- --port 3110
node scripts/agent-manager-preview/verify.mjs
```

The capture and verification tools are kept in ignored `build/capture-tools`, outside production dependencies. The local HTML supports navigation, status filtering and a session-only review decision for capture verification. It does not call production APIs or make financial decisions.
