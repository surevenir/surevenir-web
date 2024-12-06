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
import { Market, Merchant, Product } from "../types/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductViewProps {
  products: Product[];
}

export default function ProductView({
  products: initialProducts,
}: ProductViewProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  return (
    <>
      <div className="gap-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <Card className="overflow-hidden" key={product.id}>
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0].url}
                alt="Gambar"
                className="w-full h-36 object-cover"
              />
            )}
            {product.images?.length == 0 && (
              <Skeleton className="w-full h-36" />
            )}
            <CardHeader className="p-4">
              <div className="flex justify-between">
                <CardTitle>{product.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Star width={15} height={15} />{" "}
                  <TypographySmall>4.5</TypographySmall>
                </div>
              </div>
              <CardDescription className="line-clamp-4">
                {product.description}
              </CardDescription>
              <CardDescription>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(product.price)}
              </CardDescription>

              <Link href={`/merchants/${product.slug}`}>
                <ShinyButton className="w-full">See Details</ShinyButton>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}
