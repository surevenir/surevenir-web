"use client";

import { Card } from "@/components/ui/card";
import {
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";
import Image from "next/image";

const recentSales = [
  {
    merchant: "Merchant 1",
    merchant_url:
      "https://tse2.mm.bing.net/th?id=OIP.HpdyCKUyDIUTw2RhjlVEGwHaHa&pid=Api&P=0&h=220",
    sales: 1234567,
  },
  {
    merchant: "Merchant 2",
    merchant_url:
      "https://tse2.mm.bing.net/th?id=OIP.HpdyCKUyDIUTw2RhjlVEGwHaHa&pid=Api&P=0&h=220",
    sales: 1234567,
  },
  {
    merchant: "Merchant 3",
    merchant_url:
      "https://tse2.mm.bing.net/th?id=OIP.HpdyCKUyDIUTw2RhjlVEGwHaHa&pid=Api&P=0&h=220",
    sales: 1234567,
  },
  {
    merchant: "Merchant 4",
    merchant_url:
      "https://tse2.mm.bing.net/th?id=OIP.HpdyCKUyDIUTw2RhjlVEGwHaHa&pid=Api&P=0&h=220",
    sales: 1234567,
  },
  {
    merchant: "Merchant 5",
    merchant_url:
      "https://tse2.mm.bing.net/th?id=OIP.HpdyCKUyDIUTw2RhjlVEGwHaHa&pid=Api&P=0&h=220",
    sales: 1234567,
  },
];

export default function SalesView() {
  return (
    <>
      <Card className="p-6 md:w-1/3">
        <TypographyP>Recent Sales</TypographyP>
        <TypographyMuted>
          All merchants made 265 sales this month.
        </TypographyMuted>
        <ul className="flex flex-col gap-6 mt-6">
          {recentSales.map((item, index) => (
            <li
              key={item.merchant}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={item.merchant_url}
                  alt={item.merchant}
                  width={35}
                  height={35}
                  className="rounded-full overflow-hidden"
                />
                <TypographySmall>{item.merchant}</TypographySmall>
              </div>
              <TypographySmall>{item.sales}</TypographySmall>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
