"use client";

import { Button } from "@/components/ui/button";
import {
  TypographyH3,
  TypographyH4,
  TypographyMuted,
} from "@/components/ui/typography";
import { postPredict } from "@/utils/predictActions";
import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderComponent } from "@/components/loader";
import { Predict } from "../types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import ShinyButton from "@/components/ui/shiny-button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formSchemaAdd = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "Only image files are allowed.",
    })
    .refine((file) => file.size <= 3 * 1024 * 1024, {
      message: "File size must be less than 3MB.",
    }),
});
type FormDataAdd = z.infer<typeof formSchemaAdd>;

export default function PredictView() {
  const [loading, setLoading] = useState(false);
  const [newRequest, setNewRequest] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<Predict | null>(null);
  const token = Cookies.get("userId");

  const formAdd = useForm<FormDataAdd>({
    resolver: zodResolver(formSchemaAdd),
    defaultValues: {
      image: undefined,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setNewRequest(false);
      formAdd.setValue("image", file);
    }
  };

  const handlePredict = async () => {
    try {
      formAdd.handleSubmit(async (data) => {
        if (!token) {
          toast.error("User is not authenticated. Please log in.");
          return;
        }

        setLoading(true);
        setResult(null);

        const timeout = new Promise((_, reject) =>
          setTimeout(() => {
            reject(
              new Error("Request timeout. Please upload the image again.")
            );
            setLoading(false);
          }, 15000)
        );

        try {
          const result = await Promise.race([
            postPredict(data.image, token),
            timeout,
          ]);

          if (
            result &&
            typeof result === "object" &&
            "prediction" in result &&
            "category" in result &&
            "related_products" in result
          ) {
            setResult(result as Predict);
            toast.success("Prediction successful!");
            formAdd.reset();
            setNewRequest(true);
            setLoading(false);
          } else {
            toast.error("Failed to predict. Invalid response.");
          }
        } catch (error: any) {
          console.error("Error during prediction:", error.message);
          toast.error(
            error.message ||
              "An error occurred while predicting. Please try again."
          );
          setLoading(false);
        }
      })();
    } catch (error: any) {
      console.error("Error during prediction:", error.message);
      toast.error(error.message || "An error occurred while predicting.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <TypographyH3 className="py-8 text-center">
          Predict Souvenir
        </TypographyH3>
        <div className="flex lg:flex-row flex-col gap-4">
          <div className="w-full lg:w-1/3">
            <form
              id="predictForm"
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div
                id="dropArea"
                className="border-2 border-gray-300 mb-4 p-5 border-dashed rounded-lg"
              >
                <p>
                  Please click the "Select your picture" button to select an
                  image for prediction.
                </p>
                <input
                  type="file"
                  id="skinFile"
                  name="skin"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  required
                />
                <label
                  htmlFor="skinFile"
                  className="inline-block bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] mt-2 px-4 py-2 border rounded-md font-medium text-primary text-sm cursor-pointer"
                >
                  Select your picture
                </label>
                <div id="previewImg" className="mt-2">
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="rounded-md max-w-full"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-start">
                <Button
                  onClick={handlePredict}
                  disabled={loading || !formAdd.watch("image")}
                >
                  {loading ? "Predicting..." : "Predict"}
                </Button>
              </div>
            </form>
          </div>
          <div className="w-full lg:w-2/3">
            {newRequest && !result && (
              <>
                <img
                  src="/svg/waiting.svg"
                  alt=""
                  className="mx-auto rounded-md w-1/2"
                />
                <TypographyMuted className="py-2 text-center">
                  Waiting for image input
                </TypographyMuted>
              </>
            )}
            {loading && (
              <div className="flex justify-center items-center w-full h-full">
                <div className="flex flex-col justify-center items-center">
                  <p>Loading</p>
                  <LoaderComponent />
                </div>
              </div>
            )}
            {result && (
              <>
                <div className="space-y-4">
                  <TypographyH4>Result</TypographyH4>

                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Accuration</TableCell>
                        <TableCell>
                          {result.prediction.accuration * 100} %
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>{result.prediction.result}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>{result.category.description}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Range Price</TableCell>
                        <TableCell>
                          {result.category.range_price
                            .split("-")
                            .map((price) =>
                              new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(Number(price))
                            )
                            .join(" - ")}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <TypographyH4>Related Products</TypographyH4>
                  <div className="gap-4 grid grid-cols-2 md:grid-cols-3">
                    {result.related_products &&
                      result.related_products.map((product) => (
                        <div key={product.id}>
                          <Card className="overflow-hidden" key={product.id}>
                            {product.images && product.images.length > 0 && (
                              <img
                                src={product.images[0]}
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
                                <ShinyButton className="w-full">
                                  See Details
                                </ShinyButton>
                              </Link>
                            </CardHeader>
                          </Card>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
