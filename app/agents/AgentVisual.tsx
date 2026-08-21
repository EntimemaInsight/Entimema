import styles from "./agent-library.module.css";

type Props = { kind: string; label: string };

const forms: Record<string, React.ReactNode> = {
  completeness: <><path d="M25 21h31l10 9v42H25z"/><path d="M34 34h22M34 43h16M34 52h20"/><circle cx="62" cy="60" r="10"/><path className={styles.signal} d="m57 60 3 3 6-7"/></>,
  classification: <><path d="m22 31 17-10 15 9-17 10zM23 50l17-9 14 8-16 10zM54 34l16-9 12 7-16 9z"/><path className={styles.signal} d="M57 55h25v16H57z"/></>,
  extraction: <><path d="M20 24h34v46H20z"/><path d="M27 34h20M27 42h20M27 50h14M27 58h18"/><path className={styles.signal} d="M61 33h20v9H61zM61 48h20v9H61zM61 63h20v9H61z"/></>,
  spreading: <><path d="m21 35 38-15 22 12-39 16zM21 48l21 12 39-16M21 60l21 12 39-16"/><path className={styles.signal} d="M42 48v24"/></>,
  memo: <><path d="m19 35 22-13 18 10-22 13zM19 54l22-12 18 10-22 13zM58 39l21-12 5 3-21 13z"/><path className={styles.signal} d="m59 58 9-6 14 8-22 13-14-8z"/></>,
  vintage: <><path d="M20 67V34M34 67V29M48 67V36M62 67V42M76 67V51"/><path d="M16 67h65"/><path className={styles.signal} d="m20 34 14-5 14 7 14 6 14 9"/></>,
  portfolio: <><circle cx="50" cy="48" r="14"/><circle cx="50" cy="48" r="6"/><path d="M50 21v13M50 62v14M23 48h13M64 48h14M31 29l9 10M60 58l10 10M69 29 59 39M40 58 30 69"/><circle className={styles.signal} cx="72" cy="27" r="4"/></>,
  probability: <><path d="M17 68h67M24 68V29M25 63c12 0 13-31 29-31 13 0 13 27 27 27"/><path d="M54 32v36"/><path className={styles.signal} d="M66 38v30"/></>,
  ecl: <><path d="m18 54 31-28 32 28-32 19zM18 43l31-23 32 23M18 64l31 18 32-18"/><path className={styles.signal} d="m49 26 32 28-32 19z"/></>,
  variance: <><path d="M21 28h58M21 41h58M21 54h58M21 67h58"/><path d="M34 23v49M65 23v49"/><path className={styles.signal} d="M47 36h12v23H47z"/></>,
  margin: <><circle cx="50" cy="49" r="30"/><circle cx="50" cy="49" r="21"/><circle cx="50" cy="49" r="11"/><path className={styles.signal} d="M50 19a30 30 0 0 1 26 15L50 49z"/></>,
  scenario: <><path d="M23 70h55M34 70V42l16-13 16 13v28M50 29V18M50 42l-12 11M50 42l12 11"/><path className={styles.signal} d="m38 53-9 9M62 53l10 9M50 18l10 5M50 18l-10 5"/></>,
};

export default function AgentVisual({ kind, label }: Props) {
  return (
    <div className={styles.visual} aria-hidden="true">
      <svg viewBox="0 0 100 96" role="img" aria-label={label}>
        <defs><linearGradient id={`glass-${kind}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".9"/><stop offset="1" stopColor="#82b5ff" stopOpacity=".25"/></linearGradient></defs>
        <g className={styles.form} style={{ fill: `url(#glass-${kind})` }}>{forms[kind]}</g>
      </svg>
    </div>
  );
}
