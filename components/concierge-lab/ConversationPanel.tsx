import type { ConversationTurn } from "./types";
import styles from "./concierge-lab.module.css";

export default function ConversationPanel({ prompt, turns, live, value, busy, onValue, onSubmit }: { prompt: string; turns: ConversationTurn[]; live?: boolean; value?: string; busy?: boolean; onValue?: (value: string) => void; onSubmit?: () => void }) {
  const transcript = turns.length ? turns : prompt ? [{ role: "User" as const, text: prompt }, { role: "Entimema" as const, text: "The declared problem has been separated from the operational problem. Review the shared state and unresolved inputs." }] : [];
  return <aside className={styles.conversation} aria-labelledby="conversation-title">
    <div className={styles.panelHeading}><span>Capture</span><h2 id="conversation-title">Conversation</h2></div>
    <div className={styles.transcript}>{transcript.map((turn, index) => <div className={styles.turn} key={`${turn.role}-${index}`}><strong>{turn.role}</strong><p>{turn.text}</p></div>)}</div>
    <form className={styles.captureControls} onSubmit={(event) => { event.preventDefault(); onSubmit?.(); }}>
      <label className={styles.srOnly} htmlFor="lab-input">Ask Entimema</label><input id="lab-input" placeholder="Ask Entimema" value={live ? value : undefined} onChange={(event) => onValue?.(event.target.value)} disabled={busy || !live} />
      {live && <button className={styles.sendButton} type="submit" disabled={busy || !value?.trim()}>{busy ? "Updating…" : "Send"}</button>}
      <div><button disabled title="Preview only">+ Evidence <small>Excel · CSV · PDF</small></button><button disabled title="Voice is not implemented">Hold to Speak <small>Preview</small></button></div>
    </form>
  </aside>;
}
