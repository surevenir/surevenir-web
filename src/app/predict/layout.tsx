import { Metadata } from "next";
import NavigationBar from "@/components/navigation-bar";
import Footer from "@/components/footer";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Surevenir | Predict",
};

export default function PredictLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavigationBar />
      {children}
      <Footer />
    </>
  );
}
