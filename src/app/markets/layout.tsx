import { Metadata } from "next";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Surevenir | Markets",
};

export default function MarketLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavigationBar />
      {children}
      <Footer />
    </>
  );
}
