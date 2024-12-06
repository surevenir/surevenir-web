"use server";

import { getUserById } from "@/utils/userActions";
import { cookies } from "next/headers";
import DashboardProfileView from "../dashboard/profile/DashboardProfileView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CartView from "./CartView";
import CheckoutView from "./CheckoutView";
import { getCarts } from "@/utils/cartActions";
import { Cart } from "../types/types";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("userId")?.value;
  const user = await getUserById(token as string, token as string);
  const cartData = await getCarts(token as string);

  if (!cartData) {
    console.log("Cart data not found or has incorrect format");
    return (
      <div>
        <h1>No Cart Found</h1>
      </div>
    );
  }

  const cart: Cart = cartData;

  return (
    <>
      <div className="px-32 py-8 w-full">
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
            <CheckoutView />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
