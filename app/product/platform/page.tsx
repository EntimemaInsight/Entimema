import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PlatformExperience from "./PlatformExperience";

export const metadata: Metadata = {
  title: "Controlled Financial Intelligence Platform | Entimema",
  description:
    "One controlled architecture connecting financial evidence, canonical context, deterministic validation, human review and decision-ready workflows.",
  alternates: { canonical: "https://www.entimema.com/product/platform" },
};

export default function PlatformPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar active="product" />
      <PlatformExperience />
    </main>
  );
}
