"use server";

import { cookies } from "next/headers";
import ProductView from "./ProductView";
import { getProducts } from "@/utils/productActions";

export default async function MarketPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const products = (await getProducts(token as string)) || [];

  return (
    <>
      <div className="px-4 md:px-8 lg:px-32 py-16 lg:py-32 w-full">
        <ProductView products={products} />
      </div>
    </>
  );
}
