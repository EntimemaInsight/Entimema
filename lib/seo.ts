import type { Metadata } from "next";

type ServiceMetadata = {
  title: string;
  description: string;
  path: `/services/${string}`;
};

/** Keep a service page's search, canonical and social metadata in one source of truth. */
export function createServiceMetadata({ title, description, path }: ServiceMetadata): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
