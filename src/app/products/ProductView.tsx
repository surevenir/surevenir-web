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
import { Product } from "../types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

interface ProductViewProps {
  products: Product[];
}

export default function ProductView({
  products: initialProducts,
}: ProductViewProps) {
  const searchParams = useSearchParams();

  // Ambil nilai parameter "query"
  const query = searchParams.get("query");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    let result = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProducts(result);
  }, [searchQuery]);
  return (
    <>
      <div className="flex flex-wrap justify-between items-center pb-8">
        <TypographyH4>Product List</TypographyH4>
        <div className="flex justify-between items-center gap-4">
          <Input
            type="text"
            placeholder="Search for..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-fit"
          />
          <TypographySmall>
            Products found ({filteredProducts.length} / {products.length})
          </TypographySmall>
        </div>
      </div>

      <div className="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {filteredProducts.map((product) => (
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

              <Link href={`/products/${product.slug}`}>
                <ShinyButton className="w-full">See Details</ShinyButton>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}
