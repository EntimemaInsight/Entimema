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

// Scattered observations cross a curved boundary and resolve into ordered states.
const ClassificationMark = (props: MarkProps) => <MarkFrame {...props}>
  <path className="field" d="M25 8h15v32H17c5-7 7-12 7-18 0-5-1-9 1-14z" />
  <path className="primary" d="M25 8c-2 6 0 10-1 15-1 6-3 11-7 17" />
  <path className="secondary" d="M29 12h8M28 20h9M26 28h11M22 36h15" />
  <path className="guide" d="M7 12c7 1 11 3 17 8M8 25c7 0 10 1 15 3M10 36c5 0 7 0 11-1" />
  <MicroNode x={8} y={12}/><MicroNode x={11} y={18}/><MicroNode x={8} y={25}/><MicroNode x={12} y={31}/><MicroNode x={10} y={36}/>
  <HollowNode x={32} y={12}/><HollowNode x={32} y={20}/><SignalNode x={32} y={28}/><HollowNode x={32} y={36}/>
</MarkFrame>;

// Dense source evidence passes through an aperture into selected, structured variables.
const ExtractionMark = (props: MarkProps) => <MarkFrame {...props}>
  <path className="field" d="M6.5 8h21v32h-21z" />
  <path className="primary" d="M6.5 8h21v12l-4 4 4 4v12h-21zM27.5 20v8" />
  <path className="micro" d="M10 12h5m2 0h7M10 16h11M10 20h4m2 0h7M10 24h9M10 28h5m2 0h7M10 32h12M10 36h6m2 0h6" />
  <path className="guide" d="M14 20l9.5 4L14 28M19 32l4.5-8" />
  <path className="primary" d="M27.5 24h5M34 14h7M34 24h7M34 34h7" />
  <HollowNode x={34} y={14}/><SignalNode x={34} y={24}/><HollowNode x={34} y={34}/>
  <path className="secondary" d="M41 11v6M41 21v6M41 31v6" />
</MarkFrame>;

// Unequal source measures are compressed through a datum and leave as a parallel architecture.
const SpreadingMark = (props: MarkProps) => <MarkFrame {...props}>
  <path className="primary" d="M7 10h9M7 17h15M7 24h7M7 31h18M7 38h12" />
  <path className="guide" d="M16 10l12 12M22 17l6 5M14 24l14-2M25 31l3-9M19 38l9-16" />
  <path className="field" d="M27 17h5v12h-5z" /><path className="primary" d="M28.5 17v12" />
  <path className="secondary" d="M32 12h9M32 20h9M32 28h9M32 36h9" />
  <path className="primary" d="M41 10v28" /><MicroNode x={35} y={12}/><MicroNode x={37} y={20}/><SignalNode x={39} y={28}/><MicroNode x={35} y={36}/>
</MarkFrame>;

// Independent evidence streams form a compact, defensible synthesis core.
const SynthesisMark = (props: MarkProps) => <MarkFrame {...props}>
  <path className="field" d="M18 16l6-4 6 4v16l-6 4-6-4z" />
  <path className="primary" d="M18 16l6-4 6 4v16l-6 4-6-4zM18 20h12M18 28h12" />
  <path className="guide" d="M7 10l11 8M7 24h11M7 38l11-8M41 10l-11 8M41 38l-11-8" />
  <HollowNode x={7} y={10}/><HollowNode x={7} y={24}/><HollowNode x={7} y={38}/><HollowNode x={41} y={10}/><HollowNode x={41} y={38}/>
  <path className="secondary" d="M21 24h6M24 12v24" /><SignalNode x={24} y={24}/>
</MarkFrame>;

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
