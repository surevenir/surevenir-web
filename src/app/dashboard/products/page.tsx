"use server";

import { getProducts } from "@/utils/productActions";
import DashboardProductView from "./DashboardProductView";
import { getMerchants } from "@/utils/merchantActions";
import { getCategories } from "@/utils/categoryActions";

export default async function DashboardProductPage() {
  const products = (await getProducts()) || [];
  const merchants = (await getMerchants()) || [];
  const categories = (await getCategories()) || [];

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
