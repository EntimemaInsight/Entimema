import type { ComponentType, SVGProps } from "react";

type MarkProps = SVGProps<SVGSVGElement>;
type MarkComponent = ComponentType<MarkProps>;

const MarkFrame = ({ children, ...props }: MarkProps) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" {...props}>
    {children}
  </svg>
);

const ProductMarkFrame = ({ children, ...props }: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="prototype" {...props}>
    {children}
  </svg>
);
const HollowNode = ({ x, y }: { x: number; y: number }) => <circle className="node" cx={x} cy={y} r="1.35" />;
const MicroNode = ({ x, y }: { x: number; y: number }) => <circle className="microNode" cx={x} cy={y} r=".72" />;
const SignalNode = ({ x, y }: { x: number; y: number }) => <circle className="signalNode" cx={x} cy={y} r="1.75" />;

// Fragments progress through two checkpoints and close at the single decision event.
const ClosureMark = (props: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="application-completeness" {...props}>
    <path className="productSolid" d="M2 5.4h10.1c2.2 0 3.4 1.2 4.6 2.9l2.4 3.5c.8 1.2 1.7 1.7 3.1 1.7h3.2c1.2 0 1.8.6 2.5 1.7.5.8 1.1 1.2 2.1 1.2v3H26.8c-1.4 0-2.4-.6-3.1-1.8-.4-.7-.9-1-1.8-1h-3.3c-2 0-3.3-.8-4.4-2.5l-2.4-3.6c-.8-1.2-1.7-1.7-3.1-1.7H2z" />
    <path className="productSolid" d="M2 12.2h8.8c2.2 0 3.5 1.1 4.7 2.9l2.3 3.4c.8 1.2 1.8 1.7 3.2 1.7h4.4c1.2 0 1.8.6 2.5 1.7.5.8 1.1 1.2 2.1 1.2v3h-3.2c-1.4 0-2.4-.6-3.1-1.8-.4-.7-.9-1-1.8-1h-3.3c-2 0-3.3-.8-4.4-2.5l-2.4-3.6c-.8-1.2-1.7-1.7-3.1-1.7H2z" />
    <path className="productSolid" d="M2 19h8.3c2.1 0 3.3 1 4.5 2.8l2.1 3.1c.8 1.2 1.8 1.7 3.2 1.7h3.8v3H18c-2 0-3.3-.8-4.4-2.5l-2.3-3.4c-.7-1-1.5-1.4-2.7-1.4H2zM27.4 26.6H30v3h-2.6z" />
    <path className="productCutout" d="M7 4.4h1.2v24.4H7z" />
    <path className="productCheckpointLeft" d="M7.6 2.6v1.3m0 5.5v1.3m0 5.5v1.3m0 5.5v1.3m0 1.5v3" />
    <circle className="productCutout" cx="7.6" cy="5.5" r="1.8" />
    <circle className="productCutout" cx="7.6" cy="12.3" r="1.8" />
    <circle className="productCutout" cx="7.6" cy="19.1" r="1.8" />
    <circle className="productSolid" cx="7.6" cy="5.5" r="1.05" />
    <circle className="productSolid" cx="7.6" cy="12.3" r="1.05" />
    <circle className="productSolid" cx="7.6" cy="19.1" r="1.05" />
    <path className="productCheckpoint" d="M23.5 9v15.7" />
    <circle className="productCutout" cx="25.6" cy="28.1" r="2.2" />
    <circle className="productSignal" cx="25.6" cy="28.1" r="1.55" />
  </svg>
);

