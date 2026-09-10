import { SectionHeader } from "./ui";
import { PRIMARY_COMMERCIAL_CTA } from "@/lib/cta-labels";
import { DemoTrigger } from "./DemoDiscovery";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="site-container hero__layout hero__layout--editorial">
        <SectionHeader
          as="h1"
          variant="display"
          className="hero__copy hero__copy--editorial"
          titleClassName="hero__title hero__title--editorial"
          subtitleClassName="hero__description hero__description--editorial"
          title={
            <>
              <span>Turn financial data into</span>
              <span className="hero__accent">decisions you can defend.</span>
            </>
          }
          subtitle={
            <>
              Entimema combines specialized AI, deterministic controls and human review<br />
              to produce validated, traceable and decision-ready financial outputs.
            </>
          }
        >
          <DemoTrigger className="primary-cta hero__cta">
            <span>{PRIMARY_COMMERCIAL_CTA}</span>
          </DemoTrigger>
        </SectionHeader>
      </div>
    </section>
  );
}
