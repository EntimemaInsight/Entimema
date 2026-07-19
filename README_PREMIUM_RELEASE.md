# ENTIMEMA Premium Product UI — July 2026

This release replaces generic icon-heavy presentation with restrained product-interface previews.

## Main changes
- Finance and risk cards now use product UI previews rather than decorative SVG illustrations.
- Services cards use six bespoke mini product interfaces: forecast, decision engine, data flow, transformation map, CFO cockpit and finance agent.
- Small list icons are replaced with quiet structural markers.
- Typography uses a consistent Windows-safe Cyrillic stack based on Segoe UI Variable.
- Cards, spacing, borders, shadows and motion are reduced and unified.
- Production build completed successfully with Next.js 16.2.10.

## Install
Copy the contents of this project over your local `entimema` folder, then run:

```powershell
npm install
npm run dev
```

After local approval:

```powershell
git add .
git commit -m "Introduce premium product UI system"
git push origin main
```
