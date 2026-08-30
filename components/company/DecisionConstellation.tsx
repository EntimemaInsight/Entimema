import type { CSSProperties } from "react";
import styles from "./company.module.css";

// Fixed evidence lanes converge at a review gate; the return arc retains provenance.
// Hollow satellites and broken edges denote unresolved input, not verified evidence.
const paths = [
  "M28 92H112L204 164H292", "M50 264H134L204 164", "M112 92L188 48H300L362 116",
  "M292 164L362 116H448L522 188H594", "M292 164L370 258H446L522 188",
  "M594 188H650", "M650 188V320H234L134 264", "M300 48L338 22",
  "M370 258L348 340", "M204 164L228 246",
];
const nodes = [[28,92],[50,264],[112,92],[134,264],[188,48],[204,164],[292,164],[300,48],[362,116],[370,258],[448,116],[446,258],[522,188],[594,188],[650,188]];
export default function DecisionConstellation({ variant }: { variant: "about" | "labs" | "founder" }) {
  return <svg className={styles.constellation} data-company-ornament={variant} viewBox="0 0 680 360" aria-hidden="true" focusable="false" fill="none">
    <g stroke="currentColor" strokeWidth="1.2">
      {paths.map((d, index) => <path key={d} d={d} pathLength="1" data-unresolved={index > 6 || undefined} style={{ "--edge-order": index } as CSSProperties} />)}
      <path className={styles.reviewGate} d="M574 167V155H614V167M574 209V221H614V209" />
      {nodes.map(([cx, cy], index) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index === 14 ? 7 : index === 5 || index === 8 ? 4 : 2.5} className={styles.verified} style={{ "--edge-order": index } as CSSProperties} />)}
      <g className={styles.unknown}><circle cx="338" cy="22" r="5" /><circle cx="348" cy="340" r="5" /><circle cx="228" cy="246" r="5" /></g>
      <circle cx="650" cy="188" r="13" />
    </g>
  </svg>;
}
