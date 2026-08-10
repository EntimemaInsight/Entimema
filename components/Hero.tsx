import Link from "next/link";
import { SectionHeader } from "./ui";

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
              <span>See the decision</span>
              <span className="hero__accent">before you make it.</span>
            </>
          }
          subtitle={
            <>
              Model the numbers.<br />
              Measure the risk.<br />
              Understand the consequences.<br />
              Then decide.
            </>
          }
        >
          <Link className="primary-cta hero__cta" href="/contact">
            <span>Discuss Your Challenge</span><b aria-hidden="true">→</b>
          </Link>
        </SectionHeader>
      </div>
    </section>
  );
}
