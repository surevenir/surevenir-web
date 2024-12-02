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
import { Market, Merchant } from "@/app/types/types";
import { deleteImage } from "@/utils/imageActions";
import Cookies from "js-cookie";
import {
  deleteMerchant,
  editMerchant,
  getMerchants,
  postMerchant,
  postMerchantImages,
} from "@/utils/merchantActions";
import { getMarkets } from "@/utils/marketActions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

interface MerchantViewProps {
  merchants: Merchant[] | [];
  markets: Market[] | [];
}

export default function DashboardMerchantView({
  merchants: initialMerchants,
  markets: initialMarkets,
}: MerchantViewProps) {
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants);
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const [selectedMarket, setSelectedMarket] = useState<Market | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [file, setFile] = useState<File>();
  const [hasMarket, setHasMarket] = useState(true);
  const userId = Cookies.get("userId") || "";
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z
      .string()
      .min(2, { message: "Description must be at least 2 characters." }),
    addresses: z.string().optional(),
    userId: z.string(),
    marketId: z.string().optional(),
    longitude: z.string(),
    latitude: z.string(),
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

  const [mapCoordinates, setMapCoordinates] = useState(defaultCenter);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedMerchant?.name || "",
      description: selectedMerchant?.description || "",
      addresses: "",
      longitude: selectedMerchant?.longitude || "",
      latitude: selectedMerchant?.latitude || "",
    },
  });

  const formImages = useForm<FormDataImages>({
    resolver: zodResolver(formSchemaImages),
  });

  const fetchMerchants = async () => {
    try {
      const data = await getMerchants();
      setMerchants(data || []);
    } catch (error: any) {
      console.error("Error fetching merchants:", error.message);
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

  const handleAddMerchant = async (data: FormData) => {
    setLoading(true);
    console.log("merchant", data);

    if (!data.image) {
      toast.error("Please select a valid image file.");
      setLoading(false);
      return;
    }

    const file = data.image as File;

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
      data.userId = userId;

      if (!hasMarket) {
        setSelectedMarket(undefined);
        delete data.marketId;
      }

      if (hasMarket && selectedMarket) {
        data.marketId = selectedMarket.id.toString();
        data.longitude = selectedMarket.longitude ?? "";
        data.latitude = selectedMarket.latitude ?? "";
        delete data.addresses;
      }

      console.log("data", data);

      const result = await postMerchant({ ...data, image: file });

      console.log(result);

      toast.success("Merchant added successfully!");
      form.reset();
      setFile(undefined);
      await fetchMerchants();
    } catch (error: any) {
      console.error("Error adding merchant:", error.message);
      toast.error(
        error.message || "An error occurred while adding the merchant."
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
    if (!selectedMerchant) return;

    setLoading(true);
    try {
      const result = await postMerchantImages({
        id: selectedMerchant.id,
        images: files,
      });

      if (result) {
        toast.success("Merchant images added successfully!");
        setFiles([]);
        await fetchMerchants();
      } else {
        toast.error("Failed to add merchant images. Please try again later.");
      }
    } catch (error: any) {
      console.error("Error adding merchant images:", error);

      if (error.response) {
        console.error("Response error:", error.response);
        toast.error(
          `Error: ${error.response?.data?.message || "Unknown error occurred."}`
        );
      } else if (error.message) {
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred while adding merchant images.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditMerchant = async (data: FormData) => {
    if (!selectedMerchant) return;

    setLoading(true);
    console.log("Editing merchant with data:", data);

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
      data.userId = userId;

      if (!hasMarket) {
        setSelectedMarket(undefined);
        delete data.marketId;
      }

      if (hasMarket && selectedMarket) {
        data.marketId = selectedMarket.id.toString();
        data.longitude = selectedMarket.longitude ?? "";
        data.latitude = selectedMarket.latitude ?? "";
        delete data.addresses;
      }

      console.log("data", data);

      const updatedMerchant = {
        id: selectedMerchant.id,
        name: data.name as string,
        description: data.description as string,
        addresses: data.addresses || null,
        userId: data.userId as string,
        longitude: data.longitude as string,
        latitude: data.latitude as string,
        image: file ? file : undefined,
        marketId: data.marketId ?? null,
      };

      const result = await editMerchant(updatedMerchant);

      if (result) {
        toast.success("Merchant updated successfully!");
        setSelectedMerchant(null);
        await fetchMerchants();
      } else {
        toast.error("Failed to update merchant. Please try again.");
      }
    } catch (error: any) {
      console.error("Error updating merchant:", error.message);
      toast.error("An error occurred while updating the merchant.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMerchant = async () => {
    if (!selectedMerchant) return;

    setLoading(true);
    try {
      const result = await deleteMerchant(selectedMerchant.id);
      if (result) {
        toast("Successfully deleted merchant");
        setSelectedMerchant(null);
        await fetchMerchants();
      } else {
        toast("Failed to delete merchant");
      }
    } catch (error: any) {
      console.error("Error deleting merchant:", error.message);
      toast("An error occurred while deleting the merchant");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (url: string) => {
    setLoading(true);
    try {
      const result = await deleteImage(url, userId as string);

      console.log("result :", result);

      if (result) {
        toast("Successfully deleted image");
        await fetchMerchants();
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
    <div className="px-8 pb-8">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-xl">Merchant List</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                form.reset({
                  name: "",
                  description: "",
                  addresses: "",
                  userId: "",
                  longitude: defaultCenter.lng.toString(),
                  latitude: defaultCenter.lat.toString(),
                  image: undefined,
                });
                setSelectedMarket(undefined);
              }}
            >
              Add Merchant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Merchant</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new merchant.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleAddMerchant)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter merchant name" {...field} />
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
                          placeholder="Enter merchant description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-2 pb-2">
                  <Checkbox
                    id="inTheMarket"
                    checked={hasMarket}
                    onCheckedChange={() => setHasMarket(!hasMarket)}
                  />
                  <label
                    htmlFor="inTheMarket"
                    className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                  >
                    In the market
                  </label>
                </div>

                {hasMarket && (
                  <FormField
                    control={form.control}
                    name="marketId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Market</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-[200px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  onChange={() => {
                                    setSelectedMarket(
                                      markets.find(
                                        (market) =>
                                          market.id.toString() === field.value
                                      )
                                    );
                                    console.log(
                                      "selectedMarket",
                                      selectedMarket
                                    );
                                  }}
                                >
                                  {field.value
                                    ? markets.find(
                                        (market) =>
                                          market.id.toString() === field.value
                                      )?.name
                                    : "Select market"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[200px]">
                              <Command>
                                <CommandInput
                                  placeholder="Search market..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No market found.</CommandEmpty>
                                  <CommandGroup>
                                    {markets.map((market) => (
                                      <CommandItem
                                        value={market.name}
                                        key={market.id}
                                        onSelect={() => {
                                          form.setValue(
                                            "marketId",
                                            market.id.toString()
                                          );
                                          setSelectedMarket(market);
                                        }}
                                      >
                                        {market.name}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            market.id.toString() === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!hasMarket && (
                  <FormField
                    control={form.control}
                    name="addresses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Addresses</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter merchant addresses"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
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

                {!hasMarket && (
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
                )}

                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Merchant"}
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
            {merchants.length != 0 ? "Merchants List" : "No Merchants Found"}
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
            {merchants.map((merchant, index) => (
              <TableRow key={merchant.slug}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{merchant.name}</TableCell>
                <TableCell>{merchant.description}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          setSelectedMerchant(merchant);
                          setFiles([]);
                          setLoading(false);
                        }}
                      >
                        {merchant.images?.length || 0}
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-2/3">
                      <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                          <DialogHeader>
                            <DialogTitle>Merchant Images</DialogTitle>
                            <DialogDescription>
                              {merchant.name}
                            </DialogDescription>
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
                          {merchant.images?.map((image) => (
                            <div
                              className="flex flex-col gap-4 w-32 h-full object-fill"
                              key={image.id}
                            >
                              <img
                                src={image.url}
                                className="w-full"
                                alt={merchant.name}
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
                          setSelectedMerchant(merchant);
                          form.reset({
                            name: merchant.name,
                            description: merchant.description,
                            addresses: merchant.addresses || "",
                            marketId: merchant.market_id?.toString() || "",
                            userId: merchant.user_id,
                            longitude: merchant.longitude,
                            latitude: merchant.latitude,
                          });
                          setMapCoordinates({
                            lat: parseFloat(merchant.latitude),
                            lng: parseFloat(merchant.longitude),
                          });
                          setHasMarket(!merchant.market_id == null);
                        }}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Merchant</DialogTitle>
                        <DialogDescription>
                          Update the details of the merchant below.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handleEditMerchant)}
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
                                    placeholder="Enter merchant name"
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
                                    placeholder="Enter merchant description"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex items-center gap-2 pb-2">
                            <Checkbox
                              id="inTheMarket"
                              checked={hasMarket}
                              onCheckedChange={() => setHasMarket(!hasMarket)}
                            />
                            <label
                              htmlFor="inTheMarket"
                              className="peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed"
                            >
                              In the market
                            </label>
                          </div>

                          {hasMarket && (
                            <FormField
                              control={form.control}
                              name="marketId"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Market</FormLabel>
                                  <FormControl>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                              "w-[200px] justify-between",
                                              !field.value &&
                                                "text-muted-foreground"
                                            )}
                                            onChange={() => {
                                              setSelectedMarket(
                                                markets.find(
                                                  (market) =>
                                                    market.id.toString() ===
                                                    field.value
                                                )
                                              );
                                              console.log(
                                                "selectedMarket",
                                                selectedMarket
                                              );
                                            }}
                                          >
                                            {field.value
                                              ? markets.find(
                                                  (market) =>
                                                    market.id.toString() ===
                                                    field.value
                                                )?.name
                                              : "Select market"}
                                            <ChevronsUpDown className="opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="p-0 w-[200px]">
                                        <Command>
                                          <CommandInput
                                            placeholder="Search market..."
                                            className="h-9"
                                          />
                                          <CommandList>
                                            <CommandEmpty>
                                              No market found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                              {markets.map((market) => (
                                                <CommandItem
                                                  value={market.name}
                                                  key={market.id}
                                                  onSelect={() => {
                                                    form.setValue(
                                                      "marketId",
                                                      market.id.toString()
                                                    );
                                                    setSelectedMarket(market);
                                                  }}
                                                >
                                                  {market.name}
                                                  <Check
                                                    className={cn(
                                                      "ml-auto",
                                                      market.id.toString() ===
                                                        field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    )}
                                                  />
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {!hasMarket && (
                            <FormField
                              control={form.control}
                              name="addresses"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Addresses</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter merchant addresses"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {merchant.profile_image_url && (
                            <img
                              src={merchant.profile_image_url}
                              alt={merchant.name}
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

                          {!hasMarket && (
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
                          )}

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
                        onClick={() => setSelectedMerchant(merchant)}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this merchant?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {`This action will permanently delete the merchant "${selectedMerchant?.name}".`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setSelectedMerchant(merchant)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteMerchant}>
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
