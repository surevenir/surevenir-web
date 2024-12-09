"use server";

import { getUserById } from "@/utils/userActions";
import { cookies } from "next/headers";
import DashboardProfileView from "../dashboard/profile/DashboardProfileView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CartView from "./CartView";
import CheckoutView from "./CheckoutView";
import { getCarts, getCheckout } from "@/utils/cartActions";
import { Cart, Checkout } from "../types/types";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const user = await getUserById(token as string, token as string);
  const cartData = await getCarts(token as string);
  const checkoutData = await getCheckout(token as string);

  if (!cartData) {
    console.error("Cart data not found or has incorrect format");
    return (
      <div>
        <h1>No Cart Found</h1>
      </div>
    );
  }

  if (!checkoutData) {
    console.error("Checkout data not found or has incorrect format");
    return (
      <div>
        <h1>No Checkout Found</h1>
      </div>
    );
  }

  const cart: Cart = cartData;
  const checkout: Checkout[] = checkoutData.sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <>
      <div className="px-8 md:px-16 lg:px-32 py-20 w-full">
        <Tabs defaultValue="cart" className="">
          <div className="flex justify-center">
            <TabsList className="m-auto">
              <TabsTrigger value="cart">Cart</TabsTrigger>
              <TabsTrigger value="checkout">Checkout</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="account" className="pt-4">
            <DashboardProfileView user={user} />
          </TabsContent>
          <TabsContent value="cart">
            <CartView cart={cart} />
          </TabsContent>
          <TabsContent value="checkout">
            <CheckoutView checkouts={checkout} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
