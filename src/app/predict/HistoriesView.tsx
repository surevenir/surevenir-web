"use client";

import { TypographyH3 } from "@/components/ui/typography";
import { Histories } from "../types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ShinyButton from "@/components/ui/shiny-button";
import { Button } from "@/components/ui/button";
import { Trash2Icon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { deleteHistory, getHistories } from "@/utils/predictActions";
import Cookies from "js-cookie";
import { toast } from "sonner";
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
import Link from "next/link";

interface HistoriesViewProps {
  histories: Histories[];
}

export default function HistoriesView({
  histories: initialHistories,
}: HistoriesViewProps) {
  const [loading, setLoading] = useState(false);
  const [histories, setHistories] = useState(initialHistories);
  const token = Cookies.get("userId");

  const fetchHistories = async () => {
    try {
      const historiesData = await getHistories(token as string);
      if (historiesData) {
        setHistories(historiesData);
      }
    } catch (error: any) {
      console.error("Error fetching histories:", error.message);
    }
  };

  const handleDeleteHistory = async (id: number) => {
    setLoading(true);
    try {
      const result = await deleteHistory(id, token as string);
      if (result) {
        toast.success("History deleted successfully!");
        await fetchHistories();
      } else {
        toast.error("Failed to delete history");
      }
    } catch (error: any) {
      console.error("Error deleting history:", error.message);
      toast.error(error.message || "An error occurred while deleting history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="">
        <TypographyH3 className="py-8 text-center">Histories</TypographyH3>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {histories.map((history) => (
            <Card key={history.id}>
              <CardHeader>
                <CardDescription>
                  {new Date(history.updatedAt).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <img
                  src={history.image_url}
                  alt={history.predict}
                  className="rounded-md w-full h-36 object-cover"
                />
                <p className="font-bold">{history.predict}</p>
                <p>Accuration : {history.accuration * 100} %</p>
                <p className="">
                  {history.category_range_price
                    .split("-")
                    .map((price) =>
                      new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(Number(price))
                    )
                    .join(" - ")}{" "}
                </p>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-between gap-2">
                <Link href={`/products?query=${history.category_name}`}>
                  <ShinyButton disabled={loading}>Explore</ShinyButton>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"destructive"} disabled={loading}>
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
                        permanently delete it from your history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteHistory(history.id)}
                      >
                        Remove History
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
