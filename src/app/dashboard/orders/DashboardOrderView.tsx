"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import TableSkeleton from "@/components/table-skeleton";
import { Checkout, CheckoutStatus } from "@/app/types/types";
import Cookies from "js-cookie";
import { RefreshCwIcon } from "lucide-react";
import { getCheckout, updateCheckoutStatus } from "@/utils/cartActions";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
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
import { TypographyLarge, TypographyMuted } from "@/components/ui/typography";

interface OrderViewProps {
  checkouts: Checkout[] | [];
}

const formSchema = z.object({
  status: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export default function DashboardMarketView({
  checkouts: initialCheckouts,
}: OrderViewProps) {
  const [checkouts, setCheckouts] = useState<Checkout[]>(initialCheckouts);
  const [selectedCheckout, setSelectedCheckout] = useState<Checkout | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("userId");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: selectedCheckout?.status || "PENDING",
    },
  });

  const fetchCheckouts = async () => {
    setLoading(true);
    try {
      const data = await getCheckout(token as string, true);
      setCheckouts(data || []);
    } catch (error: any) {
      console.error("Error fetching checkouts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCheckout = async () => {
    if (!selectedCheckout) return;

    if (!selectedStatus) {
      throw new Error("Status cannot be null");
    }

    setLoading(true);

    try {
      const updatedCheckout = {
        id: selectedCheckout.id,
        status: selectedStatus,
      };

      const result = await updateCheckoutStatus(
        updatedCheckout,
        token as string
      );

      console.log("RESULT", JSON.stringify(result, null, 2));
      if (result) {
        toast.success("Checkout updated successfully!");
        setSelectedCheckout(null);
        setSelectedStatus(null);
        await fetchCheckouts();
      } else {
        toast.error("Failed to update checkout. Please try again.");
      }
    } catch (error: any) {
      console.error("Error updating checkout:", error.message);
      toast.error("An error occurred while updating the checkout.");
    } finally {
      setLoading(false);
      setSelectedCheckout(null);
      setSelectedStatus(null);
    }
  };

  return (
    <div className="px-8 pb-8">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-xl">Checkout List</h3>
          <Button variant={"outline"} onClick={() => fetchCheckouts()}>
            <RefreshCwIcon />
          </Button>
        </div>
      </div>

      {loading && <TableSkeleton />}

      {!loading && (
        <Table>
          <TableCaption>
            Checkouts List ({checkouts.length} / {checkouts.length})
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {checkouts.map((checkout, index) => (
              <TableRow key={checkout.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {checkout.updatedAt
                    ? format(
                        new Date(checkout.updatedAt),
                        "dd MMM yyyy HH:mm:ss"
                      )
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {checkout.status == CheckoutStatus.COMPLETED ? (
                    <Badge variant="default">Completed</Badge>
                  ) : checkout.status == CheckoutStatus.DELIVERED ? (
                    <Badge variant={"secondary"}>Delivered</Badge>
                  ) : checkout.status == CheckoutStatus.PENDING ? (
                    <Badge variant={"outline"}>Pending</Badge>
                  ) : (
                    <Badge variant={"destructive"}>Canceled</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button>Detail</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Checkout Detail</AlertDialogTitle>
                      </AlertDialogHeader>
                      <div className="flex flex-col gap-4 py-4">
                        {checkout.checkout_details.map((item) => (
                          <div
                            className="flex items-center gap-4"
                            key={item.id}
                          >
                            <img
                              src={item.product?.images?.[0].url || "/icon.png"}
                              alt={item.product?.name || "Product Image"}
                              className="rounded-sm w-16 h-16 object-cover"
                            />
                            {item.product && (
                              <>
                                <div className="flex flex-col gap-1">
                                  <TypographyLarge>
                                    {item.product_identity}
                                  </TypographyLarge>
                                  <TypographyMuted>
                                    Quantity: {item.product_quantity}
                                  </TypographyMuted>
                                  <TypographyMuted>
                                    Price:{" "}
                                    {new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    }).format(item.product.price)}
                                  </TypographyMuted>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        <hr className="my-4" />
                        <div className="flex justify-between items-center">
                          <TypographyLarge>Total Price:</TypographyLarge>
                          <TypographyLarge className="font-bold">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(checkout.total_price)}
                          </TypographyLarge>
                        </div>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>

                <TableCell className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setSelectedCheckout(checkout);

                          form.reset({
                            status: checkout.status,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Checkout</DialogTitle>
                        <DialogDescription>
                          Update the details of the checkout below.
                        </DialogDescription>
                      </DialogHeader>

                      <Select
                        value={selectedStatus || checkout.status}
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder={
                              checkout.status.charAt(0).toUpperCase() +
                              checkout.status.slice(1).toLowerCase()
                            }
                            defaultValue={checkout.status}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <DialogFooter>
                        <Button onClick={handleEditCheckout} disabled={loading}>
                          {loading ? "Updating..." : "Update Checkout Status"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
