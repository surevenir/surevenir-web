"use server";

import { cookies } from "next/headers";
import { TypographyH4 } from "@/components/ui/typography";
import ProductView from "./ProductView";
import { getProducts } from "@/utils/productActions";

export default async function MarketPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const products = (await getProducts(token as string)) || [];

  return (
    <>
      <div className="px-4 md:px-8 lg:px-32 py-16 w-full">
        <TypographyH4 className="pb-8">Product List</TypographyH4>
        <ProductView products={products} />
      </div>
    </>
  );
}
