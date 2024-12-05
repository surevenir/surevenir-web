"use client";

import { TypographyH4, TypographyMuted } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "@/app/types/types";
import { useState } from "react";
import { toast } from "sonner";
import { getUserById, updateUser } from "@/utils/userActions";
import Cookies from "js-cookie";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import DashboardProfileSkeleton from "./DashboardProfileSkeleton";

const formSchema = z.object({
  full_name: z.string().optional(),
  username: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
  image: z.instanceof(File).optional(),
});

type FormProfile = z.infer<typeof formSchema>;

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: -8.510014814449596,
  lng: 115.25923437673299,
};

interface DashboardProfileViewProps {
  user: User | null;
}

export default function DashboardProfileView({
  user: initialUser,
}: DashboardProfileViewProps) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser);
  const [mapCoordinates, setMapCoordinates] = useState(defaultCenter);
  const [file, setFile] = useState<File>();

  const token = Cookies.get("userId");

  const form = useForm<FormProfile>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      username: user?.username || "",
      address: user?.address || "",
      longitude: user?.longitude || "",
      latitude: user?.latitude || "",
      phone: user?.phone || "",
      image: undefined,
    },
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const handleEditUser = async (data: FormProfile) => {
    setLoading(true);
    console.log("data", JSON.stringify(data, null, 2));

    try {
      const result = await updateUser(
        { ...data, id: user?.id as string },
        token as string,
        file
      );

      console.log("result", JSON.stringify(result, null, 2));

      if (result) {
        toast.success("Successfully updated user");
        await fetchUser();
      } else {
        toast.error("Failed to update");
      }
    } catch (error: any) {
      console.error("Error updating product:", error.message);
      toast("An error occurred while updating the user");
    } finally {
      setLoading(false);
      setFile(undefined);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await getUserById(token as string, token as string);
      setUser(data);
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
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

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();
    if (lat && lng) {
      form.setValue("latitude", lat.toString());
      form.setValue("longitude", lng.toString());
      setMapCoordinates({ lat, lng });
    }
  };

  return (
    <>
      <div className="px-8">
        <TypographyH4 className="pb-2">Profile</TypographyH4>
        <TypographyMuted className="pb-2">
          This is how others will see you on the site.
        </TypographyMuted>
        <hr />

        {loading && <DashboardProfileSkeleton />}

        {!loading && isLoaded && (
          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleEditUser)}
                className="flex gap-4"
              >
                <div className="space-y-4 py-4 w-1/2">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fullname</FormLabel>
                        <FormControl>
                          <Input placeholder="Fullname" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Address" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Phone"
                            {...field}
                            type="text"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-start gap-4">
                    {user?.profile_image_url && (
                      <img
                        src={user.profile_image_url}
                        alt={user.username}
                        className="rounded-full w-24 h-24 overflow-hidden object-cover"
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Image</FormLabel>
                          <FormControl className="w-full">
                            <Input
                              className="w-full"
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
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-4 py-4 w-1/2">
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
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </>
  );
}
