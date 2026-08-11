# Sprint 7F.1 — Analytics measurement contract

Status: repository preparation complete; behavioural analytics remains inactive until a real GA4 Measurement ID is configured in the production build.

## Pre-implementation audit

The site had no behavioural tracker, analytics cookie, Tag Manager container or third-party browser script. The announcement dismissal uses session storage only and is unrelated to analytics. Contact submissions travel through the server-side `/api/contact` route to Resend; the browser does not receive provider credentials. Resources use normal semantic links for capability transitions. The successful Contact state previously depended on an HTTP-success response, and Sprint 7F.1 adds a server confirmation header so the conversion event excludes validation errors and honeypot acknowledgements. Environment files are ignored by Git, Vercel deployment metadata is not committed, and no repository-defined security-header policy currently changes the analytics decision.

## Platform decision

Use one Google Analytics 4 web data stream, consent-gated and production-host-only. GA4 is selected because it can connect acquisition, landing pages, the four defined events and a successful-inquiry key event in one reporting system, and it can later be linked to the verified Search Console property by the owner. No Tag Manager or second analytics product is added.

GA4 may set analytics cookies and browser identifiers, so tracking must not start before explicit permission. The implementation disables advertising storage, ad-user-data consent, ad personalisation, Google signals and personalised-ad features. It sends no Contact-form content or direct identifiers.

## Activation boundary and owner action

1. In Google Analytics, create or select the Entimema GA4 property and a web data stream for `https://www.entimema.net`.
2. Copy the real Measurement ID in the `G-XXXXXXXXXX` format.
3. In Vercel, add `NEXT_PUBLIC_GA_MEASUREMENT_ID` only to the **Production** environment. Do not add it to Development or Preview.
4. Confirm the Privacy wording, GA4 data-retention setting, data-sharing settings, and any required Google contractual/data-transfer terms with the site's legal/privacy owner.
5. Redeploy production because `NEXT_PUBLIC_` values are embedded at build time.
6. Validate consent and events in GA4 Realtime/DebugView, then mark `contact_submit_success` as a key event in the GA4 account.

No Measurement ID, Property ID, credentials or fabricated values are committed. Without a valid ID, the consent interface and analytics script do not render.

## Production and consent logic

Analytics can initialise only when all conditions are true:

- the compiled Measurement ID matches the GA4 `G-...` format;
- the browser hostname is exactly `www.entimema.net`;
- the visitor chooses **Allow analytics**.

Localhost, automated local QA, Vercel preview domains and the apex redirect host cannot initialise analytics. A visitor's choice is stored as `entimema_analytics_consent` in local storage. First-touch safe attribution is stored only after consent in session storage under `entimema_acquisition`; the current internal path uses `entimema_current_path`. Declining clears acquisition context and denies analytics storage. The Privacy page provides a preference-review control.

Blocking Google scripts, disabling storage or analytics failure cannot interrupt rendering, navigation, the Contact API, or its success state. Event helpers return without throwing when prerequisites are absent.

## Event contract

| Event | Trigger | Purpose | Parameters | PII prohibition | Conversion |
| --- | --- | --- | --- | --- | --- |
| `resource_view` | Published Resource remains visibly open for 8 seconds; once per mounted article | Measure meaningful Resource exposure beyond an immediate bounce | `resource_slug`, `resource_title`, `resource_topic` plus safe attribution | No article body, visitor identity or form data | Diagnostic |
| `related_capability_click` | Reader activates the article's understated related-capability link | Measure Resource-to-commercial transition | `resource_slug`, `capability_slug`, `link_position=article_related_capability` plus safe attribution | No link text derived from visitor input | Intent |
| `contact_view` | Contact client experience mounts; once per arrival after analytics is ready | Measure Contact intent | `previous_internal_path` plus safe attribution | No form fields or query contents | Intent |
| `contact_submit_success` | `/api/contact` confirms delivery with its accepted-submission response header | Represent a genuinely delivered inquiry, excluding validation failures and honeypot responses | `inquiry_type` (`project`, `partnership`, or `client`) plus safe attribution | Never name, email, company, role, project, message, selected topic or free text | Primary key event; owner must mark it in GA4 |

Standard consented `page_view` events provide landing-page and navigation reporting. They are not primary business conversions.

## Acquisition attribution

First-touch session context contains only:

- `landing_page` — path only;
- `source_category` — `organic_search`, `organic_social`, `direct`, `referral`, or `campaign`;
- `referrer_host` — hostname only, never a full referring URL;
- validated, lower-cased and length-limited `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content`.

Google, Bing, DuckDuckGo and Yahoo referrer hosts are classified as organic search. The approved LinkedIn pair is organic social. Other UTM-tagged arrivals are campaigns; other external referrers are referrals; no referrer and no campaign is direct. This is practical channel attribution, not identity resolution, multi-touch modelling or surveillance.

## LinkedIn UTM standard

No LinkedIn distribution occurs in this sprint. Future distributed links use:

- `utm_source=linkedin`
- `utm_medium=organic_social`
- `utm_campaign=<resource_or_theme>` in lowercase kebab-case
- `utm_content=<post_variant>` in lowercase kebab-case

UTMs remain absent from canonical URLs and internal navigation.

## Search Console and GA4

Search Console measures Google query → impression → click → landing page. GA4 begins at the consented landing page and measures on-site behaviour → commercial transition → successful inquiry. Linking the two products is a future owner-side account action; repository code cannot create or claim that linkage.

## Owner reporting guide

After activation:

- **Realtime / DebugView:** first-day implementation validation.
- **Reports → Acquisition:** sessions/users by source and campaign.
- **Reports → Engagement → Landing page / Pages and screens:** homepage, service and Resource entry pages.
- **Reports → Engagement → Events:** the four-event funnel and parameter-level debugging where available.
- **Admin → Data display → Events / Key events:** mark and verify `contact_submit_success` as the primary key event.
- **Explorations:** source → landing page → Resource → capability → Contact → success analysis without implying every visitor follows a fixed sequence.

Traffic metrics are sessions, views and Resource views. Intent metrics are capability clicks and Contact views. Website conversion is successful inquiry. Qualified leads, proposals, signed clients and revenue require later controlled CRM/business classification; GA4 cannot determine lead quality.

## Test and internal traffic

The hard production-host gate removes localhost, development, Vercel preview and ordinary automated QA from production reporting. Owner visits on the real production host can still appear after consent. GA4 internal-traffic filters or a documented browser-level decline can reduce this, but no fragile home-IP rule is treated as perfect identification.

First-day authorised validation:

1. Confirm no Google script or storage before consent.
2. Allow analytics on production and confirm one page view.
3. Open one Resource and remain for eight seconds; verify `resource_view` once.
4. Select its related capability; verify `related_capability_click`.
5. Open Contact; verify `contact_view` without form parameters.
6. Submit an inquiry only if the owner authorises delivery to the real recipient; verify `contact_submit_success` only after the application success state.
7. Identify/filter the test traffic in GA4 where appropriate.

Do not send real-looking unsolicited test inquiries and do not expose a public analytics dashboard.
