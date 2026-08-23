import type { ComponentType, SVGProps } from "react";

type GlyphProps = SVGProps<SVGSVGElement>;
type GlyphComponent = ComponentType<GlyphProps>;

const GlyphFrame = ({ children, ...props }: GlyphProps) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" {...props}>{children}</svg>
);

// EDGL signature: a displaced terminal marks the consequential state or output.
export const ClosureGlyph = (props: GlyphProps) => <GlyphFrame {...props}><path d="M9 6H5v20h22V10h-4"/><path d="M9 10v12h14V10"/><path className="signal" d="m19 7 4 3-4 3"/></GlyphFrame>;
export const OrderingGlyph = (props: GlyphProps) => <GlyphFrame {...props}><path d="M6 8h8M6 16h12M6 24h16"/><circle cx="17" cy="8" r="1.5"/><circle cx="21" cy="16" r="1.5"/><circle className="signal fill" cx="25" cy="24" r="1.75"/></GlyphFrame>;
export const ExtractionGlyph = (props: GlyphProps) => <GlyphFrame {...props}><path d="M5 7h14v18H5zM9 11h6M9 16h6M9 21h6"/><path className="signal" d="M19 16h8m-3-3 3 3-3 3"/></GlyphFrame>;
export const NormalizationGlyph = (props: GlyphProps) => <GlyphFrame {...props}><path d="M5 8h9M5 16h13M5 24h17"/><path className="signal" d="M25 7v18M22 8h6M22 16h6M22 24h6"/></GlyphFrame>;
export const SynthesisGlyph = (props: GlyphProps) => <GlyphFrame {...props}><path d="M5 7h5l5 7M5 16h7M5 25h5l5-7M27 7h-5l-5 7M27 25h-5l-5-7"/><path className="signal" d="M13 14h6v4h-6z"/></GlyphFrame>;
export const CohortsGlyph = (props: GlyphProps) => <GlyphFrame {...props}><path d="M5 24 9 10h6l4 14M10 24l4-10h6l4 10M15 24l3-6h6l3 6"/><path className="signal" d="M5 24h23"/></GlyphFrame>;
export const ObservationGlyph = (props: GlyphProps) => <GlyphFrame {...props}><path d="M5 9h22M5 23h22M8 16h5m6 0h5"/><circle className="signal fill" cx="16" cy="16" r="2"/></GlyphFrame>;
export const StabilityGlyph = (props: GlyphProps) => <GlyphFrame {...props}><path d="M5 10c4 0 5 4 8 4s4-4 7-4 4 4 7 4M5 22c4 0 5-4 8-4s4 4 7 4 4-4 7-4"/><path className="signal" d="M5 16h22"/></GlyphFrame>;
export const StagesGlyph = (props: GlyphProps) => <GlyphFrame {...props}><path d="M5 9h6v14H5zM13 9h6v14h-6zM21 9h6v14h-6z"/><path className="signal" d="M8 6v3m8 0v14m8 0v3"/></GlyphFrame>;
export const DeviationGlyph = (props: GlyphProps) => <GlyphFrame {...props}><path d="M5 10h22M5 22h22M9 7v6M16 7v6M23 7v6M9 19v6M23 19v6"/><path className="signal" d="M16 17v10"/></GlyphFrame>;
export const ResidualGlyph = (props: GlyphProps) => <GlyphFrame {...props}><path d="M5 6h22v20H5zM9 10h14v12H9z"/><path className="signal" d="M13 14h6v4h-6"/></GlyphFrame>;
export const BranchingGlyph = (props: GlyphProps) => <GlyphFrame {...props}><path d="M5 16h8M13 16c3 0 3-7 7-7h7M13 16c3 0 3 7 7 7h7"/><path className="signal" d="M13 16h14"/><circle cx="13" cy="16" r="1.5"/></GlyphFrame>;

export const agentGlyphs = {
  closure: ClosureGlyph, ordering: OrderingGlyph, extraction: ExtractionGlyph,
  normalization: NormalizationGlyph, synthesis: SynthesisGlyph, cohorts: CohortsGlyph,
  observation: ObservationGlyph, stability: StabilityGlyph, stages: StagesGlyph,
  deviation: DeviationGlyph, residual: ResidualGlyph, branching: BranchingGlyph,
} satisfies Record<string, GlyphComponent>;

export type AgentGlyphName = keyof typeof agentGlyphs;
