export const companyDestinations = [
  { title: "About Entimema", description: "Financial expertise, decision science and controlled AI.", href: "/about" },
  { title: "Founder", description: "Meet Alexander Dimitrov, founder of Entimema.", href: "/alexander-dimitrov" },
  { title: "Entimema Labs", description: "Emerging methods for financial intelligence and decision systems.", href: "/labs" },
] as const;

export function isCompanyRoute(pathname: string) {
  return companyDestinations.some(({ href }) => pathname === href || pathname === `${href}/`);
}
