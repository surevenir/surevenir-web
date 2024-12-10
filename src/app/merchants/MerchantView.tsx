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
import { TypographyH4, TypographySmall } from "@/components/ui/typography";
import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Merchant } from "../types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface MerchantViewProps {
  merchants: Merchant[];
}

export default function MerchantView({
  merchants: initialMerchants,
}: MerchantViewProps) {
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants);
  const [filteredMerchants, setFilteredMerchants] =
    useState<Merchant[]>(merchants);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    let result = merchants.filter(
      (merchant) =>
        merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        merchant.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredMerchants(result);
  }, [searchQuery]);
  return (
    <>
      <div className="flex flex-wrap justify-between items-center pb-8">
        <TypographyH4>Merchant List</TypographyH4>
        <div className="flex justify-between items-center gap-4">
          <Input
            type="text"
            placeholder="Search for..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-fit"
          />
          <TypographySmall>
            Merchants found ({filteredMerchants.length} / {merchants.length})
          </TypographySmall>
        </div>
      </div>

      <div className="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredMerchants.map((merchant) => (
          <Card className="overflow-hidden" key={merchant.id}>
            {merchant.profile_image_url && (
              <img
                src={merchant.profile_image_url}
                alt="Gambar"
                className="w-full h-24 md:h-32 lg:h-48 object-cover"
              />
            )}
            {merchant.profile_image_url == null && (
              <Skeleton className="w-full h-48" />
            )}
            <CardHeader className="p-4">
              <div className="flex justify-between">
                <CardTitle>{merchant.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Star width={15} height={15} />{" "}
                  <TypographySmall>4.5</TypographySmall>
                </div>
              </div>
              <CardDescription className="line-clamp-4">
                {merchant.description}
              </CardDescription>
              <Link href={`/merchants/${merchant.slug}`}>
                <ShinyButton className="inline-block">See Details</ShinyButton>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}
