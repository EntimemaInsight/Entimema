# Entimema Design System

The implementation source of truth is:
- `styles/tokens.css`
- `app/globals.css`
- `components/ui/`
- `design-system/`

No page-level component may introduce a new color, font scale or spacing convention without first adding it to the system.

## Publication cover systems

- Insights: `docs/INSIGHTS_COVER_DESIGN_SYSTEM.md` is the permanent specification for creating, replacing, reviewing, and publishing Insights covers.
- Engineering: a separate publication identity implemented by `app/resources/EngineeringPublicationCover.tsx`. Do not apply the Insights system to Engineering covers or merge the two systems.
