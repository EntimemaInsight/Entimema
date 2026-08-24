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

// Dense financial data passes through a substantial extraction boundary into structured output.
const ExtractionMark = (props: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="financial-statement-extraction" {...props}>
    <path className="productSolid" d="M1.8 5.2h2.5v2.5H1.8zM6 7.2h2.8v2.8H6zM1.8 10.1h2.5v2.5H1.8zM6 12h2.8v2.8H6zM10.2 9.3h2.35v2.35H10.2zM1.8 15h2.5v2.5H1.8zM6 16.8h2.8v2.8H6zM10.2 14.1h2.35v2.35H10.2zM1.8 19.9h2.5v2.5H1.8zM6 21.6h2.8v2.8H6zM10.2 18.9h2.35v2.35H10.2zM1.8 24.8h2.5v2.5H1.8z" />
    <path className="productSignal" d="M10.2 23.7h2.35v2.35H10.2z" />

    <path className="productSolid" fillRule="evenodd" d="M16.1 3.3 22 2.1c1.05-.22 1.9.58 1.9 1.6v4.2h-2.35V4.65l-3.1.63v21.44l3.1.63V24.1h2.35v4.2c0 1.02-.85 1.82-1.9 1.6l-5.9-1.2z" />

    <path className="productSolid" d="M21.8 10.2h8.4v2.35h-8.4zM21.8 15.1h8.4v2.35h-8.4zM21.8 20h8.4v2.35h-8.4z" />
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

// Concentric cohorts advance into a striped time sector; the isolated event marks emerging risk.
const VintageMark = (props: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="credit-vintage-analysis" {...props}>
    <path className="productSolid" fillRule="evenodd" d="M15.4 2.1A13.9 13.9 0 0 0 5.57 25.83a13.9 13.9 0 0 0 18.25 1.28l-1.42-2.02A11.43 11.43 0 0 1 7.39 7.87a11.43 11.43 0 0 1 8.01-3.3V2.1Z" />
    <path className="productSolid" d="M27.85 17.15a12.7 12.7 0 0 1-1.75 6.47l-2.13-1.25a10.22 10.22 0 0 0 1.41-5.22h2.47Z" />
    <path className="productSolid" fillRule="evenodd" d="M15.4 7.35a8.65 8.65 0 1 0 8.65 9.8h-2.48a6.18 6.18 0 1 1-6.17-7.33V7.35Z" />
    <path className="productSolid" d="M15.4 12.02a4.12 4.12 0 1 0 4.12 4.12H15.4v-4.12Z" />
    <path className="productSolid" d="M16.82 2.18v1.38h2.4a13.4 13.4 0 0 0-2.4-1.38Zm0 2.48v1.38h5.77a13.4 13.4 0 0 0-1.63-1.38h-4.14Zm0 2.48v1.38h7.7a13.4 13.4 0 0 0-1.08-1.38h-6.62Zm0 2.48V11h9.06a13.4 13.4 0 0 0-.72-1.38h-8.34Zm0 2.48v1.38h9.98a13.4 13.4 0 0 0-.42-1.38h-9.56Zm0 2.48v1.38h10.4a13.4 13.4 0 0 0-.17-1.38H16.82Z" />
    <circle className="productSignal" cx="25.46" cy="25.33" r="2.05" />
  </svg>
);
// A portfolio matrix sits inside a continuous monitoring field; trajectory and alert resolve within it.
const PortfolioMark = (props: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="portfolio-monitoring" {...props}>
    <path className="portfolioMatrix" d="M2 5h2.7v2.7H2zM5.7 5h2.7v2.7H5.7zM9.4 5h2.7v2.7H9.4zM2 8.7h2.7v2.7H2zM5.7 8.7h2.7v2.7H5.7zM9.4 8.7h2.7v2.7H9.4zM2 12.4h2.7v2.7H2zM5.7 12.4h2.7v2.7H5.7zM9.4 12.4h2.7v2.7H9.4zM2 16.1h2.7v2.7H2zM5.7 16.1h2.7v2.7H5.7zM9.4 16.1h2.7v2.7H9.4zM2 19.8h2.7v2.7H2zM5.7 19.8h2.7v2.7H5.7zM9.4 19.8h2.7v2.7H9.4zM2 23.5h2.7v2.7H2zM5.7 23.5h2.7v2.7H5.7zM9.4 23.5h2.7v2.7H9.4zM13.1 23.5h2.7v2.7h-2.7z" />
    <path className="portfolioMatrixSignal" d="M9.4 5h2.7v2.7H9.4zM5.7 16.1h2.7v2.7H5.7z" />

    <path className="portfolioOuterRing" d="M16.1 3.2a12.8 12.8 0 0 1 9.5 4.2M29.3 13a12.8 12.8 0 0 1-.2 7.2M27.4 23.7a12.8 12.8 0 0 1-13.2 4.9" />
    <path className="portfolioOuterDots" d="M13.7 3.5h.01M11.5 4.25h.01M9.55 5.45h.01M7.95 7h.01" />
    <circle className="portfolioField" cx="18.6" cy="16" r="8.8" />

    <path className="portfolioTrend" d="m12.7 17.6 3.1-2.4 2.9 1.75 3.65-3.65" />
    <circle className="portfolioTrendNode" cx="12.7" cy="17.6" r=".95" />
    <circle className="portfolioTrendNode" cx="15.8" cy="15.2" r=".95" />
    <circle className="portfolioTrendNode" cx="18.7" cy="16.95" r=".95" />
    <circle className="portfolioTrendNode" cx="22.35" cy="13.3" r=".95" />
    <path className="portfolioBars" d="M15 20.2h1.45v2.5H15zM17.4 19h1.45v3.7H17.4zM19.8 17.8h1.45v4.9H19.8zM22.2 16.4h1.45v6.3H22.2z" />

    <circle className="productSignal" cx="26.25" cy="9.7" r="2.15" />
    <path className="portfolioAlertCheck" d="m25.25 9.7.7.7 1.35-1.45" />
  </svg>
);

// DATA passes through the governed MODEL and resolves into monitored STATES.
const ProbabilityMark = (props: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="pd-model-monitoring" {...props}>
    <path className="pdData" d="M1.5 5h7v5.2h-7zM1.5 13.4h7v5.2h-7zM1.5 21.8h7V27h-7z" />
    <path className="pdDataDetail" d="M3.1 6.7h3.8M3.1 8.5h2.5M3.1 15.1h3.8M3.1 16.9h2.5M3.1 23.5h3.8M3.1 25.3h2.5" />
    <path className="pdInbound" d="M8.5 7.6h2.2c.8 0 1.2.4 1.2 1.2v4.7M8.5 16h3.4M8.5 24.4h2.2c.8 0 1.2-.4 1.2-1.2v-4.7" />

    <path className="pdModel" d="m12 10.2 4-2.3 4 2.3v11.6l-4 2.3-4-2.3z" />
    <path className="pdModelCore" d="M14.1 12.2h3.8v7.6h-3.8zM14.1 14.1h3.8M14.1 16h3.8M14.1 17.9h3.8" />

    <path className="pdOutbound" d="M20 16h2.1M22.1 16V8.8c0-.8.4-1.2 1.2-1.2h1.2M22.1 16h2.4M22.1 16v7.2c0 .8.4 1.2 1.2 1.2h1.2" />
    <path className="pdState" d="M24.5 4.8h6v5.6h-6zM24.5 13.2h6v5.6h-6zM24.5 21.6h6v5.6h-6z" />
    <path className="pdStateDetail" d="M26 8.4V6.8h1.1v1.6h1.1V6h1.1v2.4M26 16h3M26 17.2h2M26 24.4h3" />
    <path className="productSignal" d="M26 25.6h3v1.6h-3z" />
  </svg>
);
// Ordered stages accumulate loss mass beneath a deterioration path and terminal ECL event.
const RiskChambersMark = (props: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="ifrs-9-ecl-analysis" {...props}>
    <path className="eclRiskMass" d="M12 25.1V20.3l8-5.7v10.5H12ZM21.5 25.1V16.8l8-6.1v14.4h-8Z" />
    <path className="eclStage" d="M2.5 13.9v11.2h8V11.6M12 12.1v13h8V8.3M21.5 10.3v14.8h8V5.8" />
    <path className="eclDeterioration" d="m12.7 18.8 4.1-3.2 3.9-3.1 4.3-3.1 3.4-3" />
    <circle className="eclDeteriorationNode" cx="16.8" cy="15.6" r="1.15" />
    <circle className="eclDeteriorationNode" cx="24.9" cy="9.4" r="1.15" />
    <path className="eclTrajectory" d="M2.5 11.8 9.2 9.3l3.4-4.1h4.1l2.5-2.7 4-.6 4.1-1.5" />
    <circle className="productSignal" cx="29.1" cy="1.75" r="1.7" />
    <path className="eclBaseline" d="M1.8 28.5h9.1M11.8 28.5h8.6M21.3 28.5h9.2" />
  </svg>
);

// Plan and actual anchor a material deviation beneath one decision event.
const VarianceMark = (props: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="p-and-l-variance" {...props}>
    <path className="varianceReference" d="M2.3 14.4h27.4" />
    <path className="varianceAxis" d="M16 6.8v15.1" />
    <path className="varianceMass" d="M5.7 14.4c2.1 0 3.2.6 4.6 2.2v10.7H5.7V14.4ZM22.3 15.7h4.7v11.6h-4.7V15.7ZM22.3 10.4a5.1 5.1 0 0 1 5.1-5.1v9.1h-5.1v-4Z" />
    <path className="varianceCurve" d="M7.2 14.45c3.6 0 4.4 8 8.8 8s5.4-8 9.1-8" />
    <path className="varianceBaseline" d="M2.8 27.3h26.4" />
    <circle className="productSignal" cx="16" cy="4.1" r="1.75" />
  </svg>
);

// Six connected sources validate against one central truth; the single event signals integrity.
const DataIntegrityMark = (props: MarkProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" data-product-mark="data-integrity-check" {...props}>
    <path className="integrityStructure" d="M14.1 4.2 7.2 8.2M17.9 4.2l6.9 4M5.1 11.2v9.6M7.2 23.8l6.9 4M17.9 27.8l6.9-4M26.9 11.2v3.1M26.9 17.7v3.1" />
    <path className="integrityValidation" d="M16 5.4v5.2M7.2 10.4l4.1 2.5M24.8 10.4l-4.1 2.5M7.2 21.6l4.1-2.5M24.8 21.6l-4.1-2.5M16 21.3v5.3" />

    <circle className="integrityNode" cx="16" cy="3.2" r="2.15" />
    <circle className="integrityNode" cx="5.1" cy="9.4" r="2.15" />
    <circle className="integrityNode" cx="26.9" cy="9.4" r="2.15" />
    <circle className="integrityNode" cx="5.1" cy="22.6" r="2.15" />
    <circle className="integrityNode" cx="26.9" cy="22.6" r="2.15" />
    <circle className="integrityNode" cx="16" cy="28.8" r="2.15" />

    <ellipse className="integrityTruth" cx="16" cy="13.2" rx="5.5" ry="2.15" />
    <path className="integrityTruth" d="M10.5 14.2v3.15c0 1.2 2.46 2.15 5.5 2.15s5.5-.95 5.5-2.15V14.2c-1.06.78-3.08 1.25-5.5 1.25s-4.44-.47-5.5-1.25Z" />
    <path className="integrityTruth" d="M10.5 18.3v2.75c0 1.2 2.46 2.15 5.5 2.15s5.5-.95 5.5-2.15V18.3c-1.06.78-3.08 1.25-5.5 1.25s-4.44-.47-5.5-1.25Z" />

    <circle className="productSignal" cx="26.9" cy="16" r="2.05" />
  </svg>
);
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
  integrity: DataIntegrityMark,
  scenarios: ScenarioMark,
} satisfies Record<string, MarkComponent>;

export type AgentMarkName = keyof typeof agentMarks;
