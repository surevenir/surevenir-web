"use client";

import { getDataBySlug } from "@/utils/actions";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { Product, ProductDetail } from "@/app/types/types";
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
import {
  TypographyH4,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, HeartIcon, ShoppingCartIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDynamicBreadcrumb } from "./ProductDynamicBreadcrumb";
import {
  addProductToFavorite,
  deleteProductFromFavorite,
  getProductBySlug,
} from "@/utils/productActions";
import { HeartFilledIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { addProductToCart } from "@/utils/cartActions";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCategory, setLoadingCategory] = useState<boolean>(false);
  const [loadingCart, setLoadingCart] = useState<boolean>(false);
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [isFavorite, setisFavorite] = useState<boolean>(false);
  const token = Cookies.get("userId");

  const increment = () => {
    setAmount((prevAmount) => prevAmount + 1); // Gunakan prevAmount untuk memastikan perubahan yang benar
  };

  const decrement = () => {
    setAmount((prevAmount) => (prevAmount > 1 ? prevAmount - 1 : 1)); // Jangan biarkan amount turun di bawah 1
  };

  useEffect(() => {
    setSubTotal(price * amount);
  }, [amount, price]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product: any = await getProductBySlug(
        id,
        token as string,
        token as string
      );
      if (product) {
        setProduct(product);
        setPrice(product.price);
        setisFavorite(product.is_favorite);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async () => {
    setLoadingCategory(true);
    try {
      const result = await addProductToFavorite(
        product?.id as number,
        token as string
      );

      console.log("result :", result);

      if (result) {
        toast.success("Successfully add favorite");
        setisFavorite(true);
      } else {
        toast.error("Failed to add favorite");
      }
    } catch (error: any) {
      console.error("Error add favorite:", error.message);
      toast("An error occurred while adding category");
    } finally {
      setLoadingCategory(false);
    }
  };

  const handleAddProductToCart = async () => {
    setLoadingCart(true);
    try {
      const result = await addProductToCart(
        product?.id as number,
        amount,
        token as string
      );

      console.log("result :", result);

      if (result) {
        toast.success("Successfully add to cart");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error: any) {
      console.error("Error add to cart:", error.message);
      toast("An error occurred while adding to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  const handleDeleteFavorite = async () => {
    setLoadingCategory(true);
    try {
      const result = await deleteProductFromFavorite(
        product?.id as number,
        token as string
      );

      console.log("result :", result);

      if (result) {
        toast.success("Successfully delete favorite");
        setisFavorite(false);
      } else {
        toast.error("Failed to delete favorite");
      }
    } catch (error: any) {
      console.error("Error delete favorite:", error.message);
      toast("An error occurred while deleting the category");
    } finally {
      setLoadingCategory(false);
    }
  };

  useEffect(() => {
    if (id && token) {
      fetchProduct();
    }
  }, [id, token]);

  return (
    <>
      <div className="px-32 py-12 w-full">
        {!product && !loading && (
          <>
            <TypographyH4>Product not found</TypographyH4>
          </>
        )}
        {loading && (
          <div className="gap-8 grid grid-cols-7">
            <div className="top-24 sticky col-span-2 h-fit">
              <Skeleton className="rounded-md w-full h-64" />

              <div className="justify-start items-center gap-4 grid grid-cols-3 mt-4">
                <Skeleton className="rounded-md w-full h-24" />
                <Skeleton className="rounded-md w-full h-24" />
                <Skeleton className="rounded-md w-full h-24" />
              </div>
            </div>
            <div className="col-span-3">
              <Skeleton className="rounded-md w-32 h-8" />
              <Skeleton className="mt-4 rounded-md w-full h-6" />
              <Skeleton className="mt-2 rounded-md w-full h-6" />
              <Skeleton className="mt-2 rounded-md w-full h-6" />
              <Skeleton className="mt-2 rounded-md w-full h-6" />
              <Skeleton className="mt-2 rounded-md w-full h-6" />
              <Skeleton className="mt-2 rounded-md w-64 h-6" />
            </div>
            <div className="col-span-2">
              <Skeleton className="w-full h-40" />
            </div>
          </div>
        )}
        {!loading && product && (
          <div className="gap-6 grid grid-cols-7">
            <div className="top-24 sticky col-span-2 h-fit">
              <div className="pb-4">
                <ProductDynamicBreadcrumb product={product as Product} />
              </div>
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="rounded-md w-full h-64 object-cover"
                />
              )}

              {product.images?.length == 0 && (
                <>
                  <Skeleton className="rounded-md w-full h-64" />
                </>
              )}

              <Dialog>
                <div className="justify-start items-center gap-4 grid grid-cols-3 mt-4">
                  {product.images &&
                    product.images.map((image, index) => (
                      <DialogTrigger key={image.id}>
                        <img
                          src={image.url}
                          alt="Gambar product"
                          className="rounded-md w-full h-24 overflow-hidden aspect-auto object-cover"
                        />
                      </DialogTrigger>
                    ))}
                </div>
                <DialogContent className="flex justify-center items-center">
                  <DialogHeader className="flex flex-col justify-center">
                    <DialogTitle className="pb-4 text-center">
                      Product Images
                    </DialogTitle>
                    <Carousel className="justify-center w-full max-w-xs">
                      <CarouselContent>
                        {product?.images &&
                          product?.images.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="p-1">
                                <img
                                  src={image.url}
                                  alt="product Image"
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
              <div className="flex flex-col gap-4 pb-4">
                <TypographyH4 className="font-bold">
                  {product.name}
                </TypographyH4>
                <div className="flex items-center gap-2">
                  <Star width={15} height={15} />{" "}
                  <TypographySmall>4.5</TypographySmall>
                </div>
              </div>
              <TypographySmall>{product.description}</TypographySmall>
              {product.reviews != null && product.reviews.length > 0 && (
                <>
                  <TypographyH4 className="pt-8 pb-4">Reviews</TypographyH4>
                  <div className="gap-4 grid grid-cols-3">
                    {product.reviews.map((review) => (
                      <div className="">
                        <div className="">
                          <Star />
                          <Star />
                          <Star />
                          <Star />
                          <Star />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div>
                <TypographyH4 className="pt-8 pb-4">Reviews</TypographyH4>
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
              </div>
            </div>
            <div className="top-24 sticky col-span-2 h-fit">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Add to Cart <ShoppingCartIcon className="w-4" />
                  </CardTitle>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 py-4">
                      <Button
                        className=""
                        variant={"outline"}
                        onClick={decrement}
                        disabled={amount <= 0}
                      >
                        -
                      </Button>
                      <TypographySmall>{amount}</TypographySmall>
                      <Button
                        className=""
                        variant={"outline"}
                        onClick={increment}
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex justify-end items-center gap-2">
                      <TypographyMuted>Stok : </TypographyMuted>
                      <TypographyMuted className="text-primary text-xl dark:text-white">
                        {product.stock}
                      </TypographyMuted>
                    </div>
                  </div>

                  <CardDescription className="flex justify-between items-center">
                    <p className="">Subtotal</p>
                    <p className="font-bold text-primary text-xl dark:text-white">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(subTotal)}
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleAddProductToCart}
                    disabled={loadingCart}
                  >
                    Add to Cart
                  </Button>
                  {isFavorite ? (
                    <Button
                      className="border-green-500 text-green-500"
                      variant={"outline"}
                      onClick={handleDeleteFavorite}
                      disabled={loadingCategory}
                    >
                      <HeartFilledIcon /> Your Favorite
                    </Button>
                  ) : (
                    <>
                      <Button
                        className=""
                        variant={"outline"}
                        onClick={handleAddFavorite}
                        disabled={loadingCategory}
                      >
                        <HeartIcon /> Favorite
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function ReviewCard() {
  return (
    <>
      <div className="flex items-center gap-4 pt-4">
        <div className="flex items-center gap-1">
          <StarFilledIcon className="w-4" />
          <StarFilledIcon className="w-4" />
          <StarFilledIcon className="w-4" />
          <StarFilledIcon className="w-4" />
          <StarFilledIcon className="w-4" />
        </div>
        <TypographyMuted>1 Month ago</TypographyMuted>
      </div>
      <div className="flex items-center gap-2 py-4">
        <img
          src="/logo.png"
          alt=""
          className="rounded-full w-8 h-8 object-cover"
        />
        <p>Nama User</p>
      </div>
      <p>Good product</p>
      <div className="gap-2 grid grid-cols-4 py-4">
        <img
          src="/logo.png"
          alt=""
          className="rounded-md w-full h-24 object-cover"
        />
        <img
          src="/logo.png"
          alt=""
          className="rounded-md w-full h-24 object-cover"
        />
        <img
          src="/logo.png"
          alt=""
          className="rounded-md w-full h-24 object-cover"
        />
        <img
          src="/logo.png"
          alt=""
          className="rounded-md w-full h-24 object-cover"
        />
        <img
          src="/logo.png"
          alt=""
          className="rounded-md w-full h-24 object-cover"
        />
        <img
          src="/logo.png"
          alt=""
          className="rounded-md w-full h-24 object-cover"
        />
      </div>
    </>
  );
}
