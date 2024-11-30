"use server";

import { getMerchants } from "@/utils/actions";

export default async function DashboardMerchantsPage() {
  const merchants = (await getMerchants()) || [];

  return (
    <>
      <h1>hello</h1>
    </>
  );
}