// Heterogeneous inputs pass through a substantial classifier into assigned structures.
const ClassificationMark = (props: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="document-classification" {...props}>
    <path className="classificationInput" d="M1.5 2.4h5l2 2v5.1h-7zM1.5 12h7v6.7h-7zM1.5 21.2h7v6.5h-7z" />
    <path className="classificationInputCutout" d="M6.5 2.4v2h2zM2.8 7.1h3.9v.7H2.8zM2.8 14l1.5 1.6 1.35-1.35 1.6 2.1H2.8zM6.5 13.25a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6zM2.8 23h4.35v.7H2.8zM2.8 25.2h4.35v.7H2.8z" />
    <path className="classificationInbound" d="M8.9 6h1.35c.9 0 1.35.5 1.35 1.35v3.05c0 .8.45 1.25 1.25 1.25h.8M8.9 15.35h2c.8 0 1.2.45 1.2 1.25v1.15c0 .8.45 1.25 1.25 1.25h.3M8.9 24.3h1.55c.8 0 1.2-.45 1.2-1.25v-.55c0-.8.45-1.25 1.25-1.25h.75" />
    <path className="classificationClassifier" d="m16.3 7 5.3 3.55c.55.38.85.9.85 1.55v8.55c0 .65-.3 1.18-.85 1.55l-5.3 3.55c-1.05.7-2.25-.05-2.25-1.3V8.3c0-1.25 1.2-2 2.25-1.3z" />
    <path className="classificationAperture" d="M16.35 10.1v12.55M18.1 13.3h1M20.1 13.3h1M18.1 15.5h1M20.1 15.5h1M18.1 17.7h1M20.1 17.7h1M18.1 19.9h1M20.1 19.9h1" />
    <path className="classificationRouting" d="M22.45 16.35h1.45V8.1c0-.75.4-1.15 1.15-1.15h.6M23.9 16.35h1.75M23.9 16.35v8.1c0 .75.4 1.15 1.15 1.15h.6" />
    <circle className="classificationNode" cx="26" cy="6.95" r=".7" />
    <circle className="classificationNode" cx="26" cy="16.35" r=".7" />
    <circle className="productSignal" cx="26" cy="25.6" r=".8" />
    <path className="classificationOutput" d="M27.1 3.8h3.6v6.3h-3.6zM27.1 13.15h3.6v6.3h-3.6zM27.1 22.5h3.6v6.3h-3.6z" />
    <path className="classificationOutputDetail" d="M27.8 4.9H30v3.9h-2.2zM28.9 4.9v3.9M27.8 6.85H30M27.8 18v-1.15M28.9 18v-2.25M30 18v-3.35M27.8 25.65a1.1 1.1 0 1 0 1.1-1.1v1.1z" />
    <path className="classificationOutputSignal" d="M28.9 24.55a1.1 1.1 0 0 1 1.1 1.1h-1.1z" />
  </svg>
);

// A financial source is isolated by a precision aperture and resolves into structured values.
const ExtractionMark = (props: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="financial-statement-extraction" {...props}>
    <path className="productSolid" d="M4.1 1.8h12.7l4.5 4.5v17.1H4.1z" />
    <path className="extractionCutout" d="M16.8 1.8v4.5h4.5zM6.3 5.4h6.7v1H6.3zM6.3 8h9.4v1H6.3z" />
    <path className="extractionTable" d="M6.2 11h11.9v7.7H6.2zM9.15 11v7.7M13.1 11v7.7M6.2 13.55h11.9M6.2 16.1h11.9" />

    <path className="extractionOutput" d="M3.7 25.3h4.5v5H3.7zM9.3 25.3h4.5v5H9.3zM14.9 25.3h4.5v5h-4.5zM20.5 25.3H25v5h-4.5z" />
    <path className="extractionOutputDetail" d="M5 28.9h2M6 26.5v2.4M10.5 28.9v-1.2M11.55 28.9v-2.1M12.6 28.9v-3M16 29l2.2-2.8M16.4 26.4h.01M17.85 28.8h.01M21.5 28.1a1.25 1.25 0 1 0 1.25-1.25v1.25z" />
    <path className="extractionFlow" d="M6 20.5v3M11.55 20.5v3M17.15 20.5v3M22.75 20.5v3" />

    <circle className="extractionAperture" cx="20.3" cy="16.3" r="6.3" />
    <circle className="extractionLens" cx="20.3" cy="16.3" r="4.65" />
    <path className="extractionHandle" d="m24.7 20.7 4.7 4.7" />
    <path className="extractionTarget" d="M18.2 14.8v-1.2h1.2M22.4 14.8v-1.2h-1.2M18.2 17.8V19h1.2M22.4 17.8V19h-1.2" />
    <path className="extractionCapture" d="M19.5 15.3h1.7M19.5 16.3h2.2M19.5 17.3h1.7" />
  </svg>
);

