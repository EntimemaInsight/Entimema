"use client";

import { useEffect, useRef } from "react";

const financeItems = [
  ["▥", "Мениджърска отчетност"], ["↗", "Финансово моделиране"],
  ["◔", "Бюджетиране и прогнозиране"], ["◎", "Управление чрез показатели (KPI)"],
  ["⌁", "Парични потоци и ликвидност"], ["♢", "Финансов контрол"],
  ["▦", "Управление на разходите"], ["♙", "Външен финансов директор"],
];

const riskItems = [
  ["♙", "Апликационен скоринг"], ["⚙", "AI системи за вземане на решения"],
  ["⌁", "Поведенчески скоринг"], ["↻", "Мониторинг на кредитни портфейли"],
  ["▥", "PD / LGD / EAD модели"], ["◉", "Стрес тестове"],
  ["▤", "IFRS 9 модели"], ["⌘", "Сценариен анализ"],
];

function FinanceGraphic() {
  return <svg className="approach-card__graphic" viewBox="0 0 260 190" aria-hidden="true">
    <defs><linearGradient id="bar" x1="0" x2="1"><stop stopColor="#dce9ff"/><stop offset="1" stopColor="#2857c7"/></linearGradient></defs>
    <g opacity=".35" stroke="#83a9ed"><path d="M18 155H240M35 28V168M82 28V168M129 28V168M176 28V168M223 28V168"/><path d="M22 145 238 84M22 112 238 51"/></g>
    <g fill="url(#bar)"><rect x="46" y="126" width="27" height="34" rx="2"/><rect x="87" y="104" width="27" height="56" rx="2"/><rect x="128" y="82" width="27" height="78" rx="2"/><rect x="169" y="44" width="27" height="116" rx="2"/></g>
    <polyline points="32,119 66,81 100,90 134,60 170,68 202,36 232,48" fill="none" stroke="#073aa7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <g fill="#073aa7"><circle cx="32" cy="119" r="6"/><circle cx="66" cy="81" r="6"/><circle cx="100" cy="90" r="6"/><circle cx="134" cy="60" r="6"/><circle cx="170" cy="68" r="6"/><circle cx="202" cy="36" r="6"/></g>
  </svg>
}

function RiskGraphic() {
  const nodes = [[34,105],[55,55],[76,128],[94,80],[116,40],[130,112],[150,72],[172,118],[191,48],[211,92],[225,132],[70,88],[110,145],[152,148],[196,146],[138,22],[232,62]];
  return <svg className="approach-card__graphic approach-card__graphic--risk" viewBox="0 0 260 190" aria-hidden="true">
    <g stroke="#ff5a1f" strokeOpacity=".28" strokeWidth="1.2">{nodes.map((a,i)=>nodes.slice(i+1).map((b,j)=><line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}/>))}</g>
    <g fill="#ff4d0a">{nodes.map((n,i)=><circle key={i} cx={n[0]} cy={n[1]} r={i%4===0?5:3}/>)}</g>
    <circle cx="138" cy="96" r="12" fill="#ff4d0a" opacity=".18"/><circle cx="138" cy="96" r="6" fill="#ff4d0a"/>
  </svg>
}

function ServiceCard({tone,title,description,items,graphic}:{tone:"blue"|"orange";title:string;description:string;items:string[][];graphic:React.ReactNode}) {
  return <article className={`approach-card approach-card--${tone}`}>
    <div className="approach-card__top">
      <div className="approach-card__copy">
        <div className="approach-card__icon" aria-hidden="true">{tone === "blue" ? "▰" : "♢"}</div>
        <h3>{title}</h3><p>{description}</p>
      </div>{graphic}
    </div>
    <div className="approach-card__items">{items.map(([icon,label])=><div className="approach-card__item" key={label}><span>{icon}</span><b>{label}</b></div>)}</div>
    <a className="approach-card__button" href={tone === "blue" ? "#financial-architecture" : "#credit-risk"}>{tone === "blue" ? "Разгледайте финансовата архитектура" : "Разгледайте решенията"}<span>→</span></a>
  </article>
}

export default function ApproachSection(){
  const ref = useRef<HTMLElement>(null);
  useEffect(()=>{const el=ref.current;if(!el)return;const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("is-visible");io.disconnect();}},{threshold:.18});io.observe(el);return()=>io.disconnect();},[]);
  return <section className="approach-section" id="about" ref={ref}>
    <div className="approach-dots" aria-hidden="true"/>
    <div className="site-container approach-section__inner">
      <div className="approach-section__intro reveal reveal--1"><div className="approach-kicker"><span>02</span><i/><b>ЕДИН ПОДХОД</b></div><h2>Финанси и риск,<br/><em>мислени като една система.</em></h2></div>
      <p className="approach-section__lead reveal reveal--2">Използваме единна методология за изграждане на финансови системи, модели за кредитен риск и AI решения. Независимо от приложението, принципите остават едни и същи.</p>
      <div className="approach-section__cards reveal reveal--3">
        <ServiceCard tone="blue" title="Финансова архитектура" description="Проектираме финансови системи, които превръщат данните в ясни управленски решения. От финансовото моделиране до функцията на финансовия директор изграждаме архитектура, която остава устойчива с развитието на бизнеса." items={financeItems} graphic={<FinanceGraphic/>}/>
        <ServiceCard tone="orange" title="Кредитен риск" description="Разработваме интелигентни системи за оценка, мониторинг и автоматизация на кредитния риск. От скоринг модели до AI системи за вземане на решения." items={riskItems} graphic={<RiskGraphic/>}/>
      </div>
      <a className="approach-next reveal reveal--4" href="#contact"><span>↓</span> Следващата секция</a>
    </div>
  </section>
}
