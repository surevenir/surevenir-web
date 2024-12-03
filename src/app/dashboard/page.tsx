"use server";

import { cookies } from "next/headers";
import { getStatistic } from "@/utils/actions";
import StatisticView from "./DashboardStatisticView";
import { ProductChart } from "./DashboardProductChart";
import SalesView from "./DashboardSalesView";

/**
 * The dashboard page, which displays a variety of key statistics.
 *
 * The component fetches the user's token from the cookie store, and
 * uses this to fetch the statistic data from the server.
 *
 * The component will display a StatisticView component, which will
 * display the statistics in a table form.
 *
 * The component will also display a ProductChart component and a
 * SalesView component.
 */
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const statistic = (await getStatistic(token as string)) || [];

  return (
    <div className="flex flex-col flex-1 gap-4 p-8 pt-0">
      <StatisticView statistic={statistic} />
      <div className="flex gap-4">
        <ProductChart />
        <SalesView />
      </div>
    </div>
  );
}
