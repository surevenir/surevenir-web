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
  getMarkets,
} from "@/utils/marketActions";
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
import { Market } from "@/app/types/types";
import { deleteImage } from "@/utils/imageActions";
import Cookies from "js-cookie";

interface MarketRequest {
  name: string;
  description: string;
  longitude: string;
  latitude: string;
  image: File;
}

interface MarketViewProps {
  markets: Market[] | [];
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." }),
  longitude: z.string().nonempty({ message: "Longitude is required." }),
  latitude: z.string().nonempty({ message: "Latitude is required." }),
  image: z.instanceof(File).optional(),
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
  lat: -8.510014814449596,
  lng: 115.25923437673299,
};

export default function DashboardMarketView({
  markets: initialMarkets,
}: MarketViewProps) {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState(defaultCenter);
  const [files, setFiles] = useState<File[]>([]);
  const [file, setFile] = useState<File>();
  const token = Cookies.get("userId");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedMarket?.name || "",
      description: selectedMarket?.description || "",
      longitude: selectedMarket?.longitude || "",
      latitude: selectedMarket?.latitude || "",
    },
  });

  const formImages = useForm<FormDataImages>({
    resolver: zodResolver(formSchemaImages),
  });

  const fetchMarkets = async () => {
    try {
      const data = await getMarkets();
      setMarkets(data || []);
    } catch (error: any) {
      console.error("Error fetching markets:", error.message);
    }
  };

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
    console.log("market", data);

    if (!file) {
      toast.error("Please select a valid image file.");
      setLoading(false);
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("File size exceeds 3MB.");
      setLoading(false);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Only image files are allowed.");
      setLoading(false);
      return;
    }

    try {
      const result = await postMarket({ ...data, image: file });

      console.log(result);

      toast.success("Market added successfully!");
      form.reset();
      setFile(undefined);
      await fetchMarkets();
    } catch (error: any) {
      console.error("Error adding market:", error.message);
      toast.error(
        error.message || "An error occurred while adding the market."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("File size exceeds 3MB.");
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Only image files are allowed.");
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  const handleSingleFileChange = (selectedFile: File) => {
    if (selectedFile.size > 3 * 1024 * 1024) {
      toast.error("File size exceeds 3MB.");
      return false;
    }
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Invalid file type. Only image files are allowed.");
      return false;
    }
    setFile(selectedFile);
    return true;
  };

  const handleAddImages = async () => {
    if (!selectedMarket) return;

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
              ? { ...market, images: result }
              : market
          )
        );
        toast.success("Market images added successfully!");
        setFiles([]);
        await fetchMarkets();
      } else {
        toast.error("Failed to add market images. Please try again later.");
      }
    } catch (error: any) {
      console.error("Error adding market images:", error);

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
    console.log("Editing market with data:", data);

    // Validasi file gambar jika ada
    const file = data.image as File | null;

    if (file && file.size > 3 * 1024 * 1024) {
      toast.error("File size exceeds 3MB.");
      setLoading(false);
      return;
    }

    if (file && !file.type.startsWith("image/")) {
      toast.error("Invalid file type. Only image files are allowed.");
      setLoading(false);
      return;
    }

    try {
      const updatedMarket = {
        id: selectedMarket.id,
        name: data.name as string,
        description: data.description as string,
        longitude: data.longitude as string,
        latitude: data.latitude as string,
        image: file ? file : undefined,
      };

      const result = await editMarket(updatedMarket);

      if (result) {
        setMarkets((prev) =>
          prev.map((market) =>
            market.id === selectedMarket.id
              ? { ...market, ...updatedMarket }
              : market
          )
        );
        toast.success("Market updated successfully!");
        setSelectedMarket(null);
        await fetchMarkets();
      } else {
        toast.error("Failed to update market. Please try again.");
      }
    } catch (error: any) {
      console.error("Error updating market:", error.message);
      toast.error("An error occurred while updating the market.");
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
        toast("Successfully deleted market");
        setSelectedMarket(null);
        await fetchMarkets();
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

  const handleDeleteImage = async (url: string) => {
    setLoading(true);
    try {
      const result = await deleteImage(url, token as string);

      console.log("result :", result);

      if (result) {
        toast("Successfully deleted image");
        await fetchMarkets();
      } else {
        toast("Failed to delete image");
      }
    } catch (error: any) {
      console.error("Error deleting image:", error.message);
      toast("An error occurred while deleting the image");
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
            <Button
              onClick={() =>
                form.reset({
                  name: "",
                  description: "",
                  longitude: defaultCenter.lng.toString(),
                  latitude: defaultCenter.lat.toString(),
                })
              }
            >
              Add Market
            </Button>
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
                className="space-y-4"
                onSubmit={form.handleSubmit(handleAddMarket)}
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

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          required
                          onChange={(e) => {
                            const selectedFile = e.target.files
                              ? e.target.files[0]
                              : null;
                            if (selectedFile) {
                              const isValid =
                                handleSingleFileChange(selectedFile);
                              if (isValid) {
                                form.setValue("image", selectedFile);
                              } else {
                                form.setValue("image", undefined);
                              }
                            }
                          }}
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

      {loading && <TableSkeleton />}

      {!loading && isLoaded && (
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
              <TableRow key={market.slug}>
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
                        Images
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-2/3">
                      <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                          <DialogHeader>
                            <DialogTitle>Market Images</DialogTitle>
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
                                    handleFileChange(
                                      Array.from(e.target.files)
                                    );
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
                        </div>
                        <div className="gap-4 grid grid-cols-3 grid-flow-row">
                          {market.images?.map((image) => (
                            <div
                              className="flex flex-col gap-4 w-32 h-full object-fill"
                              key={image.id}
                            >
                              <img
                                src={image.url}
                                className="w-full"
                                alt={market.name}
                              />

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant={"destructive"}
                                    disabled={loading}
                                  >
                                    {loading ? "Deleting..." : "Delete Image"}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure you want to delete this
                                      image?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {`This action will permanently delete the image`}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteImage(image.url)
                                      }
                                    >
                                      {loading ? "Deleting..." : "Confirm"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          ))}
                        </div>
                      </div>
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

                          {market.profile_image_url && (
                            <img
                              src={market.profile_image_url}
                              alt={market.name}
                              className="rounded-md w-16"
                            />
                          )}

                          <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                  <Input
                                    type="file"
                                    onChange={(e) => {
                                      const selectedFile = e.target.files
                                        ? e.target.files[0]
                                        : null;
                                      if (selectedFile) {
                                        const isValid =
                                          handleSingleFileChange(selectedFile);
                                        if (isValid) {
                                          form.setValue("image", selectedFile);
                                        } else {
                                          form.setValue("image", undefined);
                                        }
                                      }
                                    }}
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
