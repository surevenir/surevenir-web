"use client";

import { getDataBySlug } from "@/utils/actions";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  MarketWithMerchants,
  MediaType,
  Merchant,
  MerchantWithProducts,
} from "@/app/types/types";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH4, TypographySmall } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ShinyButton from "@/components/ui/shiny-button";
import { MerchantDynamicBreadcrumb } from "./MerchantDynamicBreadcrumb";

export default function MerchantDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [merchant, setMerchant] = useState<MerchantWithProducts | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [images, setImages] = useState<string[]>();
  const token = Cookies.get("userId");

  const fetchMerchant = async () => {
    try {
      setLoading(true);
      const merchant: any = await getDataBySlug(
        id,
        token as string,
        MediaType.MERCHANT
      );
      if (merchant) {
        setMerchant(merchant);
      }
    } catch (error) {
      console.error("Error fetching merchant:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = () => {};

  useEffect(() => {
    if (id && token) {
      fetchMerchant();
    }
  }, [id, token]);

  return (
    <div className="px-32 py-12 w-full">
      {loading && (
        <div className="gap-8 grid grid-cols-5">
          <div className="top-24 sticky col-span-2 h-fit">
            <Skeleton className="rounded-md w-full h-64" />

            <div className="justify-start items-center gap-4 grid grid-cols-3 mt-4">
              <Skeleton className="rounded-md w-full h-24" />
              <Skeleton className="rounded-md w-full h-24" />
              <Skeleton className="rounded-md w-full h-24" />
            </div>
          </div>
          <div className="col-span-3">
            <div className="grid grid-cols-3">
              <div className="col-span-2 pr-4">
                <Skeleton className="rounded-md w-32 h-8" />
                <Skeleton className="mt-4 rounded-md w-full h-6" />
                <Skeleton className="mt-2 rounded-md w-full h-6" />
                <Skeleton className="mt-2 rounded-md w-full h-6" />
                <Skeleton className="mt-2 rounded-md w-full h-6" />
                <Skeleton className="mt-2 rounded-md w-full h-6" />
                <Skeleton className="mt-2 rounded-md w-64 h-6" />
              </div>
              <div className="col-span-1">
                <Skeleton className="w-full h-40" />
              </div>
            </div>
          </div>
        </div>
      )}
      {!loading && merchant && (
        <div className="gap-6 grid grid-cols-5">
          <div className="top-24 sticky col-span-2 h-fit">
            <div className="pb-4">
              <MerchantDynamicBreadcrumb merchant={merchant as Merchant} />
            </div>
            {merchant.profile_image_url && (
              <img
                src={merchant.profile_image_url}
                alt={merchant.name}
                className="rounded-md w-full h-64 object-cover"
              />
            )}

            {!merchant.profile_image_url && (
              <>
                <Skeleton className="rounded-md w-full h-64" />
              </>
            )}

            <Dialog>
              <div className="justify-start items-center gap-4 grid grid-cols-3 mt-4">
                {merchant.images &&
                  merchant.images.map((image, index) => (
                    <DialogTrigger key={image.id}>
                      <img
                        src={image.url}
                        alt="Gambar Pasar"
                        className="rounded-md w-full overflow-hidden aspect-auto object-cover"
                      />
                    </DialogTrigger>
                  ))}
              </div>
              <DialogContent className="flex justify-center items-center">
                <DialogHeader className="flex flex-col justify-center">
                  <DialogTitle className="pb-4 text-center">
                    Merchant Images
                  </DialogTitle>
                  <Carousel className="justify-center w-full max-w-xs">
                    <CarouselContent>
                      {merchant?.images &&
                        merchant?.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <img
                                src={image.url}
                                alt="merchant Image"
                                className="w-full"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="col-span-3">
            <div className="gap-6 grid grid-cols-3">
              <div className="col-span-2">
                <div className="flex justify-between items-center pb-2">
                  <TypographyH4>{merchant.name}</TypographyH4>
                  <div className="flex items-center gap-2">
                    <Star width={15} height={15} />{" "}
                    <TypographySmall>4.5</TypographySmall>
                  </div>
                </div>
                <TypographySmall>{merchant.description}</TypographySmall>
              </div>
              <div className="col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Favorite <Heart className="w-4" />
                    </CardTitle>
                    <CardDescription>
                      Add to your favorite merchant
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button>Add to Favorite</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            {merchant.products != null && merchant.products.length > 0 && (
              <>
                <TypographyH4 className="pt-8 pb-4">
                  Products in {merchant.name}
                </TypographyH4>
                <div className="gap-4 grid grid-cols-3">
                  {merchant.products.map((product) => (
                    <Card className="overflow-hidden" key={product.id}>
                      {product.images != null && product.images.length > 0 && (
                        <img
                          src={product.images[0].url}
                          alt="Gambar"
                          className="w-full h-36 object-cover"
                        />
                      )}

                      {product.images && product.images.length == 0 && (
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
                          <ShinyButton className="inline-block">
                            See Details
                          </ShinyButton>
                        </Link>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}