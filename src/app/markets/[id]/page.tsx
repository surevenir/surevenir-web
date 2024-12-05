"use client";

import { getDataBySlug } from "@/utils/actions";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { Market, MediaType } from "@/app/types/types";
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
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketDynamicBreadcrumb } from "./MarketDynamicBreadcrumb";

export default function MarketDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [market, setMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [images, setImages] = useState<string[]>();
  const token = Cookies.get("userId");

  const fetchMarket = async () => {
    try {
      setLoading(true);
      const market: any = await getDataBySlug(
        id,
        token as string,
        MediaType.MARKET
      );
      if (market) {
        setMarket(market);
      }
    } catch (error) {
      console.error("Error fetching market:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = () => {};

  useEffect(() => {
    if (id && token) {
      fetchMarket();
    }
  }, [id, token]);

  return (
    <div className="px-32 py-12 w-full">
      <div className="pb-4">
        <MarketDynamicBreadcrumb market={market as Market} />
      </div>
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
      {!loading && market && (
        <div className="gap-8 grid grid-cols-5">
          <div className="top-24 sticky col-span-2 h-fit">
            {market.profile_image_url && (
              <img
                src={market.profile_image_url}
                alt={market.name}
                className="rounded-md w-full"
              />
            )}

            {!market.profile_image_url && (
              <>
                <Skeleton className="rounded-md w-full h-64" />
              </>
            )}

            <Dialog>
              <div className="justify-start items-center gap-4 grid grid-cols-3 mt-4">
                {market.images &&
                  market.images.map((image, index) => (
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
                    Market Images
                  </DialogTitle>
                  <Carousel className="justify-center w-full max-w-xs">
                    <CarouselContent>
                      {market?.images &&
                        market?.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <img
                                src={image.url}
                                alt="Market Image"
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
            <div className="grid grid-cols-3">
              <div className="col-span-2">
                <TypographyH4>{market.name}</TypographyH4>
                <TypographySmall>{market.description}</TypographySmall>
              </div>
              <div className="col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Favorite <Heart className="w-4" />
                    </CardTitle>
                    <CardDescription>
                      Add to your favorite market
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button>Add to Favorite</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* <div className="py-8">
              <TypographyH4>Reviews</TypographyH4>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
