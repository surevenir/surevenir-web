"use server";

import { cookies } from "next/headers";
import DashboardOrderView from "./DashboardOrderView";
import { getCheckout } from "@/utils/cartActions";
import { Checkout } from "@/app/types/types";

export default async function DashboardOrderPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const checkoutsData = (await getCheckout(token as string, true)) || [];

  const checkouts: Checkout[] = checkoutsData.sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <>
      <DashboardOrderView checkouts={checkouts} />
    </>
  );
}
