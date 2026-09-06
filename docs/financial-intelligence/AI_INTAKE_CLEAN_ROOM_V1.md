# Entimema Financial Intelligence V1 — AI Intake Clean-Room Architecture

Status: APPROVED PRODUCT DECISION — 2026-09-06
Owner: Product
Deadline: 2026-09-09

## Product boundary

V1 data preparation is rebuilt around one semantic intelligence layer.

Customer flow:

`Upload → AI Financial Understanding → Source-Verified Financial Contract → Deterministic Financial Validation → Exception Review → Analysis → PDF`

The customer must not prepare a template, select a sheet, identify periods, classify rows, or map routine financial lines.

## What remains deterministic before AI

Only non-semantic infrastructure is allowed before Financial Understanding:

1. secure upload and file-integrity checks;
2. byte/file-size/MIME/signature checks;
3. lossless source access;
4. extraction of source facts needed to make the document model-readable;
5. stable source references for lineage.

This layer MUST NOT decide:

- whether a sheet is an Income Statement;
- where the statement starts/ends;
- which row is Revenue, COGS, EBIT, PBT or Net Income;
- which columns are reporting periods;
- whether a row is P&L versus OCI;
- canonical mapping;
- financial meaning.

## AI Financial Understanding

One model operation owns semantic data preparation. From the source representation it identifies:

- supported document/statement type;
- entity;
- relevant sheet/page/section;
- reporting periods;
- currency and scale when evidenced;
- financial lines;
- line/subtotal roles;
- P&L vs OCI/attribution/metadata;
- canonical concept candidates;
- material ambiguity.

The model returns source references, not invented financial numbers.

## Source-verified contract

Every AI-selected number MUST be hydrated from the original deterministic source reference. A model-produced numeric value is invalid by construction.

Required lineage for every value:

- source filename;
- sheet/page;
- cell/line reference;
- source label;
- period reference;
- original source value;
- formula presence where available;
- AI interpretation and confidence.

If a reference does not resolve exactly to source evidence, fail safely.

## Deterministic validation after AI

Accounting controls remain authoritative after Financial Understanding. AI cannot validate itself or override:

- arithmetic/equation controls;
- sign controls;
- duplicate/evidence controls;
- canonical allowlist;
- validation readiness;
- material exception review.

## Explicitly retired from the V1 execution path

The following may remain temporarily as dead/compatibility code until dependency-safe deletion, but MUST NOT participate in the production V1 data-preparation decision path:

- deterministic document classification as a gate;
- deterministic statement detection as a gate;
- deterministic period detection as a gate;
- label-dictionary/mapLabel semantic mapping as a fallback;
- layout-specific Income Statement extraction;
- issuer-specific parsing rules;
- mandatory selected-sheet input.

There is no deterministic semantic fallback. If AI Financial Understanding is unavailable, the run fails truthfully with a bounded model-unavailable/failure state rather than silently switching to a weaker parser.

## Supported V1 sources

P0 acceptance target:

- `.xlsx`;
- `.xlsm`;
- `.xls`;
- `.csv`;
- text-based `.pdf`.

Image-only/scanned PDF is not silently OCR'd in this sprint. It must return a truthful bounded unsupported/image-only state unless a verified vision path is separately implemented.

## Performance target

Architecture target, not contractual SLA:

- source opening/representation: <2s typical;
- AI Financial Understanding: 3–10s target;
- deterministic validation: <1s typical;
- first structured result: <10–15s target;
- full analysis: 15–30s target.

No sequential classifier → detector → extractor → mapper model chain.

## Acceptance corpus

Production acceptance requires the same execution path to process without file-specific code:

1. Rieter Income Statement workbook;
2. one unseen Excel Income Statement with materially different layout;
3. one unseen text-based PDF Income Statement.

For each:

- a new persisted run exists;
- AI Financial Understanding is invoked;
- periods > 0;
- financial lines > 0;
- source lineage resolves;
- deterministic validation runs;
- only genuine ambiguities reach review.

A normal readable Income Statement returning `0 periods / 0 lines` is a Product defect.

## Capability governance

Do not mark the capability Demo Ready or Production Ready until production acceptance evidence exists for the above corpus.

## Finance Domain boundary

No new financial methodology is introduced by this architecture. If implementation requires a new accounting rule, calculation convention, financial dependency or control methodology, stop and raise `DOMAIN_KNOWLEDGE_GAP` rather than inventing it in Product.
