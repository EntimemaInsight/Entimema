import Image from "next/image";

export default function Home() {
  return (
    <main className="pixel-page" id="home">
      <div className="pixel-stage" aria-label="Entimema начална страница">
        <Image
          src="/home-reference.png"
          alt="Entimema — финансова архитектура, кредитен риск, финансова трансформация, данни, AI и CFO функция"
          width={1535}
          height={1024}
          priority
          className="pixel-reference"
          sizes="100vw"
        />

        <nav className="pixel-hotspots" aria-label="Основна навигация">
          <a className="hotspot hotspot-home" href="#home" aria-label="Начало" />
          <a className="hotspot hotspot-services" href="#services" aria-label="Услуги" />
          <a className="hotspot hotspot-about" href="#about" aria-label="За Entimema" />
          <a className="hotspot hotspot-analyses" href="#analyses" aria-label="Анализи" />
          <a className="hotspot hotspot-contact" href="#contact" aria-label="Контакти" />
          <a className="hotspot hotspot-top-analyses" href="#analyses" aria-label="Разгледайте анализите" />
        </nav>
      </div>
    </main>
  );
}
