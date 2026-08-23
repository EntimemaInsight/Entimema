# Entimema Decision Glyph Language (EDGL)

## Purpose

EDGL is a notation system for analytical operations. A glyph describes a transformation, relationship, state, or decision mechanism—not an industry object, interface, or AI metaphor.

`Glyph = operation + reduction + structure + recognition`

## Invariants

- A glyph is an operation, not an illustration.
- Geometry carries meaning; color creates editorial rhythm.
- Every published agent has one deliberate, type-safe glyph. There is no fallback glyph.
- The system remains coherent as charcoal linework without titles or colored tiles.
- Each glyph uses structural geometry and, when meaningful, one signal layer only.

## Grammar

Use the smallest sufficient set drawn from: lines (trajectory/boundary), nodes (observation/state), frames (system/population), parallel structures (comparison/cohort), nested structures (decomposition/residual), ordered blocks (stages), branches (conditional outcomes), and sparing curves (distribution/stability).

Target five to seven meaningful primitives. Remove any mark that does not change the operation represented. Use direction only when progression, deterioration, extraction, or branching requires it. Symmetry expresses balance; functional asymmetry expresses exception or transition.

The recurring EDGL signature is a **displaced terminal**: a consequential state or output sits slightly apart from its supporting structure. It is used only when the operation contains a meaningful result, exception, or transition.

## Construction

- SVG coordinate system: `viewBox="0 0 32 32"`.
- Conceptual safe zone: coordinates 4–28.
- Production size: 24px optical size inside a 44px tile.
- Master stroke: 1.6px, round cap, round join.
- Maximum semantic weights: structural ink and signal emphasis.
- Target internal negative space: 50–65% of the safe zone.
- Avoid gradients, shadows, borders, decorative fills, labels, tiny axes, and unnecessary arrows.
- Check antialiasing at production scale; prefer integer and half-pixel coordinates compatible with the master stroke.

## Morphology

Related operations should transform shared grammar rather than repeat an icon:

- `STATE + TRANSITION = STAGING / MIGRATION`
- `BOUNDS + OBSERVATION = MONITORING`
- `REFERENCE + BEHAVIOUR = STABILITY`
- `SOURCE + OUTPUT = EXTRACTION`
- `UNEQUAL INPUTS + REFERENCE = NORMALIZATION`
- `NODE + ALTERNATIVES = BRANCHING`

Semantic collision checks are required between observation/monitoring, stability/calibration, stages/migration, extraction/normalization, synthesis/aggregation, and residual/decomposition.

## Tile and color

The tile is a quiet 44×44px frame with a 6px radius: no border, shadow, gradient, or glow. The glyph remains predominantly charcoal. Muted coral, apricot, sand, lime, mint, cyan, blue, and lavender tones are sequenced editorially across the grid. Color is never taxonomy and must not carry recognizability.

Hover response is limited to a one-pixel lift or subtle tonal change. No rotation, drawing, pulse, glow, bounce, or morphing.

## Semantic design process

Before drawing, record: `agent name → analytical operation → minimal geometric metaphor`. The assignment record lives beside agent data in `agent-library-data.ts`. Build geometry only from the final metaphor, then compare it with the entire family at 32, 24, 20, and 16px, in color and grayscale.

## New-glyph acceptance protocol

Every proposed glyph must document:

1. Agent function.
2. Core analytical operation.
3. Existing EDGL primitives that represent it.
4. Why no existing glyph represents it.
5. Final minimal geometry and meaning of every major mark.
6. Side-by-side optical comparison with the full registry.

Acceptance requires distinct semantics, comparable optical mass, clear geometry at 20–24px, survival at 16px, and a form that remains credible without color or title.
