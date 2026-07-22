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
              <span>Структурата превръща</span>
              <span className="hero__accent">стратегията в резултати.</span>
            </>
          }
          subtitle={
            <>
              Най-силните организации не управляват отделни функции. Те свързват финансите,
              риска, данните и технологиите в една последователна управленска архитектура.
            </>
          }
        >
          <Link className="primary-cta hero__cta" href="/contact">
            <span>Обсъдете вашия казус</span><b aria-hidden="true">→</b>
          </Link>
        </SectionHeader>
      </div>
    </section>
  );
}
