import Navbar from "@/components/Navbar";
import BrandLogo from "@/components/BrandLogo";

export default function ContactPage() {
  return <main className="contact-page"><Navbar active="contact" /><section className="contact-hero"><div className="site-container"><p className="section-eyebrow">Контакт</p><h1>Нека започнем с<br/><em>реалния бизнес казус.</em></h1><p>Опишете накратко контекста, целта и основното ограничение. Ще се свържем с предложение за следваща стъпка.</p><a className="button button--primary" href="mailto:office@entimema.net">office@entimema.net <span>↗</span></a></div></section><footer className="contact-footer"><div className="site-container"><BrandLogo compact /><span>© 2026 Entimema</span></div></footer></main>;
}
