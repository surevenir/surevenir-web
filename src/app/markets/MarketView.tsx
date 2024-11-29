"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ShinyButton from "@/components/ui/shiny-button";
import { TypographySmall } from "@/components/ui/typography";
import { Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type Market = {
  id: number;
  name: string;
  slug: string;
  description: string;
  longitude: string;
  latitude: string;
};

interface MarketViewProps {
  markets: Market[];
}

export default function MarketView({
  markets: initialMarkets,
}: MarketViewProps) {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  return (
    <>
      <div className="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {markets.map((market) => (
          <Card
            className="shadow-none border-none overflow-hidden"
            key={market.id}
          >
            <img
              src="https://a0.muscache.com/im/ml/photo_enhancement/pictures/miso/Hosting-684606150983325694/original/b9c6d45b-d785-423a-8321-4ba632b7d36a.jpeg?im_w=720"
              alt="Gambar"
              className="rounded-xl"
            />
            <CardHeader className="p-4">
              <div className="flex justify-between">
                <CardTitle>{market.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Star width={15} height={15} />{" "}
                  <TypographySmall>4.5</TypographySmall>
                </div>
              </div>
              <CardDescription>{market.description}</CardDescription>
              <Link href={`/markets/${market.slug}`}>
                <ShinyButton className="inline-block">See Details</ShinyButton>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}
