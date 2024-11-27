"use server";

import { getCategories } from "@/utils/actions";
import DashboardProductCategoryView from "./DashboardProductCategoryView";

export default async function ProductPage() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500">
          Failed to load categories categories or no product categories
          available. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <DashboardProductCategoryView categories={categories} />
    </>
  );
}
