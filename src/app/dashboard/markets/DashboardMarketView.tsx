"use client";

import { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteMarket, postMarket, editMarket } from "@/utils/actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "@/components/table-skeleton";

type Market = {
  id: number;
  name: string;
  description: string;
  longitude: string;
  latitude: string;
};

interface MarketViewProps {
  markets: Market[] | [];
}

// Schema untuk validasi form
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." }),
  longitude: z.string().nonempty({ message: "Longitude is required." }),
  latitude: z.string().nonempty({ message: "Latitude is required." }),
});
type FormData = z.infer<typeof formSchema>;

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: -8.65,
  lng: 115.216,
};

export default function DashboardMarketView({
  markets: initialMarkets,
}: MarketViewProps) {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState(defaultCenter);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      longitude: "",
      latitude: "",
    },
  });

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();
    if (lat && lng) {
      form.setValue("latitude", lat.toString());
      form.setValue("longitude", lng.toString());
      setMapCoordinates({ lat, lng });
    }
  };

  const handleAddMarket = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await postMarket(data);
      if (result) {
        setMarkets((prev) => [...prev, result]);
        toast("Market added successfully!");
        form.reset();
      } else {
        toast("Failed to add market. Please try again.");
      }
    } catch (error: any) {
      console.error("Error adding market:", error.message);
      toast("An error occurred while adding the market.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMarket = async (data: FormData) => {
    if (!selectedMarket) return;

    setLoading(true);
    try {
      const result = await editMarket({
        id: selectedMarket.id,
        name: data.name,
        description: data.description,
        longitude: data.longitude,
        latitude: data.latitude,
      });
      if (result) {
        setMarkets((prev) =>
          prev.map((market) =>
            market.id === selectedMarket.id ? { ...market, ...data } : market
          )
        );
        toast("Market updated successfully!");
        setSelectedMarket(null);
      } else {
        toast("Failed to update market. Please try again.");
      }
    } catch (error: any) {
      console.error("Error updating market:", error.message);
      toast("An error occurred while updating the market.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMarket = async (marketId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this market?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const result = await deleteMarket(marketId);
      if (result) {
        setMarkets((prev) => prev.filter((market) => market.id !== marketId));
        toast("Market deleted successfully!");
      } else {
        toast("Failed to delete market. Please try again.");
      }
    } catch (error: any) {
      console.error("Error deleting market:", error.message);
      toast("An error occurred while deleting the market.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-xl">Market List</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Market</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Market</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new Market. Use the map to
                set coordinates.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddMarket)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter market name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter market description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="border rounded w-full h-[300px]">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={12}
                    center={mapCoordinates}
                    onClick={handleMapClick}
                  >
                    <Marker position={mapCoordinates} />
                  </GoogleMap>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Market"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {!isLoaded && <TableSkeleton />}

      {isLoaded && (
        <Table>
          <TableCaption>
            {markets.length != 0 ? "Markets List" : "No Markets Found"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {!isLoaded && <Skeleton className="w-full h-4" />}

          <TableBody>
            {markets.map((market, index) => (
              <TableRow key={market.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{market.name}</TableCell>
                <TableCell>{market.description}</TableCell>
                <TableCell className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setSelectedMarket(market);
                          form.reset({
                            name: market.name,
                            description: market.description,
                            longitude: market.longitude,
                            latitude: market.latitude,
                          });
                          setMapCoordinates({
                            lat: parseFloat(market.latitude),
                            lng: parseFloat(market.longitude),
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Market</DialogTitle>
                        <DialogDescription>
                          Update the details of the Market below.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handleEditMarket)}
                          className="space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter market name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter market description"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="border rounded w-full h-[300px]">
                            <GoogleMap
                              mapContainerStyle={mapContainerStyle}
                              zoom={12}
                              center={mapCoordinates}
                              onClick={handleMapClick}
                            >
                              <Marker position={mapCoordinates} />
                            </GoogleMap>
                          </div>
                          <DialogFooter>
                            <Button type="submit" disabled={loading}>
                              {loading ? "Updating..." : "Update Market"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteMarket(market.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
