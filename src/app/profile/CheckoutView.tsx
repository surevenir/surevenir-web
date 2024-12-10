"use client";

import {
  TypographyH3,
  TypographyH4,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { Checkout } from "../types/types";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { postReview } from "@/utils/reviewActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface CheckoutViewProps {
  checkouts: Checkout[];
}

const formSchema = z.object({
  rating: z.number(), // Rating harus dalam rentang 1-5
  comment: z
    .string()
    .min(2, { message: "Comment must be at least 2 characters." }),
  user_id: z.string(),
  product_id: z.number(),
  images: z.array(z.instanceof(File)).optional(), // Tetapkan sebagai opsional
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutView({ checkouts }: CheckoutViewProps) {
  return (
    <>
      <TypographyH3 className="py-4 text-center">Checkout</TypographyH3>
      {!checkouts && (
        <>
          <TypographyH4>Checkout Not Found</TypographyH4>
        </>
      )}
      <div className="flex flex-col gap-4">
        {checkouts.map((checkout) => (
          <CheckoutCart {...checkout} key={checkout.id} />
        ))}
      </div>
    </>
  );
}

function CheckoutCart(checkout: Checkout) {
  const token = Cookies.get("userId");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 5,
      comment: "",
      product_id: 0,
      user_id: "",
      images: [],
    },
  });

  const handleAddReview = async (data: FormData) => {
    setLoading(true);

    try {
      const result = await postReview(data, token as string);
      if (result) {
        toast.success("Review added successfully!");
        form.reset();
      } else {
        toast.error("Failed to add review");
      }
      setFiles([]);
    } catch (error: any) {
      console.error("Error adding review:", error.message);
      toast.error(
        error.message || "An error occurred while adding the review."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("File size exceeds 3MB.");
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Only image files are allowed.");
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  return (
    <Card className="m-auto sm:w-full lg:w-96">
      <CardHeader>
        <CardDescription className="text-right">
          {new Date(checkout.updatedAt).toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </CardDescription>
        <hr />
      </CardHeader>
      <CardContent>
        {checkout.checkout_details.map((detail) => (
          <div key={detail.id} className="flex gap-4 pb-4">
            <div className="">
              {detail.product != null && (
                <img
                  src={
                    detail.product.images
                      ? detail.product.images[0].url
                      : "/logo.png"
                  }
                  alt="Image"
                  className="rounded-md w-20 h-20 object-cover"
                />
              )}

              {detail.product == null && (
                <img
                  src={"/logo.png"}
                  alt="Image"
                  className="rounded-md w-20 h-20 object-cover"
                />
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      form.setValue("product_id", detail.product_id);
                      form.setValue("user_id", token as string);
                    }}
                  >
                    Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Review Product</DialogTitle>
                    <p className="pt-4">{detail.product_identity}</p>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit(handleAddReview)}
                    >
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <Select
                              defaultValue={"5"}
                              onValueChange={(value) =>
                                field.onChange(parseInt(value, 10))
                              } // Konversi ke number
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your rating" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              You can manage email addresses in your{" "}
                              <Link href="/examples/forms">email settings</Link>
                              .
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Review</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your review"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                multiple
                                onChange={(e) => {
                                  if (e.target.files) {
                                    const selectedFiles = Array.from(
                                      e.target.files
                                    );
                                    handleFileChange(selectedFiles);
                                    field.onChange(selectedFiles); // Set nilai ke form
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Adding..." : "Add Review"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              <p className="text-base">{detail.product_identity}</p>
              <TypographyMuted>
                Quantity : {detail.product_quantity}
              </TypographyMuted>
              <p>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(detail.product_subtotal)}
              </p>
            </div>
          </div>
        ))}
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p>Total : </p>
        <p className="font-bold text-xl">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(checkout.total_price)}
        </p>
      </CardFooter>
    </Card>
  );
}
