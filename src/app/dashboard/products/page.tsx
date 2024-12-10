"use server";

import { cookies } from "next/headers";
import { getProducts } from "@/utils/productActions";
import DashboardProductView from "./DashboardProductView";
import { getMerchants } from "@/utils/merchantActions";
import { getCategories } from "@/utils/categoryActions";
import { getUserById } from "@/utils/userActions";

export default async function DashboardProductPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const user = (await getUserById(token as string, token as string)) || {};
  const products =
    user.role == "ADMIN"
      ? (await getProducts(token as string)) || []
      : (await getProducts(token as string, true)) || [];
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
