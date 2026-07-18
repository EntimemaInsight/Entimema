# Entimema UI Kit v2.0

## Core behavior
- The complete announcement, navigation and hero composition occupies exactly one desktop viewport.
- The complete first screen remains sticky while future sections scroll over/after it.
- On mobile, sticky behavior is intentionally disabled for accessibility and natural reading.

## Brand logo
- The mark is native SVG and renders sharply at every pixel density.
- The wordmark is live text with a restrained 650 weight and controlled negative tracking.
- No raster logo asset is required in the header.

## Typography
- Hero sizes are constrained by both viewport width and viewport height.
- Service typography also responds to viewport height, preventing overflow on shorter screens.
- Body copy is lighter and smaller than the previous system.

## Layout
- Desktop stage rows: 56px announcement, 136px header, remaining viewport for hero.
- Hero columns: 51.6% / 48.4%.
- Service list uses five equal rows so all five areas remain visible without scrolling.

## Sticky model
`home-stage` is `position: sticky; top: 0; height: 100svh`.
When new sections are added after it, the first screen remains in place while the page continues beneath it.
