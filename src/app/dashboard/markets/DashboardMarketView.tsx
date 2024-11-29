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
import {
  deleteMarket,
  postMarket,
  editMarket,
  postMarketImages,
} from "@/utils/actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "@/components/table-skeleton";
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

const formSchemaImages = z.object({
  id: z.number(),
  images: z.array(z.instanceof(File)),
});

type FormDataImages = z.infer<typeof formSchemaImages>;

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
  const [files, setFiles] = useState<File[]>([]);

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

  const formImages = useForm<FormDataImages>({
    resolver: zodResolver(formSchemaImages),
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

  const handleFileChange = (selectedFiles: File[]) => {
    // Periksa file apakah memenuhi kriteria (misalnya, ukuran dan tipe file)
    const validFiles = selectedFiles.filter((file) => {
      // Contoh validasi ukuran file
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("File size exceeds 10MB.");
        return false;
      }
      // Contoh validasi tipe file
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Only image files are allowed.");
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  const handleAddImages = async () => {
    if (!selectedMarket) return; // Ensure a market is selected

    setLoading(true);
    try {
      const result = await postMarketImages({
        id: selectedMarket.id,
        images: files,
      });

      if (result) {
        setMarkets((prev) =>
          prev.map((market) =>
            market.id === selectedMarket.id
              ? { ...market, images: result } // Update market with images
              : market
          )
        );
        toast.success("Market images added successfully!");
        setFiles([]); // Reset file input after successful upload
      } else {
        toast.error("Failed to add market images. Please try again later.");
      }
    } catch (error: any) {
      // Log the error for debugging
      console.error("Error adding market images:", error);

      // Log additional details if available
      if (error.response) {
        console.error("Response error:", error.response);
        toast.error(
          `Error: ${error.response?.data?.message || "Unknown error occurred."}`
        );
      } else if (error.message) {
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred while adding market images.");
      }
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

  const handleDeleteMarket = async () => {
    if (!selectedMarket) return;

    setLoading(true);
    try {
      const result = await deleteMarket(selectedMarket.id);
      if (result) {
        setMarkets((prev) =>
          prev.filter((market) => market.id !== selectedMarket.id)
        );
        setSelectedMarket(null);
        toast("Successfully deleted market");
      } else {
        toast("Failed to delete market");
      }
    } catch (error: any) {
      console.error("Error deleting market:", error.message);
      toast("An error occurred while deleting the market");
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
              <TableHead>Images</TableHead>
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
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          setSelectedMarket(market);
                          setFiles([]);
                          setLoading(false);
                        }}
                      >
                        Add Images
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add Market Images</DialogTitle>
                        <DialogDescription>{market.name}</DialogDescription>
                      </DialogHeader>
                      <Form {...formImages}>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddImages();
                          }}
                          className="space-y-4"
                        >
                          <Input
                            type="file"
                            multiple
                            onChange={(e) => {
                              if (e.target.files) {
                                handleFileChange(Array.from(e.target.files));
                              }
                            }}
                          />
                          <DialogFooter>
                            <Button
                              type="submit"
                              disabled={loading || files.length === 0}
                            >
                              {loading ? "Adding..." : "Add Image"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </TableCell>

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

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => setSelectedMarket(market)}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this category?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {`This action will permanently delete the category "${selectedMarket?.name}".`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setSelectedMarket(market)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteMarket}>
                          {loading ? "Deleting..." : "Confirm"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
