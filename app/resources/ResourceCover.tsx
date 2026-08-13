import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { ResourceCover as ResourceCoverModel } from "./resource-data";
import styles from "./resources.module.css";

type ResourceCoverProps = { cover: ResourceCoverModel };

function Vintage() {
  return <>
    <g className={styles.vintageBands}>{[0, 1, 2, 3, 4].map((index) => <path key={index} style={{ "--i": index } as CSSProperties} d={`M-30 ${285 - index * 29} C110 ${250 - index * 18}, 158 ${302 - index * 29}, 286 ${210 - index * 21} S486 ${175 - index * 15}, 650 ${66 - index * 8}`} />)}</g>
    <circle className={styles.vintageSun} cx="478" cy="83" r="74" />
    <text x="42" y="63">COHORT / TIME</text><text className={styles.coverNumeral} x="38" y="124">08</text>
  </>;
}

function WorkingCapital() {
  return <>
    <g className={styles.liquidityRings}><circle cx="290" cy="150" r="111"/><circle cx="290" cy="150" r="73"/><circle cx="290" cy="150" r="34"/></g>
    <path className={styles.liquidityRibbon} d="M-20 181C80 45 197 54 289 151s212 107 335-18" />
    <path className={styles.liquidityRibbonAlt} d="M-35 236C101 130 187 257 290 150S489 39 639 98" />
    <g className={styles.liquidityDiscs}><circle cx="89" cy="92" r="12"/><circle cx="290" cy="150" r="19"/><circle cx="516" cy="204" r="10"/></g>
    <text x="432" y="65">LIQUIDITY / MOTION</text>
  </>;
}

function Forecast() {
  return <>
    <rect className={styles.forecastField} x="0" y="0" width="600" height="300" />
    <path className={styles.observedLine} d="M-20 235C45 205 87 224 137 184s89-19 140-61"/>
    <g className={styles.futureLines}><path d="M277 123C350 93 430 31 640 18"/><path d="M277 123C386 116 479 119 640 78"/><path d="M277 123C390 152 474 218 640 199"/><path d="M277 123C354 170 433 262 620 287"/></g>
    <circle className={styles.forecastPivot} cx="277" cy="123" r="10"/>
    <text x="37" y="61">OBSERVED</text><text x="438" y="266">POSSIBLE / 04</text>
  </>;
}

function Manufacturing() {
  return <>
    <g className={styles.materialSheets}><path d="M52 63h309l-66 46H-14z"/><path d="M84 121h354l-79 55H4z"/><path d="M131 190h411l-96 68H30z"/></g>
    <g className={styles.materialCuts}><path d="M361 63l77 58-79 55-64-67z"/><path d="M438 121l104 69-96 68-87-82z"/></g>
    <text x="47" y="278">MATERIAL / CONVERSION / VALUE</text><text className={styles.coverNumeral} x="469" y="92">03</text>
  </>;
}

function Erp() {
  const fragments = Array.from({ length: 34 }, (_, index) => ({ x: 32 + (index % 7) * 31, y: 43 + Math.floor(index / 7) * 49, size: 3 + (index % 4) * 2 }));
  return <>
    <g className={styles.dataFragments}>{fragments.map(({x,y,size}, index) => <rect key={index} x={x} y={y} width={size * 1.7} height={size} style={{ "--i": index } as CSSProperties}/>)}</g>
    <g className={styles.intelligenceField}>{Array.from({length: 6}, (_, row) => Array.from({length: 7}, (_, column) => <circle key={`${row}-${column}`} cx={352 + column * 34} cy={58 + row * 34} r={2 + ((row + column) % 3)} />))}</g>
    <path className={styles.dataVeil} d="M224 12C276 63 264 113 312 151s28 85 81 145"/>
    <text x="354" y="275">SIGNAL / STRUCTURE</text>
  </>;
}

const artwork: Record<Extract<ResourceCoverModel, { type: "custom-artwork" }>["variant"], ReactNode> = {
  "credit-vintage": <Vintage />, "working-capital": <WorkingCapital />, "operational-forecast": <Forecast />,
  "manufacturing-cost": <Manufacturing />, "erp-intelligence": <Erp />,
};

const variantClasses: Record<Extract<ResourceCoverModel, { type: "custom-artwork" }>["variant"], string> = {
  "credit-vintage": styles.coverCreditVintage, "working-capital": styles.coverWorkingCapital,
  "operational-forecast": styles.coverOperationalForecast, "manufacturing-cost": styles.coverManufacturingCost,
  "erp-intelligence": styles.coverErpIntelligence,
};

export default function ResourceCover({ cover }: ResourceCoverProps) {
  if (cover.type === "image" || cover.type === "photography") return (
    <div className={`${styles.resourceCover} ${styles.imageCover} ${cover.type === "photography" ? styles.photoCover : ""}`} data-motion={cover.motion ?? "none"}>
      <Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 800px) 100vw, 50vw" style={{ objectPosition: cover.focalPoint ?? "50% 50%" }} />
      <span className={styles.imageWash} aria-hidden="true" />
    </div>
  );

  return <div className={`${styles.resourceCover} ${variantClasses[cover.variant]}`} data-motion={cover.motion ?? "none"}>
    <svg className={styles.editorialCanvas} viewBox="0 0 600 300" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">{artwork[cover.variant]}</svg>
  </div>;
}
