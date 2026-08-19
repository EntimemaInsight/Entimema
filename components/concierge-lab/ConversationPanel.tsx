import type { ConversationTurn } from "./types";
import styles from "./concierge-lab.module.css";

export default function ConversationPanel({ prompt, turns }: { prompt: string; turns: ConversationTurn[] }) {
  const transcript = turns.length ? turns : [{ role: "User" as const, text: prompt }, { role: "Entimema" as const, text: "The declared problem has been separated from the operational problem. Review the shared state and unresolved inputs." }];
  return <aside className={styles.conversation} aria-labelledby="conversation-title">
    <div className={styles.panelHeading}><span>Capture</span><h2 id="conversation-title">Conversation</h2></div>
    <div className={styles.transcript}>{transcript.map((turn, index) => <div className={styles.turn} key={`${turn.role}-${index}`}><strong>{turn.role}</strong><p>{turn.text}</p></div>)}</div>
    <div className={styles.captureControls}>
      <label className={styles.srOnly} htmlFor="lab-input">Ask Entimema</label><input id="lab-input" placeholder="Ask Entimema" />
      <div><button disabled title="Preview only">+ Evidence <small>Excel · CSV · PDF</small></button><button disabled title="Voice is not implemented">Hold to Speak <small>Preview</small></button></div>
    </div>
  </aside>;
}
