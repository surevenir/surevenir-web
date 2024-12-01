"use server";

import { getCategories } from "@/utils/categoryActions";
import DashboardProductCategoryView from "./DashboardProductCategoryView";

export default async function ProductPage() {
  const categories = (await getCategories()) || [];

  return (
    <>
      <DashboardProductCategoryView categories={categories} />
    </>
  );
}
