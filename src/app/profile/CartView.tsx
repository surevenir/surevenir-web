"use client";

import {
  TypographyH3,
  TypographyLarge,
  TypographyMuted,
} from "@/components/ui/typography";
import { Cart } from "../types/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { getCarts, updateProductInCart } from "@/utils/cartActions";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface CartViewProps {
  cart: Cart;
}

export default function CartView({ cart }: CartViewProps) {
  const [carts, setCarts] = useState(cart);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const [loadingIds, setLoadingIds] = useState<number[]>([]); // State untuk melacak tombol loading
  const token = Cookies.get("userId");

  const fetchCarts = async () => {
    try {
      const cartData = await getCarts(token as string);
      if (cartData) {
        setCarts(cartData);
      }
    } catch (error: any) {
      console.error("Error fetching carts:", error.message);
    }
  };

  useEffect(() => {
    if (cart) {
      const allItemIds = cart.cart.map((item) => item.id);
      setSelectedItems(allItemIds);
      const initialTotal = cart.cart.reduce(
        (sum, item) => sum + item.subtotal_price,
        0
      );
      setTotalPrice(initialTotal);
    }
  }, [cart]);

  useEffect(() => {
    if (selectAll) {
      const allItemIds = cart.cart.map((item) => item.id);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
    }
  }, [selectAll, cart]);

  useEffect(() => {
    const newTotal = carts.cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.subtotal_price, 0);
    setTotalPrice(newTotal);
  }, [selectedItems, carts]);

  const handleUpdateQuantity = async (cartId: number, newQuantity: number) => {
    setLoadingIds((prev) => [...prev, cartId]); // Tambahkan ID ke loadingIds
    try {
      const result = await updateProductInCart(
        cartId,
        newQuantity,
        token as string
      );
      if (result) {
        toast.success("Cart updated successfully!");
        fetchCarts();
      } else {
        toast.error("Failed to update cart");
      }
    } catch (error: any) {
      console.error("Error updating cart:", error.message);
      toast.error(error.message || "An error occurred while updating cart.");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== cartId)); // Hapus ID dari loadingIds
    }
  };

  const incrementQuantity = (itemId: number) => {
    const updatedCarts = { ...carts };
    const item = updatedCarts.cart.find((item) => item.id === itemId);
    if (item) {
      item.quantity += 1;
      item.subtotal_price = item.quantity * item.product.price;
      setCarts(updatedCarts);
      handleUpdateQuantity(itemId, item.quantity);
    }
  };

  const decrementQuantity = (itemId: number) => {
    const updatedCarts = { ...carts };
    const item = updatedCarts.cart.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      item.subtotal_price = item.quantity * item.product.price;
      setCarts(updatedCarts);
      handleUpdateQuantity(itemId, item.quantity);
    }
  };

  const handleSelect = (id: number) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <>
      <div className="flex justify-center">
        {carts && (
          <div className="w-96">
            <TypographyH3 className="py-4 text-center">Cart</TypographyH3>
            <div className="flex items-center gap-2 py-2">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={(checked) => setSelectAll(!!checked)}
              />
              <label htmlFor="select-all" className="font-medium">
                Select All
              </label>
            </div>
            <div className="flex flex-col gap-4 py-4">
              {carts.cart.map((item) => (
                <div className="flex gap-2" key={item.id}>
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleSelect(item.id)}
                  />
                  <img
                    src={item.product?.images?.[0] || "/icon.png"}
                    alt={item.product?.name || "Product Image"}
                    className="rounded-sm w-20 h-16 object-cover"
                  />
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between">
                      <TypographyLarge>{item.product.name}</TypographyLarge>
                      <p className="font-bold">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.subtotal_price)}
                      </p>
                    </div>
                    <div className="flex justify-end items-center gap-2 py-2">
                      <Button
                        variant={"outline"}
                        onClick={() => decrementQuantity(item.id)}
                        disabled={loadingIds.includes(item.id)}
                      >
                        -
                      </Button>
                      <TypographyMuted>{item.quantity}</TypographyMuted>
                      <Button
                        variant={"outline"}
                        onClick={() => incrementQuantity(item.id)}
                        disabled={loadingIds.includes(item.id)}
                      >
                        +
                      </Button>
                    </div>
                    <TypographyMuted>
                      At: {item.product.merchant.name}
                    </TypographyMuted>
                  </div>
                </div>
              ))}
              <hr />
              <h2 className="flex justify-between items-center">
                <p>Total Price: </p>
                <span className="font-bold text-2xl">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(totalPrice)}
                </span>
              </h2>
              <Button
                disabled={selectedItems.length === 0}
                onClick={() => alert("Proceeding to checkout")}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
