export const companyDestinations = [
  { title: "About Entimema", description: "Our purpose, approach and decision philosophy.", href: "/about" },
  { title: "Founder", description: "Meet Alexander Dimitrov.", href: "/alexander-dimitrov" },
  { title: "Entimema Labs", description: "Research transformed into decision infrastructure.", href: "/labs" },
] as const;

export function isCompanyRoute(pathname: string) {
  return companyDestinations.some(({ href }) => pathname === href || pathname === `${href}/`);
}
