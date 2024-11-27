"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import NumberTicker from "@/components/ui/number-ticker";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import {
  UsersIcon,
  MapPinHouseIcon,
  HousePlugIcon,
  ShoppingBasketIcon,
} from "lucide-react";

type StatisticItem = {
  key: string;
  value: number;
};

type StatisticProps = {
  statistic: StatisticItem[];
};

const getIconByKey = (keyname: string) => {
  switch (keyname) {
    case "users":
      return UsersIcon;
    case "markets":
      return MapPinHouseIcon;
    case "merchants":
      return HousePlugIcon;
    case "products":
      return ShoppingBasketIcon;
    default:
      return UsersIcon;
  }
};

export default function DashboardStatisticView({ statistic }: StatisticProps) {
  const transformedStatistic = statistic.map((item) => {
    const [key, value] = Object.entries(item)[0];
    return { key, value } as StatisticItem;
  });

  return (
    <div className="gap-4 grid md:grid-cols-4 auto-rows-min">
      {transformedStatistic.map(({ key, value }, index) => {
        const Icon = getIconByKey(key);

        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <TypographyP>Total {key}</TypographyP>
                <Icon />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <TypographyH3>
                  {value && <NumberTicker value={value} />}
                </TypographyH3>
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
