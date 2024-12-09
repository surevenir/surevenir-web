"use client";

import {
  TypographyH3,
  TypographyH4,
  TypographyMuted,
} from "@/components/ui/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Checkout } from "../types/types";

interface CheckoutViewProps {
  checkouts: Checkout[];
}

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
