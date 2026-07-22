import Link from "next/link";

export default function CaseCtaSection() {
  return (
    <section className="case-cta" aria-labelledby="case-cta-title">
      <div className="site-container case-cta__inner">
        <h2 id="case-cta-title">Следващото по-добро решение започва с един разговор.</h2>
        <Link className="primary-cta primary-cta--light case-cta__link" href="/contact">
          <span>Обсъдете вашия казус</span><b aria-hidden="true">→</b>
        </Link>
      </div>
    </section>
  );
}
