"use server";

import { cookies } from "next/headers";
import { getProducts } from "@/utils/productActions";
import DashboardProductView from "./DashboardProductView";
import { getMerchants } from "@/utils/merchantActions";
import { getCategories } from "@/utils/categoryActions";

export default async function DashboardProductPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const products = (await getProducts(token as string)) || [];
  const merchants = (await getMerchants(token as string)) || [];
  const categories = (await getCategories(token as string)) || [];

  return (
    <>
      <DashboardProductView
        products={products}
        merchants={merchants}
        categories={categories}
      />
    </>
  );
}
