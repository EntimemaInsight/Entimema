import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import PlatformExperience from "./PlatformExperience";

export const metadata: Metadata = {
  title: "Entimema Finance Platform | Controlled Financial Intelligence",
  description:
    "Turn financial documents and data into validated, traceable and decision-ready outputs with the Entimema Finance Platform.",
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
