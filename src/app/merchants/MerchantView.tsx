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
import { useState } from "react";
import { Merchant } from "../types/types";
import { Skeleton } from "@/components/ui/skeleton";

interface MerchantViewProps {
  merchants: Merchant[];
}

export default function MerchantView({
  merchants: initialMerchants,
}: MerchantViewProps) {
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants);
  return (
    <>
      <div className="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {merchants.map((market) => (
          <Card className="overflow-hidden" key={market.id}>
            {market.profile_image_url && (
              <img
                src={market.profile_image_url}
                alt="Gambar"
                className="w-full h-48 object-cover"
              />
            )}
            {market.profile_image_url == null && (
              <Skeleton className="w-full h-48" />
            )}
            <CardHeader className="p-4">
              <div className="flex justify-between">
                <CardTitle>{market.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Star width={15} height={15} />{" "}
                  <TypographySmall>4.5</TypographySmall>
                </div>
              </div>
              <CardDescription className="line-clamp-4">
                {market.description}
              </CardDescription>
              <Link href={`/merchants/${market.slug}`}>
                <ShinyButton className="inline-block">See Details</ShinyButton>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}
