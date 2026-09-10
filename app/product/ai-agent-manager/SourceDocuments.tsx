import { agentMarks, type AgentMarkName } from "@/app/agents/AgentMarks";
import marks from "@/app/agents/agent-library.module.css";
import styles from "./source-documents.module.css";

const documents = {
  analysis: {
    mark: "extraction", label: "Extracting financial data…", format: "XLSX", title: "INCOME STATEMENT", subtitle: "For the year ended 31 December 2025", ref: "FIN / FY2025 / 01",
    rows: [["Revenue", "12,480,000"], ["Cost of sales", "(7,488,000)"], ["Gross profit", "4,992,000"], ["Selling & distribution", "(1,120,000)"], ["General & administrative", "(940,000)"], ["Other operating expenses", "(312,000)"], ["EBITDA", "2,620,000"], ["Depreciation & amortisation", "(420,000)"], ["Operating profit", "2,200,000"]],
    note: "Basis of preparation", text: "Presented in euro. Expenses are shown in parentheses. Comparative figures are presented in the accompanying financial statements.",
  },
  controls: {
    mark: "integrity", label: "Reconciling source values…", format: "XLSX", title: "COST OF SALES SCHEDULE", subtitle: "Reporting period: 1 January – 31 December 2025", ref: "FIN / COS / 04",
    rows: [["Direct materials", "4,920,000"], ["Production labour", "1,440,000"], ["Energy & utilities", "612,000"], ["Factory overhead", "516,000"], ["Total cost of sales", "7,488,000"], ["Revenue per statement", "12,480,000"], ["Gross profit", "4,992,000"]],
    note: "Supporting schedule", text: "The schedule supports the cost of sales line in the annual income statement. Amounts are stated in EUR for the reporting period shown above.",
  },
  review: {
    mark: "closure", label: "Reviewing source context…", format: "PDF", title: "NOTES TO THE ACCOUNTS", subtitle: "Year ended 31 December 2025", ref: "FIN / NOTES / 07",
    rows: [["Other operating expenses", "312,000"], ["Prior reporting period", "270,000"], ["Year-on-year movement", "42,000"]],
    note: "7. Other operating expenses", text: "Other operating expenses of EUR 312,000 are recorded in the income statement. A detailed breakdown is not included in this source document. Classification requires supporting information.",
  },
} satisfies Record<string, { mark: AgentMarkName; label: string; format: string; title: string; subtitle: string; ref: string; rows: string[][]; note: string; text: string }>;

export default function SourceDocuments({ kind }: { kind: keyof typeof documents }) {
  const document = documents[kind];
  const Mark = agentMarks[document.mark];
  return <div className={styles.scene}>
    <div className={styles.processingLabel}>
      <span className={`${marks.markField} ${styles.agentIcon}`}><Mark className={marks.mark}/></span>
      <span>{document.label}</span>
      <span className={`${styles.fileType} ${document.format === "PDF" ? styles.pdf : styles.xlsx}`}>{document.format}</span>
    </div>
    <div className={styles.connector} aria-hidden="true"/>
    <div className={styles.stack}>
      <div className={styles.backSheet} aria-hidden="true"/>
      <div className={styles.paper}>
        <div className={styles.letterhead}><b>NORTHLINE INDUSTRIES</b><span>FINANCE DEPARTMENT</span></div>
        <div className={styles.documentTitle}>{document.title}</div>
        <p className={styles.subtitle}>{document.subtitle}</p>
        <div className={styles.reference}><span>{document.ref}</span><span>EUR</span></div>
        <table><thead><tr><th>Description</th><th>FY2025</th></tr></thead><tbody>
          {document.rows.map(([label, value]) => <tr key={label}><td>{label}</td><td>{value}</td></tr>)}
        </tbody></table>
        <div className={styles.note}><b>{document.note}</b><p>{document.text}</p></div>
        <div className={styles.documentFooter}><span>Fictional company · Sample document</span><span>1 / 1</span></div>
      </div>
    </div>
  </div>;
}
