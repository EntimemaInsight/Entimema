# Entimema Insights Cover Design System

Status: approved and permanent  
Applies to: Entimema Resources with `stream: "insights"`  
Does not apply to: Entimema Resources with `stream: "engineering"`

This document is the source of truth for every new or revised Entimema Insights cover. Its purpose is to preserve the approved cover language without turning it into a repetitive template. The quality target is a specialist institutional research or consulting publication with an implied production value of approximately $50,000 per article.

## 1. Canonical references

Begin with the approved cover assets in `public/resources/covers/`, especially:

1. `operational-driver-forecasting.png`
2. `working-capital-system.png`
3. `manufacturing-cost-architecture.png`

The other approved Insights covers extend the same grammar across Credit Risk and Financial Data. Use the references for art direction, hierarchy, restraint, and production quality—not as objects or layouts to copy.

## 2. Visual DNA

Every Insights cover must combine:

- premium institutional research publishing;
- cinematic editorial composition;
- black, near-black, graphite, or extremely dark desaturated environments;
- restrained Entimema navy and steel blue where conceptually useful;
- restrained copper, amber, or burnt-orange accents;
- an elegant, high-contrast editorial serif title integrated into the image;
- one strong conceptual metaphor expressed as a physical, architectural, or sculptural object;
- subtle Entimema identity, disciplined information density, and generous negative space;
- sharp, plausible materials, lighting, geometry, reflections, and depth.

Orange is an accent, never the dominant field. Prefer fewer, stronger elements. Conceptual precision takes priority over decorative complexity.

## 3. Canonical anatomy

### Upper-left identity

Set `ENTIMEMA` above the relevant practice or category, small and restrained. The category must follow the article taxonomy, for example `CREDIT RISK`, `PLANNING & FORECASTING`, `LIQUIDITY & WORKING CAPITAL`, or `COST & PROFITABILITY`.

### Analysis identifier

Use `ANALYSIS / XX`, subordinate to the title. Select the identifier from the article architecture and existing sequence; verify that it is intentional and not already assigned. It must not compete with the title.

### Main title

Render the exact approved article title inside the image using the established premium editorial serif treatment. Keep it readable at Resources-card scale, avoid excessive line fragmentation, and preserve negative space. The title normally occupies a reserved editorial zone on the left, but another deliberate zone is permitted when the concept requires it.

### Conceptual visual

Use one distinct, physically plausible metaphor derived from the article's methodology—not merely its title. Suitable vocabularies include precision metal, glass, layered materials, controlled fluid forms, architectural structures, analytical instruments, and landscapes where the method justifies them. The object normally develops through the centre or right of the composition.

### Bottom descriptor

Where it strengthens the idea, add a very small three-part descriptor such as `RANKING / CALIBRATION / PD`, `FLOW / CYCLE / CASH`, or `MATERIAL / COST / STRUCTURE`. It is optional and must remain subordinate.

## 4. Compositional grammar

The common grammar is:

`editorial information and title → conceptual object → controlled negative space`

Do not make identical templates. Vary viewpoint, scale, object, rhythm, and spatial development when those choices clarify the methodology. Consistency comes from hierarchy, materials, lighting, palette, restraint, and production quality.

The final asset should use the established 3:2 landscape ratio. Current canonical raster covers are 1536 × 1024 pixels. Protect all critical information from card cropping and keep the title legible in the actual `/resources` grid.

## 5. Practice vocabularies

- Credit Risk: segmentation, distributions, thresholds, migration, ranking, calibration, transitions, and portfolio structures.
- Planning & Forecasting: trajectories, scenarios, horizons, branching systems, operating drivers, and landscapes.
- Liquidity & Working Capital: cycles, flows, circulation, constraints, and interconnected systems.
- Cost & Profitability: materials, layers, allocation, decomposition, manufacturing structures, and economic architecture.

These are conceptual directions, not templates. Every practice remains part of one recognisable Insights family.

## 6. Prohibited languages

Do not use flowcharts, process boxes, dashboards, pseudo-scientific interfaces, decorative charts, random financial symbols, stock photography, giant cropped sans-serif words, generic AI waves, glowing neural networks, particle fields, data meshes, excessive gradients, neon, cyberpunk styling, meaningless pseudo-text, or visual clutter.

Reject malformed geometry, impossible reflections, incoherent objects, fake text, arbitrary glow, meaningless analytical markings, and excessive complexity. An image is not acceptable merely because it looks technologically sophisticated.

## 7. Required workflow for every Insights article

1. Read the article methodology and identify its central intellectual tension.
2. Define the strongest conceptual metaphor from the methodological argument—not from the title alone.
3. Translate that metaphor into the visual DNA and relevant practice vocabulary above.
4. Confirm the exact category, `ANALYSIS / XX` identifier, title, and optional descriptor before generation.
5. Create a 3:2 cover using the canonical references as art-direction references.
6. Inspect full resolution for text accuracy, geometry, material plausibility, reflections, lighting, and artefacts.
7. Integrate the asset through the existing resource cover architecture; do not alter layout to accommodate a weak cover.
8. Test the real `/resources` card and article hero at desktop, tablet, and mobile widths.
9. Apply both quality gates below and reject or regenerate when either fails.
10. Publish only after the cover passes alongside the article's normal validation.

## 8. Generation brief requirements

A production prompt or creative brief must specify:

- the asset's use as an Entimema Insights hero and Resources card;
- canonical reference covers as style references only;
- exact text, category, identifier, title, and descriptor;
- the methodology-derived metaphor and why it represents the article;
- scene, materials, framing, reserved title zone, lighting, and restrained palette;
- 3:2 composition and card-scale legibility;
- the prohibited languages and artefacts in this specification;
- no additional text, pseudo-text, unrelated logos, or watermark.

Never rely on a generic prompt that contains only the article title.

## 9. Acceptance gates

### Card-scale gate

At the actual `/resources` card size, confirm that:

- the title is readable;
- the primary object is recognisable;
- hierarchy remains clear and branding remains subtle;
- the composition does not collapse or crop critical information;
- there is no overflow, distortion, or broken image;
- the cover remains coherent beside every other Insights cover.

### $50,000 gate

Ask explicitly:

> Would this be credible as the cover of a specialist institutional research or consulting publication with an implied production value of approximately $50,000?

Reject anything generic, templated, decorative, cheap, visually confused, obviously AI-generated, conceptually shallow, or inconsistent with Entimema. Schedule pressure is not a reason to lower the standard.

## 10. Engineering separation

Engineering is a separate but related Entimema publication family. Its covers are rendered through `app/resources/EngineeringPublicationCover.tsx` and have their own identity. Do not convert Engineering covers to this system, use Engineering covers as Insights references, or merge the two systems unless a future task explicitly changes that architecture.

When a resource's stream is uncertain, inspect `app/resources/resource-data.ts` before selecting a cover system.

## 11. Change control

Existing approved covers are production references. Do not replace them casually. Any future change to this specification or an approved cover must preserve cross-library coherence, document the reason, pass the two acceptance gates, and leave article content, routes, metadata, taxonomy, filters, ordering, navigation, and unrelated components unchanged unless the task explicitly authorises those changes.
