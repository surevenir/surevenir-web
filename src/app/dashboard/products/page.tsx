"use server";

import { getProducts } from "@/utils/actions";
import ProductView from "./DashboardProductView";

export default async function DashboardProductPage() {
  const products = await getProducts();

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500">
          Failed to load products or no products available. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <>
      <ProductView products={products} />
    </>
  );
}
