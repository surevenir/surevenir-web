"use server";

import { getStatistic } from "@/utils/actions";
import StatisticView from "./DashboardStatisticView";
import { ProductChart } from "./DashboardProductChart";
import SalesView from "./DashboardSalesView";

export default async function DashboardPage() {
  const statistic = (await getStatistic()) || []; // Gunakan array kosong jika null

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
