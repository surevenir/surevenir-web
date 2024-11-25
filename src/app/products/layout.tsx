import { Metadata } from "next";
import ProductPage from "./page";

export const metadata: Metadata = {
  title: "Surevenir | Products",
};

export default function ProductLayout() {
  return (
    <>
      <ProductPage />
    </>
  );
}
