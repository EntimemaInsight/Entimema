# Sprint N — Executive Intelligence

Implemented a light, Taktile-inspired interactive executive intelligence scene under the hero.

## Included
- Alternating Elena Angelova / CFO and Elisaveta Geneva / Risk Manager states.
- Viewport-aware animation: the cycle runs only while the section is visible.
- Manual Finance / Risk state switch.
- Dotted grid, static glow, connection paths, floating data tags and two AI-agent panels.
- Responsive layout for desktop, tablet and mobile.
- Reduced-motion fallback.
- Local WebP profile assets.

## Performance approach
- Scene transitions use opacity and transform.
- The interval is paused outside the viewport.
- Mobile removes decorative orbit tags and SVG connectors.
- No video, GIF, canvas, large moving blur or animated backdrop-filter.
