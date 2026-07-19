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
  const common = { viewBox: "0 0 24 24", "aria-hidden": true, focusable: false } as const;
  const icons: Record<string, React.ReactNode> = {
    report: <svg {...common}><rect x="5" y="4" width="14" height="16" rx="2.2"/><path d="M8 8.25h8M8 12h5.5M8 15.75h7"/></svg>,
    trend: <svg {...common}><path d="M4.5 17.5 9.3 12.7l3.2 2.8 6.7-8"/><path d="M15.5 7.5h3.7v3.7"/></svg>,
    forecast: <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M12 7.5v4.9l3.2 2"/></svg>,
    target: <svg {...common}><circle cx="11.5" cy="12.5" r="7.5"/><circle cx="11.5" cy="12.5" r="3"/><path d="m14 10 5.5-5.5M16.8 4.5h2.7v2.7"/></svg>,
    cashflow: <svg {...common}><path d="M4.5 8h11.2M12.8 4.8 16 8l-3.2 3.2M19.5 16H8.3M11.2 12.8 8 16l3.2 3.2"/></svg>,
    control: <svg {...common}><path d="M12 3.5 5.5 6.2v4.9c0 4.7 2.7 7.8 6.5 9.4 3.8-1.6 6.5-4.7 6.5-9.4V6.2L12 3.5Z"/><path d="m9.1 12 1.9 1.9 4-4"/></svg>,
    cost: <svg {...common}><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 8h6M9 12h6M9 16h3.5"/></svg>,
    cfo: <svg {...common}><circle cx="12" cy="8" r="3"/><path d="M5.5 20c.8-4.6 3.4-7 6.5-7s5.7 2.4 6.5 7"/></svg>,
    score: <svg {...common}><path d="M5 19V6.5h14V19"/><path d="M8.5 16v-3M12 16V9M15.5 16v-5"/></svg>,
    ai: <svg {...common}><rect x="6.2" y="6.2" width="11.6" height="11.6" rx="3"/><path d="M9 3.5v2.7M15 3.5v2.7M9 17.8v2.7M15 17.8v2.7M3.5 9h2.7M17.8 9h2.7M3.5 15h2.7M17.8 15h2.7"/><path d="M9.5 12h5"/></svg>,
    behavior: <svg {...common}><path d="M4.5 15.3c2.8-6.3 7.1-8.8 14.9-6.2"/><path d="M5 15.2c3.7 1.8 7.7 2.1 11.5.5"/><circle cx="17.2" cy="9.4" r="1.7"/></svg>,
    monitor: <svg {...common}><path d="M5.2 17.2A8 8 0 1 1 7 19"/><path d="M5 13.8v3.7h3.7"/><path d="M9 12h6M12 9v6"/></svg>,
    model: <svg {...common}><circle cx="6" cy="6" r="1.8"/><circle cx="18" cy="6" r="1.8"/><circle cx="12" cy="18" r="1.8"/><path d="m7.7 7.1 3.2 8.8M16.3 7.1l-3.2 8.8M7.8 6h8.4"/></svg>,
    stress: <svg {...common}><path d="M4.5 18h15"/><path d="m6 14.5 4-4 3 2.3 5-6"/><path d="M15.8 6.8h2.5v2.5"/></svg>,
    ifrs: <svg {...common}><path d="M6 3.5h8.5L18 7v13.5H6Z"/><path d="M14.5 3.5V7H18M9 11h6M9 15h6"/></svg>,
    scenario: <svg {...common}><path d="M12 5.5v4M12 9.5l-4.8 4M12 9.5l4.8 4"/><circle cx="12" cy="4" r="1.6"/><circle cx="7" cy="15.5" r="1.6"/><circle cx="17" cy="15.5" r="1.6"/></svg>,
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
  const nodes = [
    [42,96,4],[66,58,4],[72,130,3.5],[102,82,3],[118,42,4],[132,108,5.5],
    [154,68,3.5],[172,124,4],[194,50,4],[214,91,4.5],[222,132,3.5],[96,140,3],
    [150,148,3],[194,145,3.5],[145,24,3.5],[225,64,3]
  ];
  const links = [[0,1],[0,3],[0,11],[1,3],[1,4],[2,3],[2,11],[3,4],[3,5],[3,11],[4,5],[4,6],[4,14],[5,6],[5,7],[5,11],[5,12],[6,8],[6,9],[6,12],[7,9],[7,12],[7,13],[8,9],[8,15],[9,10],[9,13],[9,15],[10,13],[11,12],[12,13]];
  return <svg className="approach-card__graphic approach-card__graphic--risk" viewBox="0 0 260 190" aria-hidden="true">
    <defs>
      <radialGradient id="riskHalo"><stop stopColor="#ff5a1f" stopOpacity=".16"/><stop offset="1" stopColor="#ff5a1f" stopOpacity="0"/></radialGradient>
    </defs>
    <circle cx="132" cy="96" r="62" fill="url(#riskHalo)"/>
    <g stroke="#ff5a1f" strokeOpacity=".24" strokeWidth="1.15">
      {links.map(([a,b],i)=><line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}/>)}
    </g>
    <g fill="#ff4d0a">{nodes.map((n,i)=><circle key={i} cx={n[0]} cy={n[1]} r={n[2]}/>)}</g>
    <circle cx="132" cy="108" r="11" fill="#ff4d0a" opacity=".12"/>
    <circle cx="132" cy="108" r="5.5" fill="#ff4d0a"/>
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
      <div className="approach-section__intro reveal reveal--1"><h2>Финанси и риск,<br/><em>мислени като една система.</em></h2></div>
      <p className="approach-section__lead reveal reveal--2">Използваме единна методология за изграждане на финансови системи, модели за кредитен риск и AI решения. Независимо от приложението, принципите остават едни и същи.</p>
      <div className="approach-section__cards reveal reveal--3">
        <ServiceCard tone="blue" title="Финансова архитектура" description="Проектираме финансови системи, които превръщат данните в ясни управленски решения. От финансовото моделиране до функцията на финансовия директор изграждаме архитектура, която остава устойчива с развитието на бизнеса." items={financeItems} graphic={<FinanceGraphic/>}/>
        <ServiceCard tone="orange" title="Кредитен риск" description="Разработваме интелигентни системи за оценка, мониторинг и автоматизация на кредитния риск. От скоринг модели до AI системи за вземане на решения." items={riskItems} graphic={<RiskGraphic/>}/>
      </div>
    </div>
  </section>
}
