import type { CSSProperties } from "react";
import type { ResourceCover as ResourceCoverModel } from "./resource-data";
import styles from "./resources.module.css";

type ResourceCoverProps = { cover: ResourceCoverModel };

const nodes = (points: readonly [number, number][], className = "") => points.map(([cx, cy], index) => (
  <circle className={className} cx={cx} cy={cy} r={index % 3 === 0 ? 4 : 2.5} key={`${cx}-${cy}`} style={{ "--node-index": index } as CSSProperties} />
));

function Grid() {
  return <g className={styles.analysisGrid}><path d="M40 80H560M40 140H560M40 200H560M120 42V258M240 42V258M360 42V258M480 42V258" /></g>;
}

function Vintage() {
  const paths = [
    "M58 218 C122 214 132 184 198 178 S285 138 354 146 S453 102 538 94",
    "M58 232 C126 225 146 200 210 194 S302 157 366 164 S458 130 538 124",
    "M92 244 C150 235 167 217 228 211 S326 181 389 192 S478 166 538 158",
    "M142 252 C194 244 215 226 270 226 S364 211 424 218 S494 201 538 194",
  ];
  return <><Grid /><g className={styles.trajectories}>{paths.map((d, index) => <path d={d} key={d} style={{ "--path-index": index } as CSSProperties} />)}</g>{nodes([[58,218],[198,178],[354,146],[538,94],[58,232],[210,194],[366,164],[538,124],[92,244],[228,211],[389,192],[538,158]], styles.dataNode)}</>;
}

function WorkingCapital() {
  return <><g className={styles.orbits}><ellipse cx="300" cy="150" rx="202" ry="91" /><ellipse cx="300" cy="150" rx="143" ry="129" transform="rotate(23 300 150)" /><path d="M101 150C145 64 232 44 300 63C382 86 402 211 501 150" /></g><g className={styles.capitalNodes}>{nodes([[99,150],[199,64],[340,48],[493,132],[430,226],[260,246],[139,202]])}</g><g className={styles.core}><circle cx="300" cy="150" r="29" /><circle cx="300" cy="150" r="7" /></g></>;
}

function Forecast() {
  return <><Grid /><path className={styles.history} d="M42 207 C89 192 103 216 145 181 S202 191 245 143 S291 164 323 129" /><g className={styles.scenarios}><path d="M323 129 C374 105 405 70 558 52" /><path d="M323 129 C393 122 444 133 558 101" /><path d="M323 129 C387 155 467 176 558 211" /><path d="M323 129 C375 139 430 118 558 151" /></g>{nodes([[42,207],[104,203],[145,181],[201,180],[245,143],[288,153],[323,129]], styles.observationNode)}<circle className={styles.pivotNode} cx="323" cy="129" r="6" /></>;
}

function Manufacturing() {
  return <><g className={styles.inputStreams}><path d="M42 75 C150 75 175 120 256 137" /><path d="M42 135 C145 135 178 140 256 145" /><path d="M42 207 C149 207 176 169 256 153" /></g><g className={styles.materialNodes}>{nodes([[48,75],[82,75],[118,85],[48,135],[92,135],[138,137],[48,207],[86,207],[124,195]])}</g><g className={styles.transformCore}><path d="M258 105L335 105L369 150L335 195L258 195L224 150Z" /><path d="M265 150H328M296 119V181" /></g><g className={styles.outputFlow}><path d="M369 150C429 150 438 103 504 103" /><path d="M369 150C429 150 438 197 504 197" /><circle cx="520" cy="103" r="16" /><circle cx="520" cy="197" r="16" /></g></>;
}

function Erp() {
  const points: [number, number][] = [[48,62],[83,91],[52,126],[104,151],[58,194],[121,226],[157,76],[168,130],[176,199]];
  return <><g className={styles.transactionNodes}>{nodes(points)}</g><g className={styles.erpConnections}>{points.map(([x,y]) => <path d={`M${x + 5} ${y} C210 ${y} 195 150 260 150`} key={`${x}-${y}`} />)}<path d="M260 150H365" /><path d="M365 150C425 150 426 105 483 105M365 150C425 150 426 195 483 195" /></g><g className={styles.structure}><rect x="241" y="112" width="38" height="76" rx="19" /><rect x="346" y="124" width="38" height="52" rx="19" /></g><g className={styles.insight}><circle cx="505" cy="105" r="20"/><circle cx="505" cy="195" r="20"/><path d="M498 105L504 111L514 98M498 195L504 201L514 188" /></g></>;
}

const graphics = {
  "credit-vintage": <Vintage />,
  "working-capital": <WorkingCapital />,
  "operational-forecast": <Forecast />,
  "manufacturing-cost": <Manufacturing />,
  "erp-intelligence": <Erp />,
};

const variantClasses = {
  "credit-vintage": styles.coverCreditVintage,
  "working-capital": styles.coverWorkingCapital,
  "operational-forecast": styles.coverOperationalForecast,
  "manufacturing-cost": styles.coverManufacturingCost,
  "erp-intelligence": styles.coverErpIntelligence,
};

export default function ResourceCover({ cover }: ResourceCoverProps) {
  return (
    <div className={`${styles.resourceCover} ${variantClasses[cover.variant]}`} role="img" aria-label={cover.accessibleLabel}>
      <div className={styles.coverSignal} aria-hidden="true"><span /><i /><i /><i /></div>
      <svg className={styles.analyticalCanvas} viewBox="0 0 600 300" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        {graphics[cover.variant]}
      </svg>
    </div>
  );
}
