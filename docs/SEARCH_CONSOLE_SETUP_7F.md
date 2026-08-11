# Sprint 7F — Search Console setup and measurement plan

## Current status and required owner action

DNS for `entimema.net` already publishes a real `google-site-verification` TXT record. The repository contains no HTML verification meta tag, verification file, fabricated property ID or Search Console API credential. DNS is the correct verification mechanism for a Domain property and should be preserved.

The site owner must:

1. Sign in to Google Search Console using the Google account that should own the property.
2. Add or select the **Domain property** `entimema.net` (enter the domain only, without protocol or `www`).
3. Ask Search Console to verify the existing DNS TXT record. If Google presents a different token, compare it with the DNS provider before changing anything; do not delete the existing record until ownership is confirmed.
4. Submit `https://www.entimema.net/sitemap.xml` under **Indexing → Sitemaps**.
5. Confirm the sitemap succeeds and contains 21 URLs after the Sprint 7F deployment.
6. Inspect the homepage and one Resource through URL Inspection. Use “Request indexing” only for an important new page or a diagnosed fix—not as a repeated submission strategy.

The Domain property is recommended because it covers HTTP/HTTPS, apex/`www`, and any future subdomains. DNS administration and Search Console account access remain human-controlled external actions.

## Initial indexation checklist

- Confirm the deployed apex host redirects once to `https://www.entimema.net`.
- Confirm all sitemap URLs use `www`, return 200, are indexable and self-canonical.
- Confirm Pages/Indexing reports do not show canonical mismatch, redirect-source submission, soft 404, robots exclusion or duplicate-without-selected-canonical errors for intended URLs.
- Confirm all five Resources are discovered from both the sitemap and crawlable `/resources` links.
- Record Google's selected canonical separately from the declared canonical when they differ.
- Do not interpret “Crawled — currently not indexed” as a permanent content verdict without time and context.

## Search Console reporting model

Use Search results data by **query, landing page, country, device, impressions, clicks, CTR and average position**. Segment queries through analysis—not keyword-stuffed pages—into:

- **Branded:** Entimema, Entimema finance, Entimema consulting, Aleksandar Dimitrov Entimema, and only variants that actually appear.
- **Commercial:** provider/advisory/consulting intent mapped to one service owner.
- **Problem-aware:** operating or management problems suitable for a Resource-to-service path.
- **Technical/expert:** methods, models and architecture evaluated by specialist buyers.
- **Irrelevant:** consumers, jobs, education, bookkeeping, generic software implementation or other excluded intent.

Search Console measures Google search visibility and aggregate clicks. It does not provide sessions, article engagement, navigation funnels, time on page or form outcomes.

## Bulgarian-market monitoring

Keep the website English-only. Filter Search Console by country = Bulgaria, then compare Bulgarian-language queries, English professional queries from Bulgaria, branded queries and their landing pages. Record recurring query families and qualified commercial relevance. Do not add Bulgarian metadata or pages until sustained evidence and an operating decision justify a language architecture.

## International monitoring

Review country/device/page performance for query families rather than assuming exact wording: FP&A consulting, financial forecasting, management reporting, manufacturing cost modelling, profitability analysis, credit risk modelling/consulting, SAP management reporting, ERP financial analytics and decision intelligence. Separate provider intent from definitions, software implementation and educational traffic.

## Privacy and analytics decision

No Google Analytics, Tag Manager or other behavioural analytics implementation is present. The current Privacy notice names hosting and contact-form processors but does not describe analytics cookies, identifiers, event collection, retention or consent. Sprint 7F therefore does not add tracking.

Recommended sequence:

1. Use Search Console plus existing server/deployment operational logs for the non-behavioural search baseline.
2. Define the minimum questions, controller/vendor roles, data fields, retention and consent requirements.
3. Select a privacy-approved analytics product only after legal/privacy review.
4. Update the Privacy notice and consent mechanism if the selected implementation requires them.
5. Then implement and validate a minimal event dictionary.

Candidate events after approval:

| Event | Trigger | Minimum context |
| --- | --- | --- |
| `resource_view` | Published Resource view | Resource slug; landing classification |
| `related_capability_click` | Resource → named service | Resource slug; capability path |
| `contact_view` | Contact page view | Previous internal path; coarse source category |
| `contact_submit_success` | Server-confirmed valid submission | Inquiry category; no message content or unnecessary personal data |

The intended funnel is organic landing → Resource read → service transition → Contact → successful form submission. Qualified lead status requires human/CRM classification and must not be inferred from submission alone. Do not add session replay, fingerprinting or visible attribution fields.

If attribution is later approved, capture only the original landing path, referrer domain, relevant UTM values and a coarse organic/source classification. Validate and limit values, avoid storing full external URLs where unnecessary, and never include attribution data in the visible form.

## UTM convention for future distribution

No distribution is started in Sprint 7F. Future LinkedIn links should use:

- `utm_source=linkedin`
- `utm_medium=organic_social`
- `utm_campaign=<resource_or_theme>` using lowercase kebab-case
- `utm_content=<post_variant>` using a stable descriptive variant

UTMs belong on distributed links, not canonical URLs or internal navigation.

## First 90 days

### Days 0–30 — discovery and indexation

Confirm property ownership, sitemap success, crawl/indexation state, declared versus selected canonicals, branded impressions and first query appearance. Log a dated baseline. Do not panic about rankings or repeatedly request indexing.

### Days 31–60 — query and page formation

Compare query families, landing-page impressions, unexpected intent, country/device distribution and Resource-versus-service visibility. Check whether Resources support their intended commercial owners and whether irrelevant traffic patterns emerge.

### Days 61–90 — evidence-led decisions

Identify pages approaching useful result positions, query clusters with repeated traction, CTR anomalies, content gaps, possible cannibalisation and early qualified-traffic signals if approved analytics/CRM linkage exists. Change architecture or editorial priorities only after reviewing evidence in context.

## Qualitative decision rules

- Impressions with very low clicks: review query intent, title and description before changing content architecture.
- Two pages appearing for one query family: investigate page/query/country/device history and ownership before consolidating or rewriting.
- Sustained Bulgarian queries: evaluate language demand, commercial quality and operating capacity before proposing localised content.
- Commercial impressions without service transition: review message/intent fit after an approved on-site measurement system can actually observe the transition.
- No impressions after sufficient time: assess discovery, indexation, competition, terminology and demand; do not immediately declare the topic valueless.
- Manual indexing: reserve for important new pages, critical corrections and diagnostics. Sitemap discovery is the default.

## Review record

At each 30/60/90-day review, record the date range, data completeness, filters, material observations, hypotheses, decisions, owner and next review date. Preserve zero/insufficient-data states rather than replacing them with estimates.
