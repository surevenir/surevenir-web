import { Metadata } from "next";
import MarketPage from "./page";

export const metadata: Metadata = {
  title: "Surevenir | Markets",
};

export default function MarketLayout() {
  return (
    <>
      <MarketPage />
    </>
  );
}
