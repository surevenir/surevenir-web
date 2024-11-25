"use server";

import { getStatistic } from "@/utils/actions";
import StatisticView from "./StatisticView";
import { ProductChart } from "./ProductChart";
import { Card } from "@/components/ui/card";
import SalesView from "./SalesView";

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
