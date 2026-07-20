import Link from "next/link";

export default function CaseCtaSection() {
  return (
    <section className="case-cta" aria-labelledby="case-cta-title">
      <div className="site-container case-cta__inner">
        <p className="case-cta__eyebrow">КОНТАКТ</p>
        <h2 id="case-cta-title">Имате конкретен финансов или рисков казус?</h2>
        <Link className="case-cta__link" href="/contact">
          Обсъдете казус <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
