import type { ComponentType, SVGProps } from "react";

type MarkProps = SVGProps<SVGSVGElement>;
type MarkComponent = ComponentType<MarkProps>;

const MarkFrame = ({ children, ...props }: MarkProps) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" {...props}>
    {children}
  </svg>
);

const HollowNode = ({ x, y }: { x: number; y: number }) => <circle className="node" cx={x} cy={y} r="1.35" />;
const MicroNode = ({ x, y }: { x: number; y: number }) => <circle className="microNode" cx={x} cy={y} r=".72" />;
const SignalNode = ({ x, y }: { x: number; y: number }) => <circle className="signalNode" cx={x} cy={y} r="1.75" />;

// Required evidence positions converge on the one open chamber that closes the system.
const ClosureMark = (props: MarkProps) => <MarkFrame {...props}>
  <path className="field" d="M8 8.5h32v31H8z" />
  <path className="primary" d="M8 18V8.5h9.5M30.5 8.5H40V18M40 30v9.5h-9.5M17.5 39.5H8V30" />
  <path className="secondary" d="M17.5 8.5h13M8 18v12M40 18v12M17.5 39.5h13" />
  <path className="guide" d="M12 13l9 8m15-8-9 8M12 35l9-8" />
  <path className="primary" d="M18.5 18.5h11v11h-11z" />
  <HollowNode x={12} y={13}/><HollowNode x={36} y={13}/><HollowNode x={12} y={35}/>
  <SignalNode x={36} y={35}/><path className="signal" d="M27 27l7.7 6.7" />
</MarkFrame>;

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

// Staggered cohorts unfold across one horizon; one trajectory exits the expected landscape.
const VintageMark = (props: MarkProps) => <MarkFrame {...props}>
  <path className="field" d="M7.5 9.4c8.8.2 12.2 5.9 20.3 5.2 5.2-.4 8.7-.9 13.2 1.7v1.8c-4.6-2.7-8-2.2-13.1-1.8-8.4.8-11.9-5-20.4-5.2z" />
  <path className="primary" d="M7.5 10.3c4.4 0 6.8 1.3 9.7 2.9 3.3 1.9 6.6 2.4 10.6 2.1 5.2-.4 8.7-1 13.2 1.7M11.8 17.8c4.2 0 6.6 1.3 9.4 2.9 3.2 1.8 6.4 2.4 10.2 2.1 3.9-.3 6.8-.4 9.6 1.3M16.2 25.3c4 0 6.2 1.3 8.9 2.8 3 1.8 5.9 2.4 9.4 2.1 2.5-.2 4.6-.1 6.5.8M20.6 32.8c3.8 0 6 1.2 8.4 2.7 2.2 1.3 3.7 2.2 5.4 2.9 1.8.8 3.9 1.1 6.6.6" />
  <path className="guide" d="M17.2 13.2L21.2 20.7 25.1 28.1 29 35.5M40.9 12.8v14.7" />
  <path className="secondary" d="M8 7.7v5.2M12.3 15.2v5.2M16.7 22.7v5.2M21.1 30.2v5.2M38.5 14.8l2.5 2.2-2.5 2.1M38.6 21.9l2.4 2.2-2.4 2.1M38.7 29l2.3 2-2.3 2" />
  <HollowNode x={7.5} y={10.3}/><HollowNode x={11.8} y={17.8}/><HollowNode x={16.2} y={25.3}/><HollowNode x={20.6} y={32.8}/>
  <MicroNode x={17.2} y={13.2}/><MicroNode x={27.8} y={15.3}/><MicroNode x={21.2} y={20.7}/><MicroNode x={31.4} y={22.8}/><MicroNode x={25.1} y={28.1}/><MicroNode x={34.5} y={30.2}/><MicroNode x={29} y={35.5}/>
  <path className="signal" d="M33.1 37.8l1.3.6" /><SignalNode x={34.4} y={38.4}/><HollowNode x={41} y={39}/>
</MarkFrame>;

// A portfolio constellation orbits a reference envelope; one signal breaks containment.
const PortfolioMark = (props: MarkProps) => <MarkFrame {...props}>
  <circle className="field" cx="24" cy="24" r="10"/><circle className="primary" cx="24" cy="24" r="7.5"/>
  <path className="secondary" d="M24 11v26M11 24h26M18.7 18.7l10.6 10.6M29.3 18.7L18.7 29.3" />
  <path className="guide" d="M8 13c8-7 24-7 32 0M8 35c8 7 24 7 32 0" />
  <HollowNode x={11} y={17}/><HollowNode x={15} y={32}/><HollowNode x={24} y={14}/><HollowNode x={33} y={21}/><MicroNode x={28} y={34}/><SignalNode x={40} y={12}/>
  <path className="signal" d="M31 18l7.7-4.8" />
</MarkFrame>;

// Expected and observed probability fields overlap until a monitored region drifts.
const ProbabilityMark = (props: MarkProps) => <MarkFrame {...props}>
  <path className="field" d="M6 35c5-1 7-16 17-18 8-2 11 12 19 16v4H6z" />
  <path className="fieldAlt" d="M6 35c7-2 9-10 16-11 9-2 10 11 20 11v2H6z" />
  <path className="primary" d="M6 35c5-1 7-16 17-18 8-2 11 12 19 16" />
  <path className="observed" d="M6 35c7-2 9-10 16-11 9-2 10 11 20 11" />
  <path className="guide" d="M10 35V31M16 35V24M22 35V17M28 35V22M34 35V29M40 35V33" />
  <path className="secondary" d="M6 38h36M22 13v25" />
  <HollowNode x={16} y={25}/><HollowNode x={22} y={24}/><HollowNode x={28} y={24}/><SignalNode x={34} y={31}/>
</MarkFrame>;

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

// Nested cost layers are successively removed, exposing one protected residual margin.
const MarginMark = (props: MarkProps) => <MarkFrame {...props}>
  <path className="primary" d="M7 8h34v32H7zM12 13h24v22H12zM17 18h14v12H17z" />
  <path className="field" d="M17 18h14v12H17z" />
  <path className="secondary" d="M7 15h5M7 23h10M7 31h5M36 17h5M31 25h10M36 33h5" />
  <path className="guide" d="M10 11l5 5m18 16 5 5" />
  <path className="signal" d="M17 30h14" /><SignalNode x={24} y={30}/>
</MarkFrame>;

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
