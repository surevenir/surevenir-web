"use server";

import { getCategories } from "@/utils/actions";
import DashboardProductCategoryView from "./DashboardProductCategoryView";

export default async function ProductPage() {
  const categories = await getCategories();

  return (
    <>
      {categories && <DashboardProductCategoryView categories={categories} />}
    </>
  );
}
