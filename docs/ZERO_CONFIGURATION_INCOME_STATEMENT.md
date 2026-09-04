# Zero-configuration Income Statement interpretation

## V1 support contract

“Entimema automatically interprets different English Income Statements in XLSX, XLSM, CSV and structured text-based PDF formats — without a predefined template and without customer configuration.”

The production path is upload → deterministic extraction → whole-statement interpretation → bounded canonical mapping → deterministic validation → analysis → premium PDF. The semantic resolver receives labels, order, hierarchy, roles, neighbouring labels, period types, sign patterns, bounded candidates, currency/scale evidence, and relationship identifiers. It never receives workbook bytes, unrelated sheets, authentication data, hidden content, or logged financial values. Its decisions cannot alter source values or periods and deterministic controls retain veto authority.

## Audit of the PR #157 baseline

The inspected baseline contains merge commit `351f322` for PR #157, followed by the current main-line mobile fix. Document Classifier already uses the shared server-only OpenAI Responses transport in `backend/lib/openai.ts`; its classifier configuration and behavior remain unchanged. PR #157's observed-document, structural-row, period-hypothesis, candidate mapping, ontology, relationship, bounded resolver, mapping-memory, and isolation contracts existed, but production extraction called the flat rules in `extraction.ts` rather than the resolver and mapping memory was only an in-memory interface.

Source values travel from the selected sheet/table boundary through period parsing, evidence creation, label mapping, sign normalization, deterministic controls, centralized readiness, persisted revisions/snapshots, analysis, and PDF release. The sanitized Rieter annotation records 30 financial rows and 2 periods; before this sprint only 5 rows were reported mapped, currency was unresolved, scale was one million, and OCI boundaries were not operational. The original workbook was not available or tested here. General OCI and attribution boundaries now exclude those sections from the canonical P&L.

The customer workspace previously exposed canonical names, mapping methods, confidence components, and Accept/Reject/Remap controls. Authentication is Auth.js plus a server-derived hashed actor id; ownership is applied to every persisted run query. Supabase persistence uses checked-in SQL migrations, REST with a server-only service role, owner filters, optimistic revisions, append-only audit events, and immutable snapshots. Migration 002 adds an explicit server-persisted operator role and owner-scoped mapping memory; operators must be provisioned by controlled SQL/deployment administration, never email matching.

The old evaluation corpus had three annotations and measured only lexical mapping. It now has 30 sanitized annotations split 10/10/10. This breadth is not statistical proof of universality or commercial readiness. Remaining deterministic regexes are bounded accounting/structure primitives, not issuer, filename, sheet, or cell templates.

## Production configuration and operations

Apply migrations `001` then `002`. Configure `OPENAI_API_KEY`, `FINANCIAL_SEMANTIC_MODEL`, `FINANCIAL_SEMANTIC_RESOLVER_VERSION`, `FINANCIAL_SEMANTIC_TIMEOUT_MS`, `FINANCIAL_SEMANTIC_MAX_ATTEMPTS`, `FINANCIAL_SEMANTIC_MAX_ROWS`, `FINANCIAL_SEMANTIC_MAX_CONTEXT_CHARS`, and enable with `FINANCIAL_SEMANTIC_RESOLVER_ENABLED=true`. The flag is the rollback control. The default 30-second timeout with two attempts can exceed a short Vercel function budget; production must configure a function duration above the worst-case retry budget or move execution to a durable job. At most one whole-statement model call is made; actual latency and cost depend on selected model and statement size and must be observed after deployment. No production key is present in this environment, so live model behavior, migration application, and production deployment are not verified.

Mapping-memory records contain no workbook bytes or values. Owner id, schema version and structural fingerprint constrain lookup; conflicting results remain unresolved, and promotion of global ontology changes requires versioned reviewed code plus development, holdout and adversarial evaluation. Production code never self-modifies.
