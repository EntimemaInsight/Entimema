# Founder image and authority entity

## Scope and baseline

This change was prepared from Cloud-provided commit `77e99819db9f69867d33ccec2c6b6ab6a474e53a`, after confirming the current `/about`, `/alexander-dimitrov` and `/labs` implementations and the final Company motion and art-direction commits. The current Founder narrative, About bridge, LinkedIn badge and natural portrait were present.

## Authority graph

The Founder route now emits a single connected Schema.org graph containing:

- the established `Person` identity at `https://www.entimema.com/about#founder`;
- a `ProfilePage` for the canonical Founder URL;
- an `ImageObject` for the current portrait, including its real 400 × 400 dimensions, caption and relationship to both the page and Person.

The existing Person identifier remains stable, so the Organization founder relationship and existing Resource Article author references still resolve to one entity. No credentials, employment history, awards, education, dates or other authority claims were added. The dormant About schema helper was aligned to the already-published English name and canonical Founder URL to prevent a conflicting identity if it is reused.

## Portrait and visual lock

`public/alexander-dimitrov-founder-natural.jpg` remains byte-for-byte unchanged. Its visible `<Image>` markup, alt text, eager loading, high fetch priority, unoptimized delivery, responsive sizing, frame geometry, CSS crop, motion ordering and LinkedIn overlay are unchanged. Open Graph and Twitter continue to use the same portrait with its real 400 × 400 dimensions. No About, Labs, Company motion or Company art-direction markup or styling changed.

## Validation contract

Focused tests verify that the Person, ProfilePage and ImageObject form one graph without changing the established Person or Organization identifiers. The browser audit verifies the rendered graph alongside the existing portrait byte hash, metadata, layout, content, links, accessibility and viewport checks.
