# Entimema Design System v1.1

## Brand principles

1. **Clarity before decoration.** Every visual choice must improve comprehension or trust.
2. **Structured confidence.** Layouts use clear grids, measured whitespace and restrained accents.
3. **Technology without coldness.** Navy communicates control; orange signals action and intelligence.
4. **No visual noise.** Dots, lines and motion remain secondary to content.

## Core tokens

- Navy: `#071C57`
- Deep navy: `#04133F`
- Orange: `#FF4A12`
- Hairline: `rgba(154, 187, 216, 0.46)`
- Spacing rhythm: `8 / 16 / 24 / 32 / 48 / 64 / 80 / 96 px`
- Max content width: `1412 px`

## Typography

- UI and body: Avenir Next / Segoe UI / Arial fallback stack
- Hero: 700 weight, 1.18 line-height, negative tracking
- Navigation: 700 weight, compact and restrained
- Supporting copy: regular weight, generous line-height

## Layout rules

- Desktop uses two proportional columns.
- Hero must fit within the first viewport at common laptop resolutions whenever content permits.
- The page may scroll, but the first screen should feel complete and should not require scrolling to understand the proposition.
- Mobile stacks the hero content and service list.

## Dots

- Blue dots are atmosphere, not decoration.
- Orange dots are sparse accents only.
- Never use a dense, uniform orange pattern.

## Components

- `AnnouncementBar`
- `BrandLogo`
- `Navbar`
- `DotField`
- `Hero`
- `ServiceRow` (currently internal to `Hero`)

## Governance

New pages must use the tokens from `styles/tokens.css`. Avoid one-off colors, arbitrary spacing and component-specific font scales unless the design system is intentionally extended.
