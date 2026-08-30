import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { serializeJsonLd } from "@/lib/structured-data";
import { domains, process, principles, outputs, labsTitle, labsDescription, labsUrl, labsSchema } from "./labs-data";
import styles from "./labs.module.css";

export const metadata: Metadata = {
  title: { absolute: labsTitle }, description: labsDescription,
  alternates: { canonical: labsUrl },
  openGraph: { type: "website", title: labsTitle, description: labsDescription, url: labsUrl, siteName: "Entimema" },
  twitter: { card: "summary", title: labsTitle, description: labsDescription },
};

export default function LabsPage() {
  return <>
    <Navbar />
    <main className={styles.page}>
      <Container>
        <section className={styles.hero} aria-labelledby="labs-heading">
          <div>
            <p className={styles.label}>Entimema Labs</p>
            <h1 id="labs-heading">Where financial expertise becomes decision infrastructure.</h1>
            <p className={styles.intro}>Entimema Labs is the research and development environment behind our financial intelligence, credit-risk and decision-system work. It turns practitioner knowledge into methodologies, controlled workflows and traceable analytical products.</p>
          </div>
          <div className={styles.path} aria-hidden="true">
            <span className={styles.pathLabel}>Research → System</span>
            {["Evidence", "Methodology", "Controls", "Decision"].map((label, index) => <div className={styles.node} key={label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><i /></div>)}
            <span className={styles.pathEnd}>Human judgement</span>
          </div>
          <p className={styles.support}>Research is valuable when it can withstand scrutiny—and still work inside a real decision.</p>
        </section>
        <section className={`${styles.section} ${styles.split}`} aria-labelledby="role-heading">
          <div><p className={styles.label}>From knowledge to operation</p><h2 id="role-heading">A bridge between methodology and execution.</h2></div>
          <div className={styles.copy}><p>Financial and risk expertise often remains fragmented across policies, spreadsheets, models, systems and individual judgement. Entimema Labs examines how that knowledge can be formalised without stripping away context, uncertainty or professional control.</p><p>The result is not automation for its own sake. It is decision infrastructure in which evidence, assumptions, calculations, model interpretation and human judgement each have a clearly defined role.</p></div>
        </section>
        <section className={styles.domains} aria-label="Three research domains">
          {domains.map((domain, index) => <div className={styles.domain} key={domain.title}><span className={styles.index} aria-hidden="true">0{index + 1}</span><h2>{domain.title}</h2><p>{domain.description}</p><ul>{domain.points.map(point => <li key={point}>{point}</li>)}</ul></div>)}
        </section>
        <section className={styles.section} aria-labelledby="process-heading">
          <p className={styles.label}>How the Labs works</p><h2 id="process-heading">Research is developed as an evidence chain.</h2>
          <ol className={styles.process}>{process.map((step, index) => <li key={step.title}><span className={styles.stepNumber} aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
        </section>
        <section className={`${styles.section} ${styles.split}`} aria-labelledby="principles-heading">
          <div><p className={styles.label}>Research principles</p><h2 id="principles-heading">Intelligence must remain controlled.</h2></div>
          <div className={styles.principles}>{principles.map(principle => <div key={principle.title}><h3>{principle.title}</h3><p>{principle.description}</p></div>)}</div>
        </section>
        <section className={`${styles.section} ${styles.split}`} aria-labelledby="outputs-heading">
          <div><p className={styles.label}>What the Labs produces</p><h2 id="outputs-heading">Research designed to leave the page.</h2><p className={styles.outputIntro}>The work of Entimema Labs is intended to move from explanation to application.</p></div>
          <div><ul className={styles.outputs}>{outputs.map(output => <li key={output}>{output}</li>)}</ul><div className={styles.links}><Button href="/resources">Explore our research</Button><Button href="/about" variant="secondary">See how Entimema works</Button></div></div>
        </section>
      </Container>
      <section className={styles.closing} aria-labelledby="closing-heading"><Container><h2 id="closing-heading">Better decisions require more than better models.</h2><p>They require evidence that can be traced, logic that can be tested, uncertainty that can be governed and systems that preserve human accountability.</p><p className={styles.closingLine}>That is the work of Entimema Labs.</p></Container></section>
    </main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(labsSchema) }} />
  </>;
}
