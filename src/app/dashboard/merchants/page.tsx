"use server";

import { getMerchants } from "@/utils/actions";
// import MerchantView from "./MerchantView";

export default async function ProductPage() {
  const merchants = await getMerchants();

  if (!merchants || merchants.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500">
          Failed to load merchants or no merchants available. Please try again
          later.
        </p>
      </div>
    );
  }

  return <>{/* <MerchantView merchants={merchants} /> */}</>;
}
