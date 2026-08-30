// Extends ScrollExperience's one-shot observer pattern. No hidden/armed state:
// even interrupted hydration or a failed observer leaves every element readable.
const visited = new Set<string>();
const targetSelector = "h1,h2,h3,p,nav,ol > li,dl > div,figure,[data-founder-portrait],[data-company-cta],[data-company-ornament]";

export function observeCompanyMotion(root: HTMLElement, page: string) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches || !("IntersectionObserver" in window) || visited.has(page)) return;
  const targets = Array.from(root.querySelectorAll<HTMLElement>(targetSelector)).filter(node =>
    !node.closest("footer") && !node.parentElement?.closest(targetSelector),
  );
  const portrait = root.querySelector<HTMLElement>("[data-founder-portrait]");
  if (portrait) { targets.splice(targets.indexOf(portrait), 1); targets.unshift(portrait); }
  const entered = new Set<HTMLElement>();
  const observer = new IntersectionObserver(entries => {
    visited.add(page);
    let order = 0;
    // DOM order, not observer delivery order, defines the argument's cadence.
    const visible = new Set(entries.filter(entry => entry.isIntersecting).map(entry => entry.target));
    for (const target of targets) {
      if (!visible.has(target)) continue;
      observer.unobserve(target);
      entered.add(target);
      // Skip content above a restored scroll position. Never animate it on return.
      if (target.getBoundingClientRect().bottom < 0) continue;
      target.style.setProperty("--company-order", String(Math.min(order++, 4)));
      target.setAttribute("data-company-entered", "");
    }
  }, { threshold: 0, rootMargin: "0px 0px 96px 0px" });
  targets.forEach(target => observer.observe(target));
  const settle = () => {
    observer.disconnect();
    entered.forEach(target => { target.removeAttribute("data-company-entered"); target.style.removeProperty("--company-order"); });
  };
  const reduce = () => { if (preference.matches) settle(); };
  const restore = (event: PageTransitionEvent) => { if (event.persisted) settle(); };
  preference.addEventListener("change", reduce);
  window.addEventListener("pageshow", restore);
  return () => { settle(); preference.removeEventListener("change", reduce); window.removeEventListener("pageshow", restore); };
}
