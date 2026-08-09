import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import Navbar from "@/components/Navbar";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Поверителност | Entimema",
  description: "Информация за обработването на лични данни чрез уебсайта на Entimema.",
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <article className={styles.article}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>ПРАВНА ИНФОРМАЦИЯ</p>
          <h1>Поверителност</h1>
          <p className={styles.intro}>Тази страница описва как се обработват личните данни, предоставени чрез уебсайта на Entimema.</p>
        </header>

        <div className={styles.content}>
          <section aria-labelledby="controller-title">
            <h2 id="controller-title">Администратор на лични данни</h2>
            <p>Администратор на данните е организацията, която управлява Entimema и уебсайта entimema.net.</p>
            <p className={styles.pending}>Пълното наименование на юридическото лице, регистрационният номер и адресът на администратора предстои да бъдат потвърдени преди окончателното правно одобрение на тази информация.</p>
          </section>

          <section aria-labelledby="data-title">
            <h2 id="data-title">Какви данни обработваме</h2>
            <p>Чрез формите за контакт може да получим:</p>
            <ul>
              <li>име и служебен e-mail;</li>
              <li>компания и длъжност;</li>
              <li>тема, услуга или проект;</li>
              <li>съдържание и контекст на запитването;</li>
              <li>информация за предложено партньорство или запитване по текущ клиентски ангажимент.</li>
            </ul>
          </section>

          <section aria-labelledby="purpose-title">
            <h2 id="purpose-title">За какво използваме данните</h2>
            <p>Използваме предоставената информация, за да получим и разгледаме запитването, да отговорим, да оценим възможен проект или партньорство и, когато е приложимо, да комуникираме по активен клиентски ангажимент.</p>
          </section>

          <section aria-labelledby="basis-title">
            <h2 id="basis-title">Правно основание</h2>
            <p>Приложимото правно основание зависи от вида на запитването и отношенията с подателя. То следва да бъде потвърдено при окончателния правен преглед на тази информация.</p>
          </section>

          <section aria-labelledby="providers-title">
            <h2 id="providers-title">Получатели и доставчици</h2>
            <p>За работата на уебсайта и обработването на запитванията използваме:</p>
            <ul>
              <li><strong>Vercel</strong> — хостване и доставяне на уебсайта;</li>
              <li><strong>Resend</strong> — техническо предаване на съобщенията от формите;</li>
              <li><strong>Google Workspace</strong> — получаване и обработване на служебната кореспонденция.</li>
            </ul>
            <p>Тази страница не прави твърдения за договорни механизми или международни трансфери, които не са потвърдени в проекта.</p>
          </section>

          <section aria-labelledby="retention-title">
            <h2 id="retention-title">Срок на съхранение</h2>
            <p>Конкретен срок за съхранение не е установен в публикувана политика. Определянето му изисква бизнес и правно решение.</p>
          </section>

          <section aria-labelledby="rights-title">
            <h2 id="rights-title">Права на физическите лица</h2>
            <p>В зависимост от приложимите обстоятелства можете да поискате достъп, коригиране, изтриване или ограничаване на обработването, както и да възразите срещу обработването или да упражните право на преносимост. Можете също да подадете жалба до компетентния надзорен орган.</p>
          </section>

          <section aria-labelledby="contact-title">
            <h2 id="contact-title">Контакт</h2>
            <p>За въпроси относно личните данни пишете на <a href="mailto:office@entimema.net">office@entimema.net</a>.</p>
          </section>

          <section aria-labelledby="updates-title">
            <h2 id="updates-title">Актуализации</h2>
            <p>Тази информация може да бъде актуализирана при промени в начина на обработване на данни или в инфраструктурата на уебсайта.</p>
          </section>
        </div>
      </article>

      <footer className={styles.footer}>
        <div className={`site-container ${styles.footerInner}`}>
          <BrandLogo compact />
          <span className={styles.footerCopyright}>© 2026 Entimema</span>
          <Link className={styles.footerLink} href="/privacy" aria-current="page">Поверителност</Link>
        </div>
      </footer>
    </main>
  );
}
