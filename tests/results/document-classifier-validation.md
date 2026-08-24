# Document Classifier Validation

Generated: 2026-08-24T18:14:39.460Z

## Summary

- Total: 19
- Passes: 19
- Classification accuracy: 100%
- Routing accuracy: 100%
- Local / AI: 73.68% / 26.32%
- Manual review: 31.58%
- False-positive automatic routes: 0
- Overall P50 / P90: 4.18 ms / 3055.35 ms
- Local P50 / P90 / max: 4.15 / 6.33 / 42.55 ms
- AI fallback P50 / P90 / max: 2968.7 / 4498.96 / 4498.96 ms (live OpenAI Responses API)

## Matrix

| Test | Expected type | Actual type | Route | Confidence | Source | AI calls | Review | Duration ms | Result |
|---|---|---|---|---:|---|---:|---|---:|---|
| FS-001 | Financial Statements | Financial Statements | financial_spreading | 0.99 | local | 0 | false | 6.33 | PASS |
| TB-001 | Trial Balance | Trial Balance | financial_spreading | 0.95 | local | 0 | false | 3.97 | PASS |
| GL-001 | General Ledger | General Ledger | financial_data_preparation | 0.96 | local | 0 | false | 3.89 | PASS |
| AR-001 | Accounts Receivable Aging | Accounts Receivable Aging | receivables_analysis | 0.96 | local | 0 | false | 3.95 | PASS |
| AP-001 | Accounts Payable Aging | Accounts Payable Aging | payables_analysis | 0.96 | local | 0 | false | 4.09 | PASS |
| BS-001 | Bank Statement | Bank Statement | cash_flow_analysis | 0.96 | local | 0 | false | 4.15 | PASS |
| IR-001 | Invoice Register | Invoice Register | financial_data_preparation | 0.96 | local | 0 | false | 4.16 | PASS |
| PI-001 | Purchase Invoice | Purchase Invoice | payables_analysis | 0.97 | local | 0 | false | 4.20 | PASS |
| BU-001 | Budget | Budget | budget_analysis | 0.98 | local | 0 | false | 4.15 | PASS |
| FC-001 | Forecast | Forecast | forecast_analysis | 0.98 | local | 0 | false | 4.16 | PASS |
| MR-001 | Management Report | Management Report | manual_review | 0.97 | local | 0 | true | 4.14 | PASS |
| CT-001 | Contract | Contract | manual_review | 0.96 | local | 0 | true | 4.18 | PASS |
| LA-001 | Loan Agreement | Loan Agreement | manual_review | 0.97 | local | 0 | true | 4.21 | PASS |
| AI-TB-001 | Trial Balance | Trial Balance | financial_spreading | 0.98 | ai | 1 | false | 2662.38 | PASS |
| AI-BS-001 | Bank Statement | Bank Statement | cash_flow_analysis | 0.90 | ai | 1 | false | 2968.70 | PASS |
| UN-001 | Unknown | Unknown | manual_review | 0.98 | ai | 1 | true | 2871.63 | PASS |
| UN-002 | Unknown | Unknown | manual_review | 0.94 | ai | 1 | true | 4498.96 | PASS |
| UN-003 | Unknown | Unknown | manual_review | 0.99 | ai | 1 | true | 3055.35 | PASS |
| REAL-FS-001 | Financial Statements | Financial Statements | financial_spreading | 0.99 | local | 0 | false | 42.55 | PASS |

AI fallback measurement: live OpenAI Responses API. Ordinary unit tests remain deterministic and make no network calls. The production fallback contract remains the compact strict schema.