// A financial source passes through one spreading decision into three standardized tables.
const SpreadingMark = (props: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="financial-spreading" {...props}>
    <path className="productSolid" d="M2.8 5.2h6.6l3.1 3.1v13.3H2.8z" />
    <path className="spreadingCutout" d="M9.4 5.2v3.1h3.1zM4.4 8.4h3.7v1H4.4zM4.4 10.5h5.7v1H4.4zM4.4 12.6h4.6v1H4.4zM4.2 15h7v5.1h-7z" />
    <path className="spreadingGrid" d="M6.55 15v5.1M8.9 15v5.1M4.2 17.55h7" />

    <path className="spreadingConnector" d="M12.5 16.8h2.3M19.2 16.8h1.8M17 14.6V8.2c0-.8.6-1.4 1.4-1.4H21M17 19v6.3c0 .8.6 1.4 1.4 1.4H21" />
    <circle className="productSolid" cx="17" cy="16.8" r="3.05" />
    <path className="spreadingSignal" d="M15.3 16.8h3.3m-1.25-1.3 1.3 1.3-1.3 1.3" />

    <path className="productSolid" d="M22.1 4.2h7.1v6.1h-7.1zM22.1 13.75h7.1v6.1h-7.1zM22.1 23.3h7.1v6.1h-7.1z" />
    <path className="spreadingCutout" d="M22.8 5.45h5.7v4.15h-5.7zM22.8 15h5.7v4.15h-5.7zM22.8 24.55h5.7v4.15h-5.7z" />
    <path className="spreadingGrid" d="M24.7 5.45V9.6m1.9-4.15V9.6m-3.8-2.08h5.7M24.7 15v4.15m1.9-4.15v4.15m-3.8-2.08h5.7M24.7 24.55v4.15m1.9-4.15v4.15m-3.8-2.08h5.7" />
    <circle className="productSolid" cx="21" cy="6.8" r=".65" />
    <circle className="productSolid" cx="21" cy="16.8" r=".65" />
    <circle className="productSolid" cx="21" cy="26.7" r=".65" />

    <path className="spreadingValidation" d="M7.6 22.5v2.4" />
    <circle className="productSolid" cx="7.6" cy="26.7" r="2.05" />
    <path className="spreadingSignal" d="m6.65 26.7.65.65 1.25-1.4" />
  </svg>
);

// Heterogeneous evidence converges through a structured synthesis gate into one decision.
const SynthesisMark = (props: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="credit-memo" {...props}>
    <path className="creditEvidence" d="M2.1 4.1h2.1v2.1H2.1zM1.3 9.5h1.8v1.8H1.3zM4.7 9.8h1.5v1.5H4.7zM1 15.2h2.7v1.4H1zM4.9 14.8h1.8v1.8H4.9zM1.1 20.5h2.4v1.5H1.1zM5 20.4h1.6V22H5zM2.4 25.8h1.8v1.8H2.4zM5.2 28.2h1.5v1.5H5.2z" />
    <path className="creditConvergence" d="M7.7 5.1c5.1.2 7.7 2.3 9.2 6.2.6 1.6 1.5 2.6 2.7 3.1M7.7 10.2c4.4.1 6.4 1.7 8.3 4.2 1 1.3 2.1 2.1 3.6 2.3M7.7 15.3c4.2 0 5.6.7 7.8 2.3 1.3.9 2.6 1.3 4.1 1.3M7.7 20.8c4.4 0 6.6-1 8.6-2.3 1.1-.7 2.1-1.1 3.3-1.1M7.7 25.8c4.7-.1 7-1.7 8.5-4.6.8-1.5 1.8-2.4 3.4-2.8M7.7 29c5.4-.4 7.9-2.7 9.3-6.7.5-1.5 1.4-2.5 2.6-2.9" />
    <path className="creditGate" d="M19.5 14v6.7M21.3 13.6v7.5" />
    <path className="creditDecision" d="m22.9 14.8 4-4h3.2l1.9 4.1M22.9 20l4 4h3.2l1.9-4.2" />
    <circle className="productSignal" cx="29.6" cy="17.4" r="1.55" />
  </svg>
);

// Three temporal ribbons share a cadence until the final cohort makes a material divergence.
const VintageMark = (props: MarkProps) => <ProductMarkFrame {...props}>
  <path className="productSolid" d="M3 5.5h13.4l4.1 4.1H29v4.2H18.8l-4.1-4.1H3z" />
  <path className="productSolid" d="M3 13.9h10.5l4.1 4.1H29v4.2H15.9l-4.1-4.1H3z" />
  <path className="productSolid" d="M3 22.3h8.1l4.1 4.1H24v4.1H13.5l-4.1-4.1H3z" />
  <path className="productSignal" d="M24 26.4h5v4.1h-5z" />
</ProductMarkFrame>;
// A portfolio constellation orbits a reference envelope; one signal breaks containment.
const PortfolioMark = (props: MarkProps) => <MarkFrame {...props}>
  <circle className="field" cx="24" cy="24" r="10"/><circle className="primary" cx="24" cy="24" r="7.5"/>
  <path className="secondary" d="M24 11v26M11 24h26M18.7 18.7l10.6 10.6M29.3 18.7L18.7 29.3" />
  <path className="guide" d="M8 13c8-7 24-7 32 0M8 35c8 7 24 7 32 0" />
  <HollowNode x={11} y={17}/><HollowNode x={15} y={32}/><HollowNode x={24} y={14}/><HollowNode x={33} y={21}/><MicroNode x={28} y={34}/><SignalNode x={40} y={12}/>
  <path className="signal" d="M31 18l7.7-4.8" />
