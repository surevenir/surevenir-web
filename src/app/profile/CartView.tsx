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
import {
  checkoutProductInCart,
  deleteCart,
  getCarts,
  updateProductInCart,
} from "@/utils/cartActions";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CartViewProps {
  cart: Cart;
}

export default function CartView({ cart }: CartViewProps) {
  const [carts, setCarts] = useState(cart);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const token = Cookies.get("userId");

  const fetchCarts = async () => {
    try {
      const cartData = await getCarts(token as string);
      if (cartData) {
        setCarts(cartData);
        // Reset selectedItems dan selectedProducts setelah fetch ulang
        const allItemIds = cartData.cart.map((item) => item.id);
        const allProductIds = cartData.cart.map((item) => item.product.id);
        setSelectedItems(allItemIds);
        setSelectedProducts(allProductIds);
      }
    } catch (error: any) {
      console.error("Error fetching carts:", error.message);
    }
  };

  useEffect(() => {
    if (cart) {
      const allItemIds = cart.cart.map((item) => item.id);
      const allProductIds = cart.cart.map((item) => item.product.id);
      setSelectedItems(allItemIds);
      setSelectedProducts(allProductIds);
      setTotalPrice(
        cart.cart.reduce((sum, item) => sum + item.subtotal_price, 0)
      );
    }
  }, [cart]);

  useEffect(() => {
    // Update totalPrice based on selectedItems
    const newTotal = carts.cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.subtotal_price, 0);
    setTotalPrice(newTotal);

    // Update selectAll state
    const allSelected =
      selectedItems.length === carts.cart.length &&
      selectedItems.every((id) => carts.cart.some((item) => item.id === id));
    setSelectAll(allSelected);
  }, [selectedItems, carts]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allItemIds = carts.cart.map((item) => item.id);
      const allProductIds = carts.cart.map((item) => item.product.id);
      setSelectedItems(allItemIds);
      setSelectedProducts(allProductIds);
    } else {
      setSelectedItems([]);
      setSelectedProducts([]);
    }
  };

  const handleUpdateQuantity = async (cartId: number, newQuantity: number) => {
    setLoadingIds((prev) => [...prev, cartId]);
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
      setLoadingIds((prev) => prev.filter((id) => id !== cartId));
    }
  };

  const handleDeleteCart = async (cartId: number) => {
    setLoadingIds((prev) => [...prev, cartId]);
    try {
      const result = await deleteCart(cartId, token as string);
      if (result) {
        toast.success("Cart deleted successfully!");
        await fetchCarts();
      } else {
        toast.error("Failed to delete cart");
      }
    } catch (error: any) {
      console.error("Error deleting cart:", error.message);
      toast.error(error.message || "An error occurred while deleting cart.");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== cartId));
    }
  };

  const handleCheckout = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to checkout.");
      return;
    }

    setLoading(true);
    try {
      const result = await checkoutProductInCart(
        selectedProducts,
        token as string
      );
      if (result) {
        toast.success("Checkout completed successfully!");
        await fetchCarts(); // Refresh cart setelah checkout berhasil
        setSelectedProducts([]); // Reset selectedProducts setelah checkout
        setSelectedItems([]); // Reset selectedItems setelah checkout
      } else {
        toast.error("Failed to complete checkout.");
      }
    } catch (error: any) {
      console.error("Error during checkout:", error.message);
      toast.error(error.message || "An error occurred during checkout.");
    } finally {
      setLoading(false);
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

  const handleSelect = (id: number, productId: number) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        setSelectedProducts((prevProducts) =>
          prevProducts.filter((prodId) => prodId !== productId)
        );
        return prev.filter((itemId) => itemId !== id);
      } else {
        setSelectedProducts((prevProducts) => [...prevProducts, productId]);
        return [...prev, id];
      }
    });
  };

  return (
    <div className="flex justify-center">
      {carts && (
        <div className="w-96">
          <TypographyH3 className="py-4 text-center">Cart</TypographyH3>
          <div className="flex items-center gap-2 py-2">
            <Checkbox
              id="select-all"
              checked={selectAll}
              onCheckedChange={(checked) => handleSelectAll(!!checked)}
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
                  onCheckedChange={() => handleSelect(item.id, item.product.id)}
                />
                <img
                  src={item.product?.images?.[0] || "/icon.png"}
                  alt={item.product?.name || "Product Image"}
                  className="rounded-sm w-20 h-16 object-cover"
                />
                <div className="gap-1 w-full">
                  <div className="flex justify-between">
                    <TypographyLarge>{item.product.name}</TypographyLarge>
                    <p className="font-bold">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(item.subtotal_price)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <TypographyMuted>
                      At: {item.product.merchant.name}
                    </TypographyMuted>
                    <div className="flex justify-end items-center gap-2">
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
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant={"destructive"}
                        disabled={loadingIds.includes(item.id)}
                      >
                        <Trash2Icon />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to remove this item?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Removing this item will
                          permanently delete it from your cart.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCart(item.id)}
                        >
                          Remove Item
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={selectedItems.length === 0 || loading}
                  variant={loading ? "outline" : "default"}
                >
                  {loading ? "Processing..." : "Checkout"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to proceed with checkout?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to checkout the following items. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  {carts.cart
                    .filter((item) => selectedItems.includes(item.id))
                    .map((item) => (
                      <div className="flex items-center gap-4" key={item.id}>
                        <img
                          src={item.product?.images?.[0] || "/icon.png"}
                          alt={item.product?.name || "Product Image"}
                          className="rounded-sm w-16 h-16 object-cover"
                        />
                        <div className="flex flex-col gap-1">
                          <TypographyLarge>{item.product.name}</TypographyLarge>
                          <TypographyMuted>
                            Quantity: {item.quantity}
                          </TypographyMuted>
                          <TypographyMuted>
                            Price:{" "}
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(item.subtotal_price)}
                          </TypographyMuted>
                        </div>
                      </div>
                    ))}
                  <hr className="my-4" />
                  <div className="flex justify-between items-center">
                    <TypographyLarge>Total Price:</TypographyLarge>
                    <TypographyLarge className="font-bold">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(
                        carts.cart
                          .filter((item) => selectedItems.includes(item.id))
                          .reduce((sum, item) => sum + item.subtotal_price, 0)
                      )}
                    </TypographyLarge>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCheckout}>
                    Proceed to Checkout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
}
