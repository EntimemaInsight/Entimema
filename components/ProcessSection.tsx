import DynamicArchitectureCanvas from "./DynamicArchitectureCanvas";
import { SectionHeader } from "./ui";

export default function ProcessSection() {
  return (
    <section className="process-section process-section--static" id="approach" aria-labelledby="process-title">
      <div className="site-container process-section__inner">
        <SectionHeader
          id="process-title"
          className="process-heading"
          subtitleClassName="process-quote"
          title={
            <>
              Всяко решение
              <br />
              <em>започва с разбиране.</em>
            </>
          }
          subtitle="Променя се контекстът, а не логиката."
        />

        <DynamicArchitectureCanvas />
      </div>
    </section>
  );
}
