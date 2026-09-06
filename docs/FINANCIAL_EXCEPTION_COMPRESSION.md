# Financial Intelligence V1 — exception compression evidence

## Evidence limits and pre-change decomposition

The repository does not contain the production Rieter workbook, its 26 serialized review tasks, or row-level production telemetry. The only Rieter-shaped evidence is the sanitized eight-label annotation in `tests/financial-intelligence/evaluation/corpus.json`; it records 30 financial rows and 60 values as aggregate expectations but explicitly is not the source workbook. Consequently, unobserved tasks are not assigned invented labels, values, candidates, or causes.

| Evidence item | Section | Classification | Technical reason | Finding |
| --- | --- | --- | --- | --- |
| Selling, general, and administrative expenses | P&L | `AUTOMATION_DEFECT` | `LOW_CONFIDENCE` | The complete P&L allowlist reached the resolver, but anchored lexical ranking supplied no preferred candidate for a harmless composite caption. |
| Total other comprehensive income | OCI | `BOUNDARY_DEFECT` in the reported historical run | `SECTION_VETO` | Current deterministic classification correctly marks the row OCI and projection sets review to `not_required`; current review generation only consumes values whose review state is `required`. The historical task cannot be attributed further without its persisted run. |
| Remeasurement of defined benefit plans | OCI | `BOUNDARY_DEFECT` if a P&L task exists | `SECTION_VETO` | Current boundary excludes the row from P&L controls and mapping review. |
| Total comprehensive income | Total comprehensive income | `BOUNDARY_DEFECT` if a P&L task exists | `SECTION_VETO` | Current boundary excludes the row from P&L controls and mapping review. |
| Financial result | P&L | `LEGITIMATE_REVIEW` when context/confidence is insufficient | `LOW_CONFIDENCE` or `NO_SEMANTIC_PROPOSAL` | The sanitized annotation deliberately gives no expected canonical mapping. |
| Remaining production tasks | Unknown | Unclassified | `MISSING_CONTEXT` | Production records are absent; classification would be fabrication. |

Verified minimum counts are therefore: `AUTOMATION_DEFECT = 1`, `BOUNDARY_DEFECT = 1` directly observed (plus two repository boundary exemplars), `LEGITIMATE_REVIEW = 1`, and `DOMAIN_KNOWLEDGE_GAP = 0 identified`. At least 23 of the reported 26 production tasks cannot be classified from available evidence.

## Root causes and correction

Two minimal product defects were found. First, anchored patterns gave a composite operating-expense caption no preferred ordering even though `general_and_administrative_expense` was in the complete bounded candidate set. General token normalization now prioritizes contained canonical phrases for the model without deterministically selecting them. Partial similarity remains below automatic-selection policy, so contextual meaning and ambiguity resolution remain model-owned. Second, a rejected semantic proposal was discarded when values and review tasks were projected, causing the queue to display `other_reported_line` and extraction confidence instead of the actual proposal and semantic confidence. The proposal is now retained for specialist verification.

No confidence threshold changed. Allowlist/schema validation, deterministic section and relationship vetoes, source evidence, and readiness remain server-authoritative. OCI, total comprehensive income, and attribution values remain persisted but excluded from P&L controls and material mapping review.

## Evidence planes

### Finance Domain

No relevant Entimema Finance Domain methodology records are present in this checkout or exposed through configured resources. The Python `financial_planning` domain is unrelated and was not used. The canonical ontology and deterministic controls are Product implementation evidence, not promoted to approved Domain methodology. No new accounting concept or treatment was invented; the correction only makes an existing allowlisted concept reachable and preserves established section boundaries. There is no identified `DOMAIN_KNOWLEDGE_GAP` for these narrow corrections, but the absent Domain record system prevents a broader methodology certification.

### Product

Evidence used: canonical allowlist and lexical ranking, whole-statement candidate assembly and resolver contract, semantic acceptance and deterministic equation vetoes, section projection, review-task creation, readiness validation, sanitized corpus, and existing FI tests. Metrics now report P&L rows, automatic/mapped/unresolved rows, excluded rows, review tasks by reason, accepted semantic and deterministic mappings, veto buckets, and mapping coverage without labels or values.

### Commercial

No Entimema Revenue OS records (Capabilities, Customer Evidence, Product Requests, Decisions, Opportunities, or Experiments) are present in the checkout or exposed as configured resources. No willingness-to-pay inference is made. Commercial capability remains blocked pending a production retest and evidence-plane access.

## Evaluation results

The evaluation harness is synthetic and label-level; it is not a substitute for the missing production run. It now reports per-document operational counts.

| Fixture | Relevant P&L rows represented | Automatically mapped | Material mapping review | Excluded non-P&L labels | False mappings | False validations | Boundary errors |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Sanitized Rieter-shaped annotation | 5 | 5 | 0 | 3 | 0 | 0 | 0 |
| Holdout 02 — IFRS nature of expense | 4 | 4 | 0 | 0 | 0 | 0 | 0 |
| Holdout 03 — US GAAP quarterly/YTD | 6 | 6 | 0 | 0 | 0 | 0 | 0 |

The sanitized annotation's aggregate metadata says the unseen source had 30 rows and 26 material review tasks before. It contains only five canonically expected P&L labels, so an honest 30-row after-result cannot be calculated locally. The production target of five or fewer tasks is therefore not claimed.

## Recommendation

**KEEP BLOCKED**

Remaining P0 blockers are a post-deployment run of the actual Rieter source with resolver telemetry, complete exception decomposition from its persisted task records, two full structurally different source-level holdouts rather than label annotations, Finance Domain/Revenue OS evidence access, and verification that production resolver configuration is active. Once those are available, this branch is suitable for a production mapping retest; it is not Production Ready.