</MarkFrame>;

// Expected and observed probability bodies remain enclosed; their displaced overlap exposes drift.
const ProbabilityMark = (props: MarkProps) => <ProductMarkFrame {...props}>
  <path className="productStroke" d="M3.5 18.5C3.5 11 8.1 5 13.7 5s10.2 6 10.2 13.5v8H3.5z" />
  <path className="productStroke" d="M8.1 18.5C8.1 12.2 12.2 7 17.3 7s9.2 5.2 9.2 11.5v8H8.1z" />
  <path className="productSolid" d="M13.7 12.1c2.1 0 3.8 2.8 3.8 6.4v3.8H9.9v-3.8c0-3.6 1.7-6.4 3.8-6.4z" />
  <circle className="productSignal" cx="26.5" cy="18.5" r="2.5" />
</ProductMarkFrame>;
// An exposure crosses three ordered risk chambers while the loss horizon intensifies.
const RiskChambersMark = (props: MarkProps) => <MarkFrame {...props}>
  <path className="field" d="M6 10h10v28H6z"/><path className="fieldAlt" d="M19 10h10v28H19z"/><path className="fieldStrong" d="M32 10h10v28H32z"/>
  <path className="primary" d="M6 10h10v28H6zM19 10h10v28H19zM32 10h10v28H32z" />
  <path className="secondary" d="M9 34V24m4 10V18M22 34V20m4 14V15M35 34V17m4 17V12" />
  <path className="guide" d="M10 17c6 0 8 8 14 8s8-7 13-7" />
  <HollowNode x={10} y={17}/><SignalNode x={24} y={25}/><HollowNode x={37} y={18}/>
  <path className="signal" d="M37 18v16M34.5 34h5" />
</MarkFrame>;

// Budget and actual remain nearly coincident; the material displacement becomes a bounded field.
const VarianceMark = (props: MarkProps) => <MarkFrame {...props}>
  <path className="field" d="M7 30l7-6 7 2 7-9 7 5 6-7v8l-6 5-7-4-7 8-7-2-7 6z" />
  <path className="primary" d="M7 30l7-6 7 2 7-9 7 5 6-7" />
  <path className="observed" d="M7 36l7-6 7 2 7-8 7 4 6-5" />
  <path className="guide" d="M7 12v27M7 39h34M14 12v27M21 12v27M28 12v27M35 12v27M41 12v27" />
  <HollowNode x={14} y={24}/><HollowNode x={21} y={26}/><SignalNode x={28} y={24}/><HollowNode x={35} y={22}/>
</MarkFrame>;

// A value vessel is reduced through repeated cost layers, leaving a protected residual chamber.
const MarginMark = (props: MarkProps) => <ProductMarkFrame {...props}>
  <path className="productSolid" fillRule="evenodd" d="M3 3h26v26H3zm4 4v18h18V7z" />
  <path className="productSolid" d="M8.5 8.5h15v4h-15zM8.5 14h11.5v4H8.5zM8.5 19.5h8v4H8.5z" />
  <path className="productSignal" d="M18.5 19.5h5v4h-5z" />
</ProductMarkFrame>;
// A present state opens into bounded future envelopes; one trajectory becomes active.
const ScenarioMark = (props: MarkProps) => <MarkFrame {...props}>
  <path className="field" d="M22 17c7-8 12-8 20-7v8c-7-1-12 0-20 4zM22 26c8 2 13 4 20 4v8c-8 0-13-2-20-7z" />
  <path className="primary" d="M6 24h11c6 0 7-9 14-11 4-2 7-2 11-1M17 24c7 0 8 9 15 11 4 1 7 1 10 1M17 24c8 0 11 0 25 1" />
  <path className="signal" d="M17 24c8 0 11 0 25 1" />
  <path className="guide" d="M29 13v22M35 11v26M41 10v29" />
  <HollowNode x={17} y={24}/><MicroNode x={31} y={13}/><MicroNode x={32} y={35}/><SignalNode x={35} y={25}/>
  <path className="secondary" d="M40 9h3v8M40 31h3v8" />
</MarkFrame>;

export const agentMarks = {
  closure: ClosureMark,
  classification: ClassificationMark,
  extraction: ExtractionMark,
  spreading: SpreadingMark,
  synthesis: SynthesisMark,
  vintage: VintageMark,
  portfolio: PortfolioMark,
  probability: ProbabilityMark,
  riskChambers: RiskChambersMark,
  variance: VarianceMark,
  margin: MarginMark,
  scenarios: ScenarioMark,
} satisfies Record<string, MarkComponent>;

export type AgentMarkName = keyof typeof agentMarks;
