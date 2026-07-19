"use client";

import { useEffect, useRef } from "react";

const financeItems = [
  ["report", "Мениджърска отчетност"], ["trend", "Финансово моделиране"],
  ["forecast", "Бюджетиране и прогнозиране"], ["target", "Управление чрез показатели (KPI)"],
  ["cashflow", "Парични потоци и ликвидност"], ["control", "Финансов контрол"],
  ["cost", "Управление на разходите"], ["cfo", "Външен финансов директор"],
];

const riskItems = [
  ["score", "Апликационен скоринг"], ["ai", "AI системи за вземане на решения"],
  ["behavior", "Поведенчески скоринг"], ["monitor", "Мониторинг на кредитни портфейли"],
  ["model", "PD / LGD / EAD модели"], ["stress", "Стрес тестове"],
  ["ifrs", "IFRS 9 модели"], ["scenario", "Сценариен анализ"],
];


function PremiumIcon({ type }: { type: string }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true } as const;
  const icons: Record<string, React.ReactNode> = {
    report: <svg {...common}><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h5M8 16h7"/></svg>,
    trend: <svg {...common}><path d="M4 18 10 12l4 3 6-8"/><path d="M15 7h5v5"/></svg>,
    forecast: <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>,
    target: <svg {...common}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M15 9l5-5"/></svg>,
    cashflow: <svg {...common}><path d="M4 8h12M12 4l4 4-4 4M20 16H8M12 12l-4 4 4 4"/></svg>,
    control: <svg {...common}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z"/><path d="m9 12 2 2 4-4"/></svg>,
    cost: <svg {...common}><path d="M6 5h12v14H6z"/><path d="M9 9h6M9 13h6M9 17h3"/></svg>,
    cfo: <svg {...common}><circle cx="12" cy="8" r="3"/><path d="M5 20c1-5 4-7 7-7s6 2 7 7"/></svg>,
    score: <svg {...common}><path d="M4 20V6h16v14"/><path d="M8 16v-4M12 16V8M16 16v-7"/></svg>,
    ai: <svg {...common}><rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M18 9h4M2 15h4M18 15h4"/></svg>,
    behavior: <svg {...common}><path d="M4 15c3-7 7-10 16-6"/><path d="M4 15c4 2 8 3 12 1"/><circle cx="17" cy="9" r="2"/></svg>,
    monitor: <svg {...common}><path d="M4 12a8 8 0 1 1 2 5"/><path d="M4 16v-4h4"/><path d="M9 12h6M12 9v6"/></svg>,
    model: <svg {...common}><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m8 7 3 8M16 7l-3 8M8 6h8"/></svg>,
    stress: <svg {...common}><path d="M4 17h16"/><path d="M6 14l4-4 3 2 5-6"/><path d="M16 6h2v2"/></svg>,
    ifrs: <svg {...common}><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 11h6M9 15h6"/></svg>,
    scenario: <svg {...common}><path d="M12 4v5M12 9l-5 4M12 9l5 4"/><circle cx="12" cy="4" r="2"/><circle cx="7" cy="15" r="2"/><circle cx="17" cy="15" r="2"/></svg>,
  };
  return <span className="premium-icon">{icons[type]}</span>;
}

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
        <div className="approach-card__icon" aria-hidden="true">{tone === "blue" ? <PremiumIcon type="trend"/> : <PremiumIcon type="ai"/>}</div>
        <h3>{title}</h3><p>{description}</p>
      </div>{graphic}
    </div>
    <div className="approach-card__items">{items.map(([icon,label])=><div className="approach-card__item" key={label}><PremiumIcon type={icon}/><b>{label}</b></div>)}</div>
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
