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

interface CartViewProps {
  cart: Cart;
}

export default function CartView({ cart }: CartViewProps) {
  // State untuk item yang dipilih
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectAll, setSelectAll] = useState<boolean>(true); // State untuk checkbox "Pilih Semua"

  // Inisialisasi selectedItems dan totalPrice saat cart pertama kali dimuat
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

  // Update selectedItems berdasarkan selectAll
  useEffect(() => {
    if (selectAll) {
      const allItemIds = cart.cart.map((item) => item.id);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
    }
  }, [selectAll, cart]);

  // Fungsi untuk menangani perubahan checkbox item
  const handleSelect = (id: number) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Update totalPrice setiap kali selectedItems berubah
  useEffect(() => {
    const newTotal = cart.cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.subtotal_price, 0);
    setTotalPrice(newTotal);
  }, [selectedItems, cart]);

  return (
    <>
      <div className="flex justify-center">
        {cart && (
          <div className="w-96">
            <TypographyH3 className="py-4 text-center">Cart</TypographyH3>
            {/* Checkbox untuk Select All */}
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
              {cart.cart.map((item) => (
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
                    <TypographyMuted>Quantity: {item.quantity}</TypographyMuted>
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
