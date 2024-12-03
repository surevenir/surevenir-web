"use server";

import { cookies } from "next/headers";
import { getCategories } from "@/utils/categoryActions";
import DashboardProductCategoryView from "./DashboardProductCategoryView";

export default async function ProductPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const categories = (await getCategories(token as string)) || [];

  return (
    <>
      <DashboardProductCategoryView categories={categories} />
    </>
  );
}
