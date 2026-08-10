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
              Every better decision
              <br />
              <em>starts with understanding.</em>
            </>
          }
          subtitle={<>The context changes.<br />The logic shouldn&apos;t.</>}
        />

        <DynamicArchitectureCanvas />
      </div>
    </section>
  );
}
